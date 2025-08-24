import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setStoryData } from "../redux/storySlice";
import StoryCard from "../components/StoryCard";

function Story() {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { storyData } = useSelector((state) => state.story);

  const handleStory = async () => {
    dispatch(setStoryData(null))
    try {
      const result = await axios.get(
        `${serverUrl}/api/story/getByUserName/${userName}`,
        { withCredentials: true }
      );

      if (result.data && result.data.media) {
        dispatch(setStoryData(result.data));
      } else {
        dispatch(setStoryData(null));
      }
    } catch (error) {
      console.log("Failed to fetch story:", error);
    }
  };
  useEffect(() => {
    if(userName){
      handleStory()
    }
  }, [userName, dispatch]);

  if (!storyData) {
    return (
      <div className="w-full h-[100vh] bg-black flex justify-center items-center">
        <p className="text-white">Loading story...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[100vh] bg-black flex justify-center items-center">
      <StoryCard storyData={storyData} />
    </div>
  );
}

export default Story;
