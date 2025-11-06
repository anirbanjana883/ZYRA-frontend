import React, { useEffect, useRef, useState } from "react";
import {
  IoVolumeMediumOutline,
  IoVolumeMuteOutline,
  IoSend,
} from "react-icons/io5";
import dp from "../assets/dp.png";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import { setLoopData, toggleMute } from "../redux/loopSlice";
import axios from "axios";
import { serverUrl } from "../App";
import { BiSend } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

function LoopCard({ loop }) {
  const videoRef = useRef();
  const commentRef = useRef();

  const [isPlaying, setIsPlaying] = useState(true);
  const { isMute } = useSelector((state) => state.loop); // GLOBAL
  const [progress, setProgress] = useState(0);

  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const [replyInputId, setReplyInputId] = useState(null); // ADDED: Track which comment reply input is open
  const [replyMessage, setReplyMessage] = useState(""); // ADDED: Reply text
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const { loopData } = useSelector((state) => state.loop);

  const authorId = loop.author?._id || loop.author;

  const likedByUser = loop.likes?.includes(userData._id);

  // ====================== VIDEO CONTROLS ======================
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) setProgress((video.currentTime / video.duration) * 100);
  };

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
  dispatch(toggleMute());
};

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  // ====================== LIKE FUNCTION ======================
  const handleLike = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`, {
        withCredentials: true,
      });
      const updatedLoop = res.data;
      const updatedLoops = loopData.map((p) =>
        p._id === loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
    } catch (err) {
      console.error("Error liking loop:", err);
    }
  };

  const handleLikeOnDoubleClick = () => {
    if (!likedByUser) handleLike();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
  };

  // ====================== COMMENT FUNCTION ======================
  const handleComment = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/loop/comment/${loop._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedLoop = res.data;
      const updatedLoops = loopData.map((p) =>
        p._id === loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
      setMessage("");
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  // ====================== REPLY FUNCTION ======================
  const handleReply = async (commentId) => {
    if (!replyMessage.trim()) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/loop/reply/${loop._id}/${commentId}`,
        { message: replyMessage },
        { withCredentials: true }
      );
      const updatedLoop = res.data;
      const updatedLoops = loopData.map((p) =>
        p._id === loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
      setReplyMessage("");
      setReplyInputId(null);
    } catch (err) {
      console.error("Error replying:", err);
    }
  };

  // ====================== DELETE COMMENT/REPLY ======================
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `${serverUrl}/api/loop/comment/${loop._id}/${commentId}`,
        {
          withCredentials: true,
        }
      );
      const updatedLoop = res.data.loop;
      const updatedLoops = loopData.map((p) =>
        p._id === loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const res = await axios.delete(
        `${serverUrl}/api/loop/reply/${loop._id}/${commentId}/${replyId}`,
        { withCredentials: true }
      );
      const updatedLoop = res.data.loop;
      const updatedLoops = loopData.map((p) =>
        p._id === loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
    } catch (err) {
      console.error("Error deleting reply:", err);
    }
  };

  // ====================== DELETE LOOP ======================
  const handleDeleteLoop = async () => {
    try {
      const res = await axios.delete(
        `${serverUrl}/api/loop/delete/${loop._id}`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const updatedLoops = loopData.filter((p) => p._id !== loop._id);
        dispatch(setLoopData(updatedLoops));
        setShowDeleteModal(false); // close modal after delete
      }
    } catch (err) {
      console.error("Error deleting loop:", err);
    }
  };

  // ====================== CLOSE COMMENT MODAL ======================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false);
        setReplyInputId(null);
      }
    };
    if (showComment) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showComment]);

  // ====================== SOCKET REALTIME UPDATES ======================
  useEffect(() => {
    socket?.on("likedLoop", (updatedData) => {
      const updatedLoops = loopData.map((p) =>
        p._id === updatedData.loopId ? { ...p, likes: updatedData.likes } : p
      );
      dispatch(setLoopData(updatedLoops));
    });

    socket?.on("commentedLoop", (updatedData) => {
      const updatedLoops = loopData.map((p) =>
        p._id === updatedData.loopId
          ? { ...p, comments: updatedData.comments }
          : p
      );
      dispatch(setLoopData(updatedLoops));
    });

    socket?.on("repliedLoop", (updatedData) => {
      const updatedLoops = loopData.map((p) =>
        p._id === updatedData.loopId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c._id === updatedData.commentId
                  ? { ...c, replies: updatedData.replies }
                  : c
              ),
            }
          : p
      );
      dispatch(setLoopData(updatedLoops));
    });

    return () => {
      socket?.off("likedLoop");
      socket?.off("commentedLoop");
      socket?.off("repliedLoop");
    };
  }, [socket, loopData, dispatch]);

  // ====================== JSX ======================
  return (
    <div className="w-full h-[100vh] flex items-center justify-center relative overflow-hidden">
      {/* Heart animation */}
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50">
          <GoHeartFill className="w-[100px] h-[100px] text-red-600 drop-shadow-2xl" />
        </div>
      )}

      {/* COMMENT MODAL */}
      <div
  ref={commentRef}
  className={`absolute z-[200] bottom-0 w-full max-w-[480px] mx-auto h-[500px] p-4 rounded-t-3xl 
    bg-gradient-to-t from-[#0e1718] via-[#0b1012] to-[#141e25] 
    transition-transform duration-500 ease-in-out shadow-2xl shadow-cyan-800/60
    left-0 ${showComment ? "translate-y-0" : "translate-y-[100%]"}`}
