import React, { useEffect, useState } from "react";
import dp from "../assets/dp.png";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";
import axios from "axios";

function StoryDp({ profileImage, userName = "user", story }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { storyData,storyList } = useSelector((state) => state.story);
  const [viewed , setViewed] = useState(false)

  useEffect(()=>{
    if(story?.viewers?.some((viewer)=>viewer?._id?.toString()===userData._id.toString()
    || viewer?.toString() ==userData._id.toString())){
      setViewed(true);
    }else{
      setViewed(false)
    }
  },[story,userData,storyData,storyList])

  const handleViewers = async () => {
    if (!story?._id) return; 
    try {
      const result = await axios.get(
        `${serverUrl}/api/story/view/${story._id}`,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async () => {
    // Your Story: upload if none, else view
    if (!story && userName === "Your Story") {
      navigate("/upload");
    } else if (story && userName === "Your Story") {
      await handleViewers();
      navigate(`/story/${userData.userName}`);
    } else {
      await handleViewers();
      navigate(`/story/${userName}`);
    }
  };

  

  return (
    <div
      className="flex flex-col items-center gap-2 group cursor-pointer"
      onClick={handleClick}
    >
      {/* Outer ring (only if story exists) */}
      <div
        className={`w-[72px] h-[72px] ${
          !story ? null:
          !viewed ? "bg-gradient-to-b from-pink-500 to-yellow-500" :
          "bg-gradient-to-b from-gray-500 to-black-800"
        } rounded-full flex justify-center relative items-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}
      >
        {/* Profile image */}
        <div className="w-[66px] h-[66px] border-2 border-black rounded-full overflow-hidden relative">
          <img
            src={profileImage || dp}
            alt={userName}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Plus icon only if no story AND it's "Your Story" */}
        {!story && userName === "Your Story" && (
          <FiPlusCircle className="text-black absolute bottom-[2px] right-[2px] bg-white rounded-full w-[22px] h-[22px]" />
        )}
      </div>

      {/* Username */}
      <div className="text-white text-sm text-center max-w-[72px] truncate group-hover:underline">
        {userName}
      </div>
    </div>
  );
}

export default StoryDp;
