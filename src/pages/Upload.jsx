import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaRegSquarePlus } from "react-icons/fa6";
import VideoPlayer from "../components/VideoPlayer";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";

import { setPostData } from "../redux/postSlice";
import { setLoopData } from "../redux/loopSlice";
import { setStoryData } from "../redux/storySlice";

import { ClipLoader } from "react-spinners";
import { setUserData } from "../redux/userSlice";
import { setCurrentUserStory } from "../redux/storySlice";

function Upload() {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState("Post");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const mediaInput = useRef(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const postData = useSelector((state) => state.post.postData);
  const storyData = useSelector((state) => state.story.storyData);
  const loopData = useSelector((state) => state.loop.loopData);

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setMediaType("image");
    } else if (file.type.includes("video")) {
      setMediaType("video");
    }
    setBackendMedia(file);
    setFrontendMedia(URL.createObjectURL(file));
  };

  const uploadPost = async () => {
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const result = await axios.post(`${serverUrl}/api/post/upload`, formData, {
        withCredentials: true,
      });

      dispatch(setPostData([...postData, result.data]));
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log("Failed to upload post:", error);
    }
  };

  const uploadLoop = async () => {
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("media", backendMedia);

      const result = await axios.post(`${serverUrl}/api/loop/upload`, formData, {
        withCredentials: true,
      });

      dispatch(setLoopData([...loopData, result.data]));
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log("Failed to upload loop:", error);
    }
  };

const uploadStory = async () => {
  try {
    const formData = new FormData();
    formData.append("media", backendMedia);
    formData.append("mediaType", mediaType);

    const result = await axios.post(`${serverUrl}/api/story/upload`, formData, {
      withCredentials: true,
    });

    dispatch(setStoryData([result.data]));   // keep only the latest story
    dispatch(setCurrentUserStory(result.data)); // update the user's story

    setLoading(false);
    navigate("/");

  } catch (error) {
    setLoading(false);
    console.log("Failed to upload story:", error.response?.data || error.message);
  }
};



  const handleUpload = async () => {
    setLoading(true);
    if (uploadType === "Post") {
      await uploadPost();
    } else if (uploadType === "Loop") {
      await uploadLoop();
    } else if (uploadType === "Story") {
      await uploadStory();
    }
    // Reset state after upload
    setFrontendMedia(null);
    setBackendMedia(null);
    setCaption("");
  };

  return (
    <div className="w-full min-h-[100vh] bg-black flex flex-col items-center ">
      {/* back button */}
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
        <IoArrowBack
          size={30}
          className="text-white cursor-pointer hover:text-gray-300"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-[20px] font-semibold">Upload Media</h1>
      </div>

      {/* for post story loop button */}
      <div className="w-[70%] max-w-[600px] h-[70px] bg-white rounded-full flex justify-around items-center gap-[10px]">
        <div
          className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer ${
            uploadType === "Post"
              ? "bg-black text-white shadow-2xl shadow-black"
              : "hover:bg-black hover:text-white hover:shadow-2xl hover:shadow-black"
          }`}
          onClick={() => setUploadType("Post")}
        >
          Post
        </div>

        <div
          className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer ${
            uploadType === "Story"
              ? "bg-black text-white shadow-2xl shadow-black"
              : "hover:bg-black hover:text-white hover:shadow-2xl hover:shadow-black"
          }`}
          onClick={() => setUploadType("Story")}
        >
          Story
        </div>

        <div
          className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer ${
            uploadType === "Loop"
              ? "bg-black text-white shadow-2xl shadow-black"
              : "hover:bg-black hover:text-white hover:shadow-2xl hover:shadow-black"
          }`}
          onClick={() => setUploadType("Loop")}
        >
          Loop
        </div>
      </div>

      {/* upload form */}
      {!frontendMedia && (
        <div
          className="w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-2 border-gray-800 
            flex flex-col items-center justify-center gap-[8px] mt-[15vh] 
            rounded-2xl cursor-pointer hover:bg-[#353a3d]"
          onClick={() => mediaInput.current.click()}
        >
            <input
              type="file"
              hidden
              ref={mediaInput}
              onChange={handleMedia}
              accept={uploadType.toLowerCase() === "loop" ? "video/*" : "image/*,video/*"}
            />

          <FaRegSquarePlus className="text-white w-[25px] h-[25px]" />
          <div className="text-white text-[19px] font-semibold">
            Upload {uploadType}
          </div>
        </div>
      )}

      {frontendMedia && (
        <div className="w-[80%] max-w-[500px] h-[400px] flex flex-col items-center justify-center mt-[3vh]">
          {/* image */}
          {mediaType === "image" && (
            <div className="w-[80%] max-w-[500px] h-[400px] flex flex-col items-center justify-center mt-[3vh]">
              <img
                src={frontendMedia}
                alt={`${uploadType} preview`}
                className="h-full w-full object-cover rounded-2xl"
              />
              {uploadType.toLowerCase() !== "story" && (
                <input
                  type="text"
                  className="w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]"
                  placeholder="Write caption"
                  onChange={(e) => setCaption(e.target.value)}
                  value={caption}
                />
              )}
            </div>
          )}

          {/* video */}
          {mediaType === "video" && (
            <div className="w-[60%] max-w-[300px] h-[350px] flex flex-col items-center justify-center mt-[3vh]">
              <VideoPlayer media={frontendMedia} />
              {uploadType.toLowerCase() !== "story" && (
                <input
                  type="text"
                  className="w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]"
                  placeholder="Write caption"
                  onChange={(e) => setCaption(e.target.value)}
                  value={caption}
                />
              )}
            </div>
          )}
        </div>
      )}

      {frontendMedia && (
        <button
          className="px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-[white] mt-[50px] cursor-pointer rounded-2xl font-semibold text-[20px] text-black hover:bg-gray-200"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? <ClipLoader size={30} color="black" /> : `Upload ${uploadType}`}
        </button>
      )}
    </div>
  );
}

export default Upload;
