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

  const getLastSeenLabel = (user) => {
    if (user?.isOnline) return "Online";
    if (user?.lastSeen) return `Last seen ${dayjs(user.lastSeen).fromNow()}`;
    return "";
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
    if (savedUser) {
      dispatch(setSelectedUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser?._id) {
      getAllMessages();
    }
  }, [selectedUser]);

  //  Real-time socket listener
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

    // request initial online users
    socket?.emit("requestOnlineUsers");

    return () => {
      socket?.off("newMessage", handleNewMessage);
      socket?.off("getOnlineUsers", handleOnlineUsers);
    };
  }, [socket, dispatch, selectedUser]);

  return (
    <div className="w-full h-[100vh] bg-black relative">
      {/* profile image , back icon  */}
      <div className="flex items-center gap-[15px] px-[20px] py-[10px] top-0 z-[100] bg-black w-full">
        <div className=" h-[80px]  flex items-center gap-[20px] px-[20px]">
          <IoArrowBack
            size={30}
            className="text-white cursor-pointer hover:text-gray-300 "
            onClick={() => navigate(`/`)}
          />
        </div>

        {/* profile image */}
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

        {/* name and username + online status */}
        <div className="text-white text-[18px] font-semibold flex flex-col">
          <div>{selectedUser?.userName}</div>
          <div className="text-[14px]">
            {isOnline ? (
              <span className="text-green-500">Online</span> // green for online
            ) : lastSeen ? (
              <span className="text-gray-400">{formatLastSeen(lastSeen)}</span> // gray for offline
            ) : (
              <span className="text-gray-400">Offline</span> // optional fallback
            )}
          </div>
        </div>
      </div>

      {/* messages with Today/Yesterday/Date grouping */}
      <div className="w-full h-[80%] pt-[100px] pb-[120px] lg:pb-[150px] px-[40px] flex flex-col gap-[20px] overflow-auto bg-black">
        {messages &&
          messages.map((mess, index) => {
            const senderId =
              typeof mess.sender === "object" ? mess.sender._id : mess.sender;
            const isOwnMessage = senderId === userData?._id;

            //  Determine if a date header should show
            const showDateHeader =
              index === 0 ||
              !dayjs(mess.createdAt).isSame(
                messages[index - 1].createdAt,
                "day"
              );

            let dateLabel = "";
            if (showDateHeader) {
              dateLabel = getDateLabel(mess.createdAt); // ✅ changed
            }

            return (
              <React.Fragment key={mess._id || index}>
                {showDateHeader && (
                  <div className="text-center text-gray-400 text-sm my-2">
                    {dateLabel} {/* ✅ changed */}
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
