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
import { setMessages, setSelectedUser } from "../redux/messageSlice.js";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

function MessageArea() {
  const { selectedUser, messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const imageInput = useRef();
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const dispatch = useDispatch();

  const getDateLabel = (date) => {
    const msgDate = dayjs(date);
    const today = dayjs();
    const yesterday = dayjs().subtract(1, "day");
    if (msgDate.isSame(today, "day")) return "Today";
    if (msgDate.isSame(yesterday, "day")) return "Yesterday";
    return msgDate.format("MMM D, YYYY");
  };

  const formatLastSeen = (date) => {
    if (!date) return "";
    return `Last seen ${dayjs(date).format("MMM D, YYYY h:mm A")}`;
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
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
      dispatch(setMessages([...messages, result.data]));
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
    if (savedUser) dispatch(setSelectedUser(JSON.parse(savedUser)));
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser?._id) getAllMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser?._id) return;

    const handleNewMessage = (mess) => {
      dispatch(setMessages((prev) => [...prev, mess]));
    };

    const handleOnlineUsers = (onlineUserIds) => {
      const online = onlineUserIds.includes(selectedUser._id);
      setIsOnline(online);
      if (!online) {
        axios
          .get(`${serverUrl}/api/user/lastSeen/${selectedUser._id}`, {
            withCredentials: true,
          })
          .then((res) => setLastSeen(res.data.lastSeen))
          .catch((err) => console.log(err));
      }
    };

    socket?.on("newMessage", handleNewMessage);
    socket?.on("getOnlineUsers", handleOnlineUsers);
    socket?.emit("requestOnlineUsers");

    return () => {
      socket?.off("newMessage", handleNewMessage);
      socket?.off("getOnlineUsers", handleOnlineUsers);
    };
  }, [socket, dispatch, selectedUser]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-b from-black via-[#0a0f1f] to-[#01030a] relative flex flex-col">
      {/* Top bar */}

<div className="flex items-center gap-4 px-4 py-3 fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,200,255,0.45)]">
  <IoArrowBack
    size={28}
    className="text-blue-400 cursor-pointer hover:text-blue-200 lg:block "
    onClick={() => navigate(`/`)}
  />
  <div className="flex items-center gap-3">
    <div
      className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 cursor-pointer shadow-[0_0_15px_rgba(0,200,255,0.5)]"
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
    <div className="flex flex-col text-white">
      <span className="font-semibold text-lg">{selectedUser?.userName}</span>
      <span className="text-blue-400 text-sm">
        {isOnline
          ? "Online"
          : lastSeen
          ? formatLastSeen(lastSeen)
          : "Offline"}
      </span>
    </div>
  </div>
</div>


      {/* Messages area */}
<div className="flex-1 mt-[80px] mb-[120px] px-10 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-black/20">
  {messages?.map((mess, index) => {
    const senderId =
      typeof mess.sender === "object" ? mess.sender._id : mess.sender;
    const isOwnMessage = senderId === userData?._id;
    const showDateHeader =
      index === 0 ||
      !dayjs(mess.createdAt).isSame(messages[index - 1].createdAt, "day");
    let dateLabel = showDateHeader ? getDateLabel(mess.createdAt) : "";
    return (
      <React.Fragment key={mess._id || index}>
        {showDateHeader && (
          <div className="text-center text-blue-400/80 text-sm my-3 font-medium ">
            {dateLabel}
          </div>
        )}
        {isOwnMessage ? (
          <SenderMessage message={mess} />
        ) : (
          <ReceiverMessage message={mess} />
        )}
      </React.Fragment>
    );
  })}
</div>



      {/* Input form */}
<div className="fixed bottom-0 w-full px-5 pb-4 bg-black/80 backdrop-blur-md flex justify-center shadow-[0_0_25px_rgba(0,200,255,0.45)]">
  <form
    className="w-full max-w-[800px] flex items-center gap-3 px-4 py-3 bg-[#0c1b3b]/80 rounded-full border border-blue-700 shadow-[0_0_15px_rgba(0,200,255,0.45)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,200,255,0.6)]"
    onSubmit={handleSendMessage}
  >
    {frontendImage && (
      <div className="w-24 h-24 rounded-2xl overflow-hidden border border-blue-500 shadow-[0_0_15px_rgba(0,200,255,0.5)]">
        <img
          src={frontendImage}
          alt=""
          className="w-full h-full object-cover"
        />
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
      placeholder="Message..."
      className="flex-1 bg-transparent text-white placeholder-blue-400 outline-none px-4 py-2 rounded-full"
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
    <MdAttachment
      size={26}
      className="text-blue-400 cursor-pointer hover:text-blue-200 transition"
      onClick={() => imageInput.current.click()}
    />
    {(input || frontendImage) && (
      <button className="w-12 h-12 bg-gradient-to-br from-[#9500ff] to-[#00d4ff] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,200,255,0.6)] hover:scale-105 transition-transform duration-200">
        <IoSend className="w-6 h-6 text-white" />
      </button>
    )}
  </form>
</div>


    </div>
  );
}

export default MessageArea;
