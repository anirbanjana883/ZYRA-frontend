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
import { setStoryData, setCurrentUserStory } from "../redux/storySlice";

import { ClipLoader } from "react-spinners";

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
    if (file.type.includes("image")) setMediaType("image");
    else if (file.type.includes("video")) setMediaType("video");

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

      dispatch(setStoryData([result.data])); 
      dispatch(setCurrentUserStory(result.data));

      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log("Failed to upload story:", error.response?.data || error.message);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    if (uploadType === "Post") await uploadPost();
    else if (uploadType === "Loop") await uploadLoop();
    else if (uploadType === "Story") await uploadStory();

    // Reset state after upload
    setFrontendMedia(null);
    setBackendMedia(null);
    setCaption("");
  };

  return (
    <div className="w-full min-h-[100vh] bg-black flex flex-col items-center backdrop-blur-sm overflow-hidden">
      {/* Back Button */}
      <div className="w-full h-[80px] flex items-center gap-4 px-6 mt-2">
        <IoArrowBack
          size={30}
          className="text-blue-400 hover:text-blue-200 cursor-pointer transition duration-300 shadow-[0_0_10px_#00d4ff,0_0_20px_#9500ff]"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-[20px] font-semibold drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]">
          Upload Media
        </h1>
      </div>

      {/* Upload Type Selector */}
      <div className="w-[70%] max-w-[600px] h-[70px] bg-black/70 text-white border border-blue-500/30 rounded-full flex justify-around items-center gap-3 px-2 py-1 mt-5">
        {["Post", "Story", "Loop"].map((type) => (
          <div
            key={type}
            className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all duration-300
              ${
                uploadType === type
                  ? "bg-gradient-to-r from-[#9500ff] to-[#00d4ff] text-white shadow-[0_0_15px_#00d4ff]"
                  : "hover:bg-gradient-to-r hover:from-[#9500ff] hover:to-[#00d4ff] hover:text-white hover:shadow-[0_0_15px_#00d4ff]"
              }`}
            onClick={() => setUploadType(type)}
          >
            {type}
          </div>
        ))}
      </div>

      {/* Upload Form */}
      {!frontendMedia && (
        <div
          className="w-[80%] max-w-[500px] h-[250px] bg-black/70 backdrop-blur-md border-2 border-blue-500/40 
                    flex flex-col items-center justify-center gap-3 mt-[15vh] rounded-2xl cursor-pointer
                    hover:border-blue-400 hover:shadow-[0_0_25px_#00d4ff] transition-all duration-300"
          onClick={() => mediaInput.current.click()}
        >
          <input
            type="file"
            hidden
            ref={mediaInput}
            onChange={handleMedia}
            accept={uploadType.toLowerCase() === "loop" ? "video/*" : "image/*,video/*"}
          />
          <FaRegSquarePlus className="text-white w-[30px] h-[30px] drop-shadow-[0_0_8px_#00d4ff]" />
          <div className="text-white text-[19px] font-semibold drop-shadow-[0_0_8px_#00d4ff]">
            Upload {uploadType}
          </div>
        </div>
      )}

      {frontendMedia && (
        <div className="w-[80%] max-w-[500px] flex flex-col items-center justify-center mt-[3vh] gap-4">
          {/* Image */}
          {mediaType === "image" && (
            <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-[0_0_20px_#00d4ff] border-2 border-blue-400">
              <img
                src={frontendMedia}
                alt={`${uploadType} preview`}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          )}

          {/* Video */}
          {mediaType === "video" && (
            <div className="w-full max-w-[400px] h-[350px] rounded-2xl overflow-hidden shadow-[0_0_20px_#00d4ff] border-2 border-blue-400">
              <VideoPlayer media={frontendMedia} />
            </div>
          )}

          {/* Caption */}
          {uploadType.toLowerCase() !== "story" && (
            <input
              type="text"
              className="w-full px-3 py-2 mt-4 rounded-md bg-black/50 border-b-2 border-blue-400/50 text-white placeholder-blue-300 outline-none drop-shadow-[0_0_10px_#00d4ff]"
              placeholder="Write caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          )}
        </div>
      )}

      {/* Upload Button */}
      {frontendMedia && (
        <button
          className="w-[60%] max-w-[400px] py-3 px-5 mt-6 rounded-full
                     bg-gradient-to-br from-[#9500ff] to-[#00d4ff] text-white font-semibold text-lg
                     shadow-[0_0_15px_#9500ff,0_0_25px_#00d4ff] hover:shadow-[0_0_25px_#00d4ff,0_0_40px_#9500ff]
                     transition-all duration-300 cursor-pointer"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? <ClipLoader size={30} color="white" /> : `Upload ${uploadType}`}
        </button>
      )}
    </div>
  );
}

export default Upload;
