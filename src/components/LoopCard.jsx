import React, { useEffect, useRef, useState } from "react";
import { IoVolumeMediumOutline, IoVolumeMuteOutline } from "react-icons/io5";
import dp from "../assets/dp.png";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import { setLoopData } from "../redux/loopSlice";
import axios from "axios";
import { serverUrl } from "../App";
import { IoSend } from "react-icons/io5";

function LoopCard({ loop }) {
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const authorId = loop.author?._id || loop.author;
  const { userData } = useSelector((state) => state.user);
  const { loopData } = useSelector((state) => state.loop);
  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const commentRef = useRef();

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
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

  const handleLikeOnDoubleClick = () => {
    setShowHeart(true);

    setTimeout(() => setShowHeart(false), 1200);

    if (!loop.likes.includes(userData._id)) {
      handleLike();
    }
  };

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`, {
        withCredentials: true,
      });
      const updatedLoop = result.data;

      const updatedLoops = loopData.map((p) =>
        p._id == loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/loop/comment/${loop._id}`,
        { message },
        {
          withCredentials: true,
        }
      );
      const updatedLoop = result.data;

      const updatedLoops = loopData.map((p) =>
        p._id == loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
      setMessage("")
    } catch (error) {
      console.error("Error comment the post:", error);
    }
  };

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false);
      }
    };
    if (showComment) {
      document.addEventListener("mousedown", handleClickOutSide);
    } else {
      document.removeEventListener("mousedown", handleClickOutSide);
    }
  }, [showComment]);

  const toggleMute = () => {
    const newMuteState = !isMute;
    setIsMute(newMuteState);
    if (videoRef.current) {
      videoRef.current.muted = newMuteState;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
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

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full h-[100vh] flex items-center justify-center relative overflow-hidden">
      {/* heart animation */}
      {showHeart && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      heart-animation z-50"
        >
          <GoHeartFill
            onClick={handleLike}
            className="w-[100px] h-[100px] text-red-600 drop-shadow-2xl"
          />
        </div>
      )}

      {/* comment */}
      <div
        ref={commentRef}
        className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px] rounded-t-3xl bg-[#0e1718]
  transition-transform duration-500 ease-in-out shadow-2xl shadow-black
  left-0 ${showComment ? "translate-y-0" : "translate-y-[100%]"}`}
      >
        <h1 className="text-white text-[20px] text-center font-semibold">
          Comments
        </h1>

        {/* mapping the comment */}
        <div className="w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]">
          {loop.comments.length == 0 && (
            <div className="text-center text-white text-[20px] font-semibold mt-[50px]">
              No Comments Yet
            </div>
          )}
          {loop.comments?.map((com, index) => (
            <div className="w-full flex flex-col gap-[5px] border-b border-gray-800 justify-center pb-[10px]  mt-[10px]">
              <div className="w-full flex justify-between items-center ">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-black rounded-full overflow-hidden">
                    <img
                      src={com.author?.profileImage || dp}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="max-w-[200px] font-semibold truncate text-white">
                    {com.author?.userName || "Unknown User"}
                  </div>
                </div>
              </div>

                <div className="text-white pl-[60px]">
                  {com.message}
                </div>

            </div>
          ))}
        </div>

        {/* profile iamge , input ,button  */}
        <div className="w-full h-[80px] flex fixed bottom-0 items-center justify-between py-[50px] px-[20px]pl-10 pr-10">
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
            className="px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px] text-white"
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
            <IoSend className="w-[25px] h-[25px] text-white" />
          </button>
          }
          
        </div>
      </div>
      {/* video */}
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

      {/* progress bar */}
      <div className="absolute bottom-0 w-full lg:w-[480px] h-[5px] bg-gray-900">
        <div
          className="h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* mute/unmute button */}
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

      {/* user details */}

      <div className="w-full absolute h-[100px] bottom-[10px] px-[10px] flex flex-col gap-[10px]">
        <div className="flex items-center gap-4">
          <div
            className="w-15 h-15 md:w-14 md:h-14 border-5 border-black rounded-full overflow-hidden
          cursor-pointer"
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
          {/* follow button */}

          {userData &&
            authorId &&
            String(userData._id) !== String(authorId) && (
              <FollowButton
                targetUserId={authorId}
                tailwind="px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white cursor-pointer relative z-[50]"
              />
            )}
        </div>

        {/* caption */}
        <div className="text-white px-[10px]">{loop.caption}</div>

        {/* like & comment */}
        <div
          className="absolute right-0 flex flex-col gap-[20px] text-white 
        bottom-[180px] justify-center px-[10px] "
        >
          {/* like */}
          <div className="flex flex-col items-center cursor-pointer">
            {/* like icon */}
            <div>
              {/* not liked */}
              {!loop.likes?.includes(userData._id) && (
                <GoHeart
                  onClick={handleLike}
                  className="w-[30px] cursor-pointer h-[30px]"
                />
              )}
              {/* liked */}
              {loop.likes?.includes(userData._id) && (
                <GoHeartFill
                  onClick={handleLike}
                  className="w-[30px] cursor-pointer h-[30px] text-red-600"
                />
              )}
            </div>
            {/* like count  */}
            <div>{loop.likes?.length || 0}</div>
          </div>

          {/* comment */}
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setShowComment(true)}
          >
            {/* commwnt icon */}
            <div>
              <MdOutlineComment className="w-[30px] cursor-pointer h-[30px]" />
            </div>
            {/* comment count  */}
            <div>{loop.comments?.length || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoopCard;
