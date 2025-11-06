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
  const { storyData, storyList } = useSelector((state) => state.story);
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    if (
      story?.viewers?.some(
        (viewer) =>
          viewer?._id?.toString() === userData._id.toString() ||
          viewer?.toString() == userData._id.toString()
      )
    ) {
      setViewed(true);
    } else {
      setViewed(false);
    }
  }, [story, userData, storyData, storyList]);

  const handleViewers = async () => {
    if (!story?._id) return;
    try {
      await axios.get(`${serverUrl}/api/story/view/${story._id}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async () => {
    if (!story && userName === "Your Story") {
      navigate("/upload");
    } else {
      await handleViewers();
      navigate(`/story/${userName === "Your Story" ? userData.userName : userName}`);
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-2 group cursor-pointer"
      onClick={handleClick}
    >
      {/* Outer ring */}
      <div
        className={`w-[72px] h-[72px] rounded-full flex justify-center items-center relative transition-all duration-300
          ${!story ? "bg-black/70" : !viewed ? "bg-gradient-to-tr from-blue-400 to-purple-600" : "bg-gray-700"}
          group-hover:scale-105 group-hover:shadow-lg`}
      >
        {/* Profile image */}
        <div className="w-[66px] h-[66px] border-2 border-white rounded-full overflow-hidden relative">
          <img
            src={profileImage || dp}
            alt={userName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Plus icon */}
        {!story && userName === "Your Story" && (
          <FiPlusCircle className="text-blue-500 absolute bottom-[2px] right-[2px] bg-white rounded-full w-[22px] h-[22px]" />
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
