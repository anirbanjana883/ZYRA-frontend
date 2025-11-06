import React, { useEffect, useState, useRef } from "react";
import dp from "../assets/dp.png";
import { useSelector, useDispatch } from "react-redux";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { FaEye } from "react-icons/fa";
import { serverUrl } from "../App";
import axios from "axios";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { setDeleteStory } from "../redux/storySlice";

function StoryCard({ storyData }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const { userData } = useSelector((state) => state.user);
  const [showViewers, setShowViewers] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    function handleClickOutside(e) {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverUrl}/api/story/delete/${storyData._id}`, {
        withCredentials: true,
      });
      dispatch(setDeleteStory(storyData._id));
      navigate("/");
    } catch (error) {
      console.log("Error deleting story:", error);
    }
  };

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
    <div className="w-full max-w-[500px] h-screen mx-auto relative flex flex-col justify-center overflow-hidden bg-black">
      {/* Story Background */}
      {!showViewers && (
        <div className="absolute inset-0 z-0">
          {storyData.mediaType === "image" ? (
            <img
              src={storyData.media}
              alt="story"
              className="w-full h-full object-cover brightness-90"
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
    className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
    onClick={() => navigate(`/`)}
  />
  <div className="w-12 h-12 border-2 border-blue-400 rounded-full overflow-hidden shadow-glow-blue">
    <img
      src={storyData.author?.profileImage || dp}
      alt="profile"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Username + Menu together */}
  <div className="flex items-center gap-2 max-w-[200px]">
    <div className="font-bold text-lg truncate text-blue-400 drop-shadow-md">
      {storyData.author?.userName || "Unknown User"}
    </div>

    {storyData?.author?._id === userData?._id && (
      <div className="relative" ref={optionsRef}>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-2 rounded-full hover:bg-blue-500/20 transition"
        >
          <HiOutlineDotsHorizontal className="text-blue-400 w-6 h-6" />
        </button>

        {showOptions && (
          <div className="absolute right-0 mt-2 w-36 bg-gray-900 text-white rounded-lg shadow-glow-blue overflow-hidden">
            <button
              onClick={() => {
                setShowOptions(false);
                setShowDeleteModal(true);
              }}
              className="w-full text-left px-4 py-2 hover:bg-blue-600/40 cursor-pointer"
            >
              Delete Story
            </button>
          </div>
        )}
      </div>
    )}
  </div>
</div>

      )}

      {/* Progress bar */}
      {!showViewers && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-[95%] max-w-[480px] h-1 bg-gray-700 rounded-full z-20">
          <div
            className="h-full bg-red-400 rounded-full shadow-glow-blue transition-all duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Viewer strip */}
      {!showViewers && storyData?.author?._id === userData?._id && (
        <div
          className="absolute w-full h-16 flex items-center gap-3 bottom-0 p-4 left-0 text-blue-400 bg-gradient-to-t from-black/80 to-transparent cursor-pointer"
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
                  className="w-7 h-7 border-2 border-blue-400 rounded-full overflow-hidden shadow-glow-blue"
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

      {/* Viewers Overlay */}
      {showViewers && (
        <div
          className="absolute inset-0 bg-black/95 z-30 flex flex-col"
          onClick={() => setShowViewers(false)}
        >
          <div
            className="w-full h-[70%] mt-auto rounded-t-2xl p-5 bg-gray-900 border-t border-blue-400"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-blue-400 flex items-center gap-2 mb-5 text-lg font-semibold">
              <FaEye className="text-blue-400" />
              <span className="font-bold">{storyData?.viewers?.length}</span>
              <span>Viewed by</span>
            </div>

            <div className="w-full h-full flex flex-col gap-4 overflow-y-auto">
              {storyData?.viewers?.map((viewer, index) => (
                <div
                  key={viewer._id || index}
                  className="w-full flex items-center gap-4 p-2 rounded-lg hover:bg-blue-500/10 transition"
                >
                  <div className="w-12 h-12 border-2 border-blue-400 rounded-full overflow-hidden flex-shrink-0 shadow-glow-blue">
                    <img
                      src={viewer?.profileImage || dp}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-blue-400 text-lg font-semibold">
                    {viewer?.userName || "Unknown User"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-glow-blue w-[300px] text-center">
            <p className="text-blue-400 mb-4 font-semibold">
              Are you sure you want to delete this story?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-700 rounded-lg text-blue-400 hover:bg-gray-600 cursor-pointer"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-500 cursor-pointer"
                onClick={handleDelete}
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

export default StoryCard;
