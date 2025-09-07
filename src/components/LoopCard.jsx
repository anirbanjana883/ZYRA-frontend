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
import { setLoopData } from "../redux/loopSlice";
import axios from "axios";
import { serverUrl } from "../App";
import { BiSend } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

function LoopCard({ loop }) {
  const videoRef = useRef();
  const commentRef = useRef();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(true);
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

  const toggleMute = () => {
    const newMuteState = !isMute;
    setIsMute(newMuteState);
    if (videoRef.current) videoRef.current.muted = newMuteState;
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
        className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px] rounded-t-3xl bg-[#0e1718]
        transition-transform duration-500 ease-in-out shadow-2xl shadow-black
        left-0 ${showComment ? "translate-y-0" : "translate-y-[100%]"}`}
      >
        <h1 className="text-white text-[20px] text-center font-semibold">
          Comments
        </h1>

        {/* COMMENTS LIST */}
        <div className="w-full h-[350px] overflow-y-auto flex flex-col gap-[15px] px-2">
          {loop.comments.length === 0 && (
            <div className="text-center text-gray-300 text-[18px] font-medium mt-[50px]">
              No Comments Yet
            </div>
          )}

          {loop.comments?.map((com) => (
            <div
              key={com._id}
              className="flex flex-col gap-[5px] border-b border-gray-800 pb-3"
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-gray-700">
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

                {/* DELETE COMMENT BUTTON ✨ */}
                {(com.author._id === userData._id ||
                  loop.author._id === userData._id) && (
                  <button
                    onClick={() => handleDeleteComment(com._id)}
                    className="text-red-500 text-xs hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Comment Message ✨ */}
              <div className="text-gray-300 text-sm pl-12 md:pl-14">
                {com.message}
              </div>

              {/* Replies ✨ */}
              <div className="pl-12 flex flex-col gap-2 mt-1">
                {com.replies?.map((rep) => (
                  <div
                    key={rep._id}
                    className="flex justify-between items-start bg-gray-900 px-2 py-1 rounded-lg"
                  >
                    {/* Left side: profile + message */}
                    <div className="flex items-start gap-2 text-gray-300 text-sm">
                      {/* Small profile image */}
                      <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-gray-700 flex-shrink-0">
                        <img
                          src={rep.author?.profileImage || dp} // show author's image, not userData
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Message */}
                      <div>
                        <span className="font-semibold text-white mr-1">
                          {rep.author?.userName}:
                        </span>
                        {rep.message}
                      </div>
                    </div>

                    {/* Delete button */}
                    {(rep.author._id === userData._id ||
                      loop.author._id === userData._id) && (
                      <button
                        onClick={() => handleDeleteReply(com._id, rep._id)}
                        className="text-red-500 text-xs hover:text-red-400 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}

                {/* Reply Input ✨ */}
                {replyInputId === com._id && (
                  <div className="flex gap-2 mt-2 items-center">
                    {/* Small author profile image ✨ */}
                    <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-gray-700">
                      <img
                        src={userData?.profileImage || dp}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Write a reply..."
                      className="w-full px-2 py-1 rounded-md outline-none text-gray-400 bg-gray-800"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                    {/* send button */}
                    <button
                      onClick={() => handleReply(com._id)}
                      className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 transition flex items-center justify-center cursor-pointer"
                    >
                      <BiSend size={16} />
                    </button>
                  </div>
                )}

                {/* Reply Button ✨ */}
                <button
                  className="text-gray-400 text-xs hover:text-gray-200 mt-1"
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
        <div className="w-full h-[80px] flex fixed bottom-0 items-center justify-between py-[50px] px-[20px]">
          <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-black rounded-full overflow-hidden">
            <img
              src={userData?.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="text"
            className="px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px] text-white"
            placeholder="Write comments..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {message.trim() && (
            <IoSend
              onClick={handleComment}
              className="w-[25px] h-[25px] text-white cursor-pointer"
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
        onClick={toggleMute}
      >
        {isMute ? (
          <IoVolumeMuteOutline size={25} />
        ) : (
          <IoVolumeMediumOutline size={25} />
        )}
      </div>

      {/* USER INFO */}
      <div className="w-full absolute h-[100px] bottom-[10px] px-[10px] flex flex-col gap-[10px]">
        <div className="flex items-center gap-4">
          <div
            className="w-15 h-15 md:w-14 md:h-14 border-5 border-black rounded-full overflow-hidden cursor-pointer"
            onClick={() =>
              loop.author?.userName &&
              navigate(`/profile/${loop.author.userName}`)
            }
          >
            <img
              src={loop.author?.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-[200px] font-semibold text-white truncate">
            {loop.author?.userName || "Unknown User"}
          </div>

          {userData &&
            authorId &&
            String(userData._id) !== String(authorId) && (
              <FollowButton
                targetUserId={authorId}
                tailwind="px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white cursor-pointer relative z-[50]"
              />
            )}

          {/* Loop Owner Options (3-dot Menu) */}
          {String(userData._id) === String(authorId) && (
            <div className="relative">
              <button
                className="text-white text-2xl px-2 cursor-pointer"
                onClick={() => setShowDeleteModal(true)}
              >
                <BsThreeDotsVertical />
              </button>
            </div>
          )}
        </div>

        <div className="text-white px-[10px]">{loop.caption}</div>

        {/* LIKE & COMMENT ICONS */}
        <div className="absolute right-0 flex flex-col gap-[20px] text-white bottom-[180px] justify-center px-[10px] ">
          <div className="flex flex-col items-center cursor-pointer">
            {!likedByUser ? (
              <GoHeart
                onClick={handleLike}
                className="w-[30px] cursor-pointer h-[30px]"
              />
            ) : (
              <GoHeartFill
                onClick={handleLike}
                className="w-[30px] cursor-pointer h-[30px] text-red-600"
              />
            )}
            <div>{loop.likes?.length || 0}</div>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setShowComment(true)}
          >
            <MdOutlineComment className="w-[30px] cursor-pointer h-[30px]" />
            <div>{loop.comments?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}

      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-transparent z-[999]"
          onClick={(e) => {
            // Close only if clicked outside the modal box
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] text-center">
            <p className="mb-4 font-semibold">Delete this loop?</p>
            <div className="flex justify-around">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLoop}
                className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
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
