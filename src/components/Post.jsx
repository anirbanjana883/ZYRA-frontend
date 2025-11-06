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
    if (!message.trim()) return;
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

  // Socket listeners
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
    <div className="w-[90%] max-w-[700px] flex flex-col gap-4 bg-[#0A0F1C] shadow-[0_0_25px_rgba(37,99,235,0.5)] rounded-2xl p-5 relative text-white">
      {/* Top: Profile + Follow + Options */}
      <div className="w-full flex justify-between items-center relative">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 md:w-14 md:h-14 border-2 border-blue-500/50 rounded-full overflow-hidden cursor-pointer shadow-[0_0_10px_rgba(37,99,235,0.7)] hover:scale-105 transition-transform"
            onClick={() => navigate(`/profile/${post.author.userName}`)}
          >
            <img
              src={post.author?.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-[200px] font-semibold truncate text-blue-400">
            {post.author?.userName || "Unknown User"}
          </div>
        </div>

        <div className="flex items-center gap-2" ref={menuRef}>
          {userData?._id !== post.author?._id && post.author && (
            <FollowButton
              tailwind="px-4 py-1 bg-blue-500/20 border border-blue-500 text-blue-300 rounded-2xl text-sm md:text-base cursor-pointer shadow hover:shadow-[0_0_10px_rgba(37,99,235,0.6)] transition-all duration-200"
              targetUserId={post.author?._id}
            />
          )}

          <button
            onClick={() => setShowOptions((prev) => !prev)}
            className="p-2 rounded-full hover:bg-blue-500/30 transition cursor-pointer"
          >
            <HiOutlineDotsHorizontal size={22} />
          </button>

          {showOptions && (
            <div className="absolute right-0 top-10 w-40 bg-gray-800/90 shadow-lg rounded-lg z-20">
              {post.author?._id === userData?._id ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-2 text-left text-white hover:bg-blue-500/20 rounded-t-lg cursor-pointer"
                >
                  Delete Post
                </button>
              ) : (
                <button
                  onClick={() => console.log("Report post")}
                  className="w-full px-4 py-2 text-left text-white hover:bg-blue-500/20 rounded-t-lg cursor-pointer"
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
            className="max-w-full max-h-[500px] object-contain rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          />
        )}
        {post.mediaType === "video" && (
          <div className="w-full max-w-[600px]">
            <VideoPlayer media={post.media} />
          </div>
        )}
      </div>

      {/* Post description & actions */}
      <div className="w-full flex justify-between items-center px-5 mt-2">
        <div className="flex justify-center items-center gap-5">
          <div className="flex items-center gap-2">
            {!post.likes?.includes(userData?._id) ? (
              <GoHeart
                onClick={handleLike}
                className="w-6 h-6 cursor-pointer hover:text-red-500 transition-all duration-300"
              />
            ) : (
              <GoHeartFill
                onClick={handleLike}
                className="w-6 h-6 cursor-pointer text-red-600 transition-all duration-300"
              />
            )}
            <span>{post.likes.length}</span>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          >
            <MdOutlineComment className="w-6 h-6" />
            <span>{post.comments.length}</span>
          </div>
        </div>

        <div onClick={handleSaved}>
          {!isSaved ? (
            <BsBookmarks className="w-6 h-6 cursor-pointer hover:text-blue-400 transition-all duration-300" />
          ) : (
            <BsBookmarksFill className="w-6 h-6 cursor-pointer text-blue-400 transition-all duration-300" />
          )}
        </div>
      </div>

      {/* caption */}
      {post.caption && (
        <div className="w-full px-5 flex gap-2 mt-2 text-blue-300">
          <h1 className="font-semibold">{post.author?.userName}</h1>
          <div>{post.caption}</div>
        </div>
      )}

      {/* comments */}
      {showComments && (
        <div className="w-full flex flex-col gap-4 px-2 py-3">
          {/* comment input */}
          <div className="flex items-center gap-2 relative">
            <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-blue-500/50 rounded-full overflow-hidden shadow-[0_0_10px_rgba(37,99,235,0.6)]">
              <img
                src={userData?.profileImage || dp}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 px-3 py-1 rounded bg-[#030712] border border-blue-500/50 outline-none text-white"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            {message && (
              <button
                onClick={handleComment}
                className="absolute right-2 hover:text-blue-400 transition"
              >
                <IoSend className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* comment list */}
          <div className="max-h-72 overflow-auto">
            {post.comments?.map((com) => (
              <div
                key={com._id}
                className="w-full px-3 py-3 border-b border-blue-500/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-blue-500/50 rounded-full overflow-hidden shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                    <img
                      src={com?.author?.profileImage || dp}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-300">
                      {com.author.userName}
                    </p>
                    <p className="text-gray-300">{com.message}</p>
                  </div>
                </div>

                <div className="ml-10 flex gap-3 text-sm text-blue-400 mt-1">
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
                    className="ml-10 mt-2 flex items-center gap-2"
                  >
                    <img
                      src={rep.author?.profileImage || dp}
                      alt="dp"
                      className="w-6 h-6 rounded-full border border-blue-500/50 shadow-[0_0_5px_rgba(37,99,235,0.6)]"
                    />
                    <span className="font-bold text-blue-300">
                      {rep.author.userName}
                    </span>
                    <p className="text-gray-300">{rep.message}</p>
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

                {/* reply input */}
                {replyingTo === com._id && (
                  <div className="ml-10 mt-2 flex gap-2">
                    <input
                      type="text"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 px-2 py-1 rounded bg-[#030712] border border-blue-500/50 text-white outline-none text-sm"
                    />
                    <button
                      onClick={() => handleReply(com._id)}
                      className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white px-3 py-1 rounded-md flex items-center justify-center cursor-pointer"
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
            <p className="mb-4 font-semibold text-white">
              Delete this post?
            </p>
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
