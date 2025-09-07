import React, { useEffect, useState, useRef } from "react";
import dp from "../assets/dp.png";
import VideoPlayer from "../components/VideoPlayer";
import axios from "axios";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import { BsBookmarks, BsBookmarksFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";
import { BiSend } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

function Post({ post }) {
  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { socket } = useSelector((state) => state.socket);

  const [showComments, setShowComments] = useState(false);
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const savedList = userData?.saved ?? [];
  const isSaved = savedList.some((s) =>
    typeof s === "string" || typeof s === "number"
      ? String(s) === String(post._id)
      : s?._id === post._id
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Like Post
  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, {
        withCredentials: true,
      });
      const updatedPost = result.data;
      const updatedPosts = postData.map((p) =>
        p._id === post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  // Comment on Post
  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedPost = result.data;
      const updatedPosts = postData.map((p) =>
        p._id === post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
      setMessage("");
    } catch (error) {
      console.error("Error commenting on the post:", error);
    }
  };

  // Reply to Comment
  const handleReply = async (commentId) => {
    if (!replyMessage.trim()) return;
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}/${commentId}/reply`,
        { message: replyMessage },
        { withCredentials: true }
      );
      const updatedPosts = postData.map((p) => (p._id === post._id ? data : p));
      dispatch(setPostData(updatedPosts));
      setReplyMessage("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Error replying to comment:", err);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    try {
      const { data } = await axios.delete(
        `${serverUrl}/api/post/comment/${post._id}/${commentId}`,
        { withCredentials: true }
      );
      if (!data || !data._id) return;
      const updatedPosts = postData.map((p) => (p._id === post._id ? data : p));
      dispatch(setPostData(updatedPosts));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // Delete Reply
  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const { data } = await axios.delete(
        `${serverUrl}/api/post/comment/${post._id}/${commentId}/reply/${replyId}`,
        { withCredentials: true }
      );
      const updatedPosts = postData.map((p) => (p._id === post._id ? data : p));
      dispatch(setPostData(updatedPosts));
    } catch (err) {
      console.error("Error deleting reply:", err);
    }
  };

  // Delete Post
  const handleDeletePost = async () => {
    try {
      await axios.delete(`${serverUrl}/api/post/delete/${post._id}`, {
        withCredentials: true,
      });
      const updatedPosts = postData.filter((p) => p._id !== post._id);
      dispatch(setPostData(updatedPosts));
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  // Save / Unsave Post
  const handleSaved = async () => {
    try {
      const { data: updatedUser } = await axios.get(
        `${serverUrl}/api/post/saved/${post._id}`,
        { withCredentials: true }
      );
      dispatch(setUserData(updatedUser));
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  // Real-time socket listeners
  useEffect(() => {
    socket?.on("likedPost", (updatedData) => {
      const updatedPosts = postData.map((p) =>
        p._id === updatedData.postId ? { ...p, likes: updatedData.likes } : p
      );
      dispatch(setPostData(updatedPosts));
    });

    socket?.on("commentedPost", (updatedData) => {
      const updatedPosts = postData.map((p) =>
        p._id === updatedData.postId
          ? { ...p, comments: updatedData.comments }
          : p
      );
      dispatch(setPostData(updatedPosts));
    });

    socket?.on("deletedPost", ({ postId }) => {
      const updatedPosts = postData.filter((p) => p._id !== postId);
      dispatch(setPostData(updatedPosts));
    });

    return () => {
      socket?.off("likedPost");
      socket?.off("commentedPost");
      socket?.off("deletedPost");
    };
  }, [socket, postData, dispatch]);

  return (
    <div className="w-[90%] max-w-[700px] flex flex-col gap-4 bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl p-5 relative">
      {/* Top: Profile + Follow + Options */}
      <div className="w-full flex justify-between items-center relative">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 md:w-14 md:h-14 border-2 border-black rounded-full overflow-hidden cursor-pointer"
            onClick={() => navigate(`/profile/${post.author.userName}`)}
          >
            <img
              src={post.author?.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-[200px] font-semibold truncate">
            {post.author?.userName || "Unknown User"}
          </div>
        </div>

        <div className="flex items-center gap-2" ref={menuRef}>
          {userData?._id !== post.author?._id && post.author && (
            <FollowButton
              tailwind="px-4 py-1 bg-black text-white rounded-2xl text-sm md:text-base cursor-pointer"
              targetUserId={post.author?._id}
            />
          )}

          {/* Post Options Menu */}
          <button
            onClick={() => setShowOptions((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
          >
            <HiOutlineDotsHorizontal size={22} />
          </button>

          {showOptions && (
            <div className="absolute right-0 top-10 w-40 bg-gray-600 shadow-lg rounded-lg z-20">
              {post.author?._id === userData?._id ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-100 hover:text-gray-800 rounded-t-lg cursor-pointer"
                >
                  Delete Post
                </button>
              ) : (
                <button
                  onClick={() => console.log("Report post")}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-100 hover:text-gray-800 rounded-t-lg cursor-pointer"
                >
                  Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post content */}
      <div className="w-full flex justify-center">
        {post.mediaType === "image" && (
          <img
            src={post.media}
            alt={`${post.mediaType} preview`}
            className="max-w-full max-h-[500px] object-contain rounded-xl"
          />
        )}
        {post.mediaType === "video" && (
          <div className="w-full max-w-[600px]">
            <VideoPlayer media={post.media} />
          </div>
        )}
      </div>

      {/* Post description */}
      <div className="w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]">
        {/* like and comment */}
        <div className="flex justify-center items-center gap-[10px]">
          {/* like */}
          <div className="flex justify-center items-center gap-[5px]">
            {!post.likes?.includes(userData?._id) ? (
              <GoHeart
                onClick={handleLike}
                className="w-[25px] cursor-pointer h-[25px]"
              />
            ) : (
              <GoHeartFill
                onClick={handleLike}
                className="w-[25px] cursor-pointer h-[25px] text-red-600"
              />
            )}
            <span>{post.likes.length}</span>
          </div>

          {/* comment */}
          <div
            className="flex justify-center items-center gap-[10px]"
            onClick={() => setShowComments(!showComments)}
          >
            <MdOutlineComment className="w-[25px] cursor-pointer h-[25px]" />
            <span>{post.comments.length}</span>
          </div>
        </div>

        {/* saved post */}
        <div onClick={handleSaved}>
          {!isSaved ? (
            <BsBookmarks className="w-[25px] cursor-pointer h-[25px]" />
          ) : (
            <BsBookmarksFill className="w-[25px] cursor-pointer h-[25px]" />
          )}
        </div>
      </div>

      {/* caption */}
      {post.caption && (
        <div className="w-full px-[20px] gap-[10px] flex justify-start items-center">
          <h1 className="font-semibold">{post.author?.userName}</h1>
          <div>{post.caption}</div>
        </div>
      )}

      {/* comments */}
      {showComments && (
        <div className="w-full flex flex-col gap-[30px] pb-[20px]">
          {/* input */}
          <div className="w-full h-[80px] flex items-center justify-between px-[20px] relative">
            <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-black rounded-full overflow-hidden">
              <img
                src={userData?.profileImage || dp}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <input
              type="text"
              className="px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]"
              placeholder="Write comments..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            {message && (
              <button
                className="absolute right-[20px] cursor-pointer"
                onClick={handleComment}
              >
                <IoSend className="w-[25px] h-[25px]" />
              </button>
            )}
          </div>

          {/* list */}
          <div className="w-full max-h-[300px] overflow-auto">
            {post.comments?.map((com) => (
              <div
                key={com._id}
                className="w-full px-[20px] py-[20px] border-b-2 border-b-gray-200"
              >
                <div className="flex items-center gap-[10px]">
                  <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-black rounded-full overflow-hidden">
                    <img
                      src={com?.author?.profileImage || dp}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{com.author.userName}</p>
                    <p>{com.message}</p>
                  </div>
                </div>

                <div className="ml-12 flex gap-3 text-sm text-gray-500 mt-1">
                  <button
                    className="hover:underline cursor-pointer"
                    onClick={() =>
                      setReplyingTo(replyingTo === com._id ? null : com._id)
                    }
                  >
                    Reply
                  </button>
                  {com.author._id === userData._id && (
                    <button
                      className="hover:underline text-red-500 cursor-pointer"
                      onClick={() => handleDeleteComment(com._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* replies */}
                {com.replies?.map((rep) => (
                  <div
                    key={rep._id}
                    className="ml-12 mt-2 flex items-center gap-2"
                  >
                    <img
                      src={rep.author?.profileImage || dp}
                      alt="dp"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-bold">{rep.author.userName}</span>
                    <p>{rep.message}</p>
                    {rep.author._id === userData._id && (
                      <button
                        className="text-red-500 text-xs ml-2 hover:underline cursor-pointer"
                        onClick={() => handleDeleteReply(com._id, rep._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}

                {replyingTo === com._id && (
                  <div className="ml-12 mt-2 flex gap-2">
                    <input
                      type="text"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Write a reply..."
                      className="border rounded px-2 py-1 text-sm flex-1"
                    />
                    <button
                      onClick={() => handleReply(com._id)}
                      className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 transition flex items-center justify-center cursor-pointer"
                    >
                      <BiSend size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg w-[300px] text-center">
            <p className="mb-4 font-semibold text-white">Delete this post?</p>
            <div className="flex justify-around">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
