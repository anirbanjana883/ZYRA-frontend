import React, { useEffect, useState } from "react";
import dp from "../assets/dp.png";
import { useSelector } from "react-redux";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { FaEye } from "react-icons/fa";

function StoryCard({ storyData }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const { userData } = useSelector((state) => state.user);
  const [showViewers, setShowViewers] = useState(false);

  // Auto progress story timer
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          navigate("/");
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="w-full max-w-[500px] h-screen mx-auto border-x border-gray-800 relative flex flex-col justify-center overflow-hidden bg-black">
      {/* Story Background (Video/Image) */}
      {!showViewers && (
        <div className="absolute inset-0 z-0">
          {storyData.mediaType === "image" ? (
            <img
              src={storyData.media}
              alt="story"
              className="w-full h-full object-cover"
            />
          ) : (
            <VideoPlayer media={storyData.media} />
          )}
        </div>
      )}

      {/* Top Header */}
      {!showViewers && (
        <div className="absolute top-6 left-0 flex items-center gap-3 px-5 z-20">
          <IoArrowBack
            size={28}
            className="text-white cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => navigate(`/`)}
          />
          <div className="w-10 h-10 border-2 border-white rounded-full overflow-hidden">
            <img
              src={storyData.author?.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-[200px] font-semibold text-lg truncate text-white drop-shadow-md">
            {storyData.author?.userName || "Unknown User"}
          </div>
        </div>
      )}

      {/* Progress bar */}
      {!showViewers && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-[95%] max-w-[480px] h-1 bg-gray-700 rounded-full z-20">
          <div
            className="h-full bg-white rounded-full transition-all duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Viewer count strip (only owner can see) */}
      {!showViewers &&
        storyData?.author?.userName === userData?.userName && (
          <div
            className="absolute w-full h-16 flex items-center gap-3 bottom-0 p-4 left-0 text-white bg-gradient-to-t from-black/80 to-transparent  cursor-pointer "
            onClick={() => setShowViewers(true)}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <FaEye className="text-base" />
              {storyData?.viewers?.filter(
                (viewer) => viewer.userName !== userData?.userName
              ).length || 0}
            </div>

            <div className="relative flex -space-x-3">
              {storyData?.viewers
                ?.filter((viewer) => viewer.userName !== userData?.userName)
                .slice(0, 3)
                .map((viewer, index) => (
                  <div
                    key={viewer._id || index}
                    className="w-7 h-7 border-2 border-white rounded-full overflow-hidden shadow-md"
                  >
                    <img
                      src={viewer?.profileImage || dp}
                      alt={viewer?.userName || "viewer"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Viewers List Overlay */}
      {showViewers && (
        <div
          className="absolute inset-0 bg-black/95 z-30 flex flex-col"
          onClick={() => setShowViewers(false)}
        >
          <div
            className="w-full h-[70%] mt-auto rounded-t-2xl p-5 bg-gray-900 border-t border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white flex items-center gap-2 mb-5 text-lg font-medium">
              <FaEye className="text-white" />
              <span className="font-bold">{storyData?.viewers?.length}</span>
              <span>Viewed by</span>
            </div>

            <div className="w-full h-full flex flex-col gap-4 overflow-y-auto">
              {storyData?.viewers?.map((viewer, index) => (
                <div
                  key={viewer._id || index}
                  className="w-full flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="w-12 h-12 border-2 border-white rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={viewer?.profileImage || dp}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-white text-lg font-medium">
                    {viewer?.userName || "Unknown User"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryCard;