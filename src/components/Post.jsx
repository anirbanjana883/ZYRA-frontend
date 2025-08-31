import React, { useState } from "react";
import dp from "../assets/dp.png";
import VideoPlayer from "../components/VideoPlayer";
import axios from "axios";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";

import { MdOutlineComment } from "react-icons/md";

import { BsBookmarks } from "react-icons/bs";
import { BsBookmarksFill } from "react-icons/bs";

import { IoSend } from "react-icons/io5";

import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";

function Post({ post }) {
  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);

  const [showComments, setShowComments] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const savedList = userData?.saved ?? [];
const isSaved = savedList.some(s =>
  typeof s === "string" || typeof s === "number"
    ? String(s) === String(post._id)
    : s?._id === post._id
);

  // for like
  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, {
        withCredentials: true,
      });
      const updatedPost = result.data;

      const updatedPosts = postData.map((p) =>
        p._id == post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };
  // for comment
  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedPost = result.data;

      const updatedPosts = postData.map((p) =>
        p._id == post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
      setMessage("")
    } catch (error) {
      console.error("Error commenting on the post:", error);
    }
  };

const handleSaved = async () => {
  try {
    const { data: updatedUser } = await axios.get(
      `${serverUrl}/api/post/saved/${post._id}`,
      { withCredentials: true }
    );
    dispatch(setUserData(updatedUser)); // <-- replace entire userData
  } catch (error) {
    console.error("Error saving post:", error);
  }
};

  return (
    <div className="w-[90%] max-w-[700px] flex flex-col gap-4 bg-white items-center shadow-2xl 
    shadow-[#00000058] rounded-2xl p-5">
      {/* Top: Profile + Follow button */}
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 border-2 border-black rounded-full overflow-hidden cursor-pointer"
            onClick={()=>navigate(`/profile/${post.author.userName}`)}
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

        {/* follow button */}
        {userData?._id !== post.author?._id && post.author && (
          <FollowButton
            tailwind="px-4 py-1 bg-black text-white rounded-2xl text-sm md:text-base cursor-pointer"
            targetUserId={post.author._id}
          />
        )}

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
        {/* like and commet */}
        <div className="flex justify-center items-center gap-[10px]">
          {/* like */}
          <div className="flex justify-center items-center gap-[5px]">
            {/* not liked */}
            {!post.likes?.includes(userData._id) && (
              <GoHeart
                onClick={handleLike}
                className="w-[25px] cursor-pointer h-[25px]"
              />
            )}
            {/* liked */}
            {post.likes?.includes(userData._id) && (
              <GoHeartFill
                onClick={handleLike}
                className="w-[25px] cursor-pointer h-[25px] text-red-600"
              />
            )}
            {/* like count  */}
            <span>{post.likes.length}</span>
          </div>

          {/* comment */}
          <div
            className="flex justify-center items-center gap-[10px]"
            onClick={() => setShowComments(!showComments)}
          >
            <MdOutlineComment className="w-[25px] cursor-pointer h-[25px]" />
            {/* comment count */}
            <span>{post.comments.length}</span>
          </div>
        </div>

        {/* saved post */}
        <div onClick={handleSaved}>
        {!isSaved && (
          <BsBookmarks className="w-[25px] cursor-pointer h-[25px]" />
        )}
        {isSaved && (
          <BsBookmarksFill className="w-[25px] cursor-pointer h-[25px]" />
        )}
      </div>
      </div>

      {/* caption */}
      {post.caption && (
        <div className="w-full px-[20px] gap-[10px] flex justify-start items-center">
          <h1>{post.author?.userName || "Unknown User"}</h1>
          <div>{post.caption}</div>
        </div>
      )}

      {/* commenting system  */}
      {showComments && (
        <div className="w-full flex flex-col gap-[30px] pb-[20px]">
          <div className="w-full h-[80px] flex items-center justify-between px-[20px] relative">
            {/* profile image  */}
            <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-black rounded-full overflow-hidden">
              <img
                src={userData?.profileImage || dp}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* input  */}
            <input
              type="text"
              className="px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px] "
              placeholder="Write comments..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            {/* send button */}
            {message &&
              <button
              className="absolute right-[20px] cursor-pointer "
              onClick={handleComment}
            >
              <IoSend className="w-[25px] h-[25px]" />
            </button>
            }
            
          </div>

          {/* comments showing here*/}
          <div className="w-full max-h-[300px] overflow-auto">
            {post.comments?.map((com, index) => (
              <div
                key={index}
                className="w-full px-[20px] py-[20px] flex items-center gap-[20px] border-b-2 border-b-gray-200"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-black rounded-full overflow-hidden">
                  <img
                    src={com.author?.profileImage || dp}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>{com.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