>
  <h1 className="text-white text-[22px] text-center font-bold tracking-wide drop-shadow-md">
    Comments
  </h1>

  {/* COMMENTS LIST */}
  <div className="w-full h-[350px] overflow-y-auto flex flex-col gap-4 px-2 mt-2 scrollbar-thin scrollbar-thumb-cyan-500/60 scrollbar-track-gray-900/20">
    {loop.comments.length === 0 && (
      <div className="text-center text-gray-400 text-[18px] font-medium mt-[50px]">
        No Comments Yet
      </div>
    )}

    {loop.comments?.map((com) => (
      <div
        key={com._id}
        className="flex flex-col gap-1 border-b border-gray-800 pb-3"
      >
        {/* Comment Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-cyan-600">
              <img
                src={com.author?.profileImage || dp}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-white font-semibold text-sm md:text-base truncate">
              {com.author?.userName || "Unknown User"}
            </div>
          </div>

          {/* DELETE COMMENT BUTTON */}
          {(com.author._id === userData._id ||
            loop.author._id === userData._id) && (
            <button
              onClick={() => handleDeleteComment(com._id)}
              className="text-red-500 text-xs hover:text-red-400 transition-all"
            >
              Delete
            </button>
          )}
        </div>

        {/* Comment Message */}
        <div className="text-gray-300 text-sm pl-12 md:pl-14">
          {com.message}
        </div>

        {/* Replies */}
        <div className="pl-12 flex flex-col gap-2 mt-1">
          {com.replies?.map((rep) => (
            <div
              key={rep._id}
              className="flex justify-between items-start bg-gray-900/70 px-2 py-1 rounded-lg backdrop-blur-sm"
            >
              <div className="flex items-start gap-2 text-gray-300 text-sm">
                <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-cyan-600 flex-shrink-0">
                  <img
                    src={rep.author?.profileImage || dp}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-semibold text-white mr-1">
                    {rep.author?.userName}:
                  </span>
                  {rep.message}
                </div>
              </div>

              {(rep.author._id === userData._id ||
                loop.author._id === userData._id) && (
                <button
                  onClick={() => handleDeleteReply(com._id, rep._id)}
                  className="text-red-500 text-xs hover:text-red-400 transition-all"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          {/* Reply Input */}
          {replyInputId === com._id && (
            <div className="flex gap-2 mt-2 items-center">
              <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-cyan-600">
                <img
                  src={userData?.profileImage || dp}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <input
                type="text"
                placeholder="Write a reply..."
                className="w-full px-2 py-1 rounded-md outline-none text-gray-300 bg-gray-800/70 placeholder-gray-400 backdrop-blur-sm"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
              <button
                onClick={() => handleReply(com._id)}
                className="bg-cyan-500 text-white p-1 rounded-md hover:bg-cyan-600 transition flex items-center justify-center cursor-pointer"
              >
                <BiSend size={16} />
              </button>
            </div>
          )}

          {/* Reply Button */}
          <button
            className="text-gray-400 text-xs hover:text-cyan-400 mt-1 transition-colors"
            onClick={() =>
              setReplyInputId(replyInputId === com._id ? null : com._id)
            }
          >
            Reply
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* COMMENT INPUT */}
  <div className="w-full h-[80px] flex fixed bottom-0 items-center justify-between py-4 px-4 bg-gradient-to-t from-[#0e1718] via-[#0b1012] to-[#141e25] backdrop-blur-md border-t border-cyan-700/50">
    <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-cyan-600 rounded-full overflow-hidden">
      <img
        src={userData?.profileImage || dp}
        alt="profile"
        className="w-full h-full object-cover"
      />
    </div>
    <input
      type="text"
      className="px-3 border-b-2 border-cyan-500 w-[85%] outline-none h-[40px] text-white placeholder-gray-400 bg-gray-900/70 backdrop-blur-sm rounded-md"
      placeholder="Write a comment..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />
    {message.trim() && (
      <IoSend
        onClick={handleComment}
        className="w-[25px] h-[25px] text-cyan-400 cursor-pointer hover:text-cyan-500 transition-colors"
      />
    )}
  </div>
</div>

      {/* VIDEO */}
      <video
        ref={videoRef}
        src={loop?.media}
        autoPlay
        loop
        muted={isMute}
        onClick={handleClick}
        onTimeUpdate={handleTimeUpdate}
        onDoubleClick={handleLikeOnDoubleClick}
        className="
      w-full h-full object-cover 
      border-l-[0.5px] border-r-[0.5px] border-gray-700
      lg:w-[480px] lg:h-[100vh] lg:border-l-2 lg:border-r-2 lg:border-gray-800
    "
      />

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 w-full lg:w-[480px] h-[5px] bg-gray-900">
        <div
          className="h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* MUTE/UNMUTE */}
      <div
        className="absolute top-[34px] right-[20px]  text-white bg-black/50 p-2 rounded-full cursor-pointer z-100"
        onClick={handleMuteToggle} 
      >
        {isMute ? (
          <IoVolumeMuteOutline size={25} />
        ) : (
          <IoVolumeMediumOutline size={25} />
        )}
      </div>

{/* USER INFO */}
<div className="w-full absolute bottom-[10px] px-4 flex flex-col gap-2 max-w-[480px] mx-auto">
  <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md p-2 rounded-2xl shadow-lg shadow-cyan-800/50">
    {/* Profile */}
    <div
      className="w-14 h-14 md:w-14 md:h-14 border-2 border-cyan-500 rounded-full overflow-hidden cursor-pointer"
      onClick={() =>
        loop.author?.userName && navigate(`/profile/${loop.author.userName}`)
      }
    >
      <img
        src={loop.author?.profileImage || dp}
        alt="profile"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Username */}
    <div className="max-w-[180px] font-semibold text-white text-sm md:text-base truncate drop-shadow-md">
      {loop.author?.userName || "Unknown User"}
    </div>

    {/* Follow Button */}
    {userData &&
      authorId &&
      String(userData._id) !== String(authorId) && (
        <FollowButton
          targetUserId={authorId}
          tailwind="px-3 py-1 text-white border-2 border-cyan-500 text-[14px] rounded-2xl hover:bg-cyan-500/20 transition relative z-[50]"
        />
      )}

    {/* Loop Owner Options (3-dot Menu) */}
    {String(userData._id) === String(authorId) && (
      <div className="relative ml-auto">
        <button
          className="text-white text-2xl px-2 cursor-pointer hover:text-cyan-400 transition-colors"
          onClick={() => setShowDeleteModal(true)}
        >
          <BsThreeDotsVertical />
        </button>
      </div>
    )}
  </div>

  {/* Caption */}
  <div className="text-white px-3 py-1 bg-black/50 backdrop-blur-sm rounded-xl text-sm md:text-base shadow-md shadow-cyan-800/50 break-words">
    {loop.caption}
  </div>

  {/* LIKE & COMMENT ICONS */}
  <div className="absolute right-0 flex flex-col gap-5 text-white bottom-[180px] justify-center px-[10px]">
    <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform duration-200">
      {!likedByUser ? (
        <GoHeart onClick={handleLike} className="w-8 h-8" />
      ) : (
        <GoHeartFill
          onClick={handleLike}
          className="w-8 h-8 text-red-500 drop-shadow-lg"
        />
      )}
      <div className="text-sm drop-shadow-md">{loop.likes?.length || 0}</div>
    </div>

    <div
      className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform duration-200"
      onClick={() => setShowComment(true)}
    >
      <MdOutlineComment className="w-8 h-8" />
      <div className="text-sm drop-shadow-md">{loop.comments?.length || 0}</div>
    </div>
  </div>
</div>

{/* Delete confirmation modal */}
{showDeleteModal && (
  <div
    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[999]"
    onClick={(e) => {
      if (e.target === e.currentTarget) setShowDeleteModal(false);
    }}
  >
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-[320px] text-center border-2 border-cyan-500">
      <p className="mb-4 font-semibold text-white text-lg">
        Delete this loop?
      </p>
      <div className="flex justify-around">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteLoop}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
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

export default LoopCard;
