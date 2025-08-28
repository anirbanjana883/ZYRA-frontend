import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.png";
import { MdAttachment } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import { setMessages } from "../redux/messageSlice.js";
import {setSelectedUser } from "../redux/messageSlice.js";

function MessageArea() {
  const { selectedUser, messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const imageInput = useRef();
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const dispatch = useDispatch();

  const handleImage = (e) => {
    {
      const file = e.target.files[0];
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id) return;
    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(setMessages([...(messages || []), result.data]));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllMessages = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/message/getAll/${selectedUser._id}`,
        { withCredentials: true }
      );
      dispatch(setMessages(result.data.messages || []));

    } catch (error) {
      console.log(error);
    }
  };

   useEffect(() => {
    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) {
      dispatch(setSelectedUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  useEffect(() => {
  if (selectedUser?._id) {
    getAllMessages();
  }
}, [selectedUser]);


  return (
    <div className="w-full h-[100vh] bg-black relative">
      {/* profile image , back icon  */}
      <div className="flex items-center gap-[15px] px-[20px] py-[10px] top-0 z-[100] bg-black w-full">
        {/* back icon */}
        <div className=" h-[80px]  flex items-center gap-[20px] px-[20px]">
          <IoArrowBack
            size={30}
            className="text-white cursor-pointer hover:text-gray-300 "
            onClick={() => navigate(`/`)}
          />
        </div>

        {/* pprofile image  */}
        <div>
          <div
            className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
            onClick={() =>
              selectedUser && navigate(`/profile/${selectedUser.userName}`)
            }
          >
            <img
              src={selectedUser?.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* name and user name  */}

        <div
          className="text-white text-[18px] font-semibold 
        "
        >
          <div>{selectedUser?.userName}</div>
          <div className="text-[14px] text-gray-300">{selectedUser?.name}</div>
        </div>
      </div>

      {/* message */}
      <div
        className="w-full h-[80%] pt-[100px] pb-[120px] lg:pb-[150px] px-[40px] flex flex-col
      gap-[50px] overflow-auto bg-black"
      >
        {messages &&
          messages.map((mess, index) =>
            mess?.sender === userData?._id ? (
              <SenderMessage key={index} message={mess} />
            ) : (
              <ReceiverMessage key={index} message={mess} />
            )
          )}
      </div>

      {/* form */}
      <div className="w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-black z-[100]">
        <form
          className="w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#131616]
        flex items-center gap-[10px] px-[20px] relative"
          onSubmit={handleSendMessage}
        >
          {frontendImage && (
            <div className="w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden">
              <img src={frontendImage} alt="" className="h-full object-cover" />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={imageInput}
            className="hidden"
            onChange={handleImage}
          />

          <input
            type="text"
            placeholder="Message"
            className="w-full h-full px-[20px] text-[18px] text-white outline-0"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          {/* icon */}

          <div onClick={() => imageInput.current.click()}>
            <MdAttachment className="w-[28px] h-[28px] text-white cursor-pointer" />
          </div>
          {(input || frontendImage) && (
            <button
              className="w-[60px] h-[40px] rounded-full bg-gradient-to-br from-[#9500ff]
          to-[#ff0095] flex items-center justify-center cursor-pointer"
            >
              <IoSend className="w-[25px] h-[25px] " />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default MessageArea;
