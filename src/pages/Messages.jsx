import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OnlineUser from "../components/onlineUser";
import { setSelectedUser } from "../redux/messageSlice";
import dp from "../assets/dp.png";
import { FiMessageSquare } from "react-icons/fi";

function Messages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { prevChatUsers } = useSelector((state) => state.message);

  const [search, setSearch] = useState("");

  // -----------------------------
  // filter chats by search
  // -----------------------------
  const filteredChats = (prevChatUsers || [])
    .filter((user) =>
      user.userName?.toLowerCase().includes(search.toLowerCase())
    )
    .sort(
      // ✅ sort by last message time descending
      (a, b) =>
        new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
    );

  return (
    <div className="w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[20px]">
      {/* back button & header */}
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
        <IoArrowBack
          size={30}
          className="text-white cursor-pointer hover:text-gray-300 lg:hidden w-[25px] h-[25px]"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white text-[20px] font-semibold">Messages</h1>
      </div>

      {/* search bar */}
      <input
        type="text"
        placeholder="Search chats"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 outline-none mb-2"
      />

      {/* online users */}
      <h2 className="text-gray-400 text-sm px-2">Online</h2>
      <div
        className="w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto
      p-[20px] border-b-2 border-gray-800"
      >
        {userData.following?.map(
          (user, index) =>
            onlineUsers?.includes(user._id) && (
              <OnlineUser key={user._id || index} user={user} />
            )
        )}
      </div>

      {/* previously chatted users */}
      <h2 className="text-gray-400 text-sm px-2 mt-4">Chats</h2>
      <div className="w-full h-full overflow-auto flex flex-col gap-[10px]">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 mt-10">
            <FiMessageSquare size={80} className="mb-4 opacity-50" />
            <p className="text-lg">No conversations found</p>
            <p className="text-sm text-gray-500">
              Start chatting with your friends!
            </p>
          </div>
        ) : (
          filteredChats.map((user, index) => (
            <div
              key={user._id || index}
              className="flex items-center gap-[10px] p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition"
              onClick={() => {
                dispatch(setSelectedUser(user));
                navigate("/messageArea");
              }}
            >
              {/* avatar with online dot */}
              <div className="relative w-[50px] h-[50px]">
                <img
                  src={user?.profileImage || dp}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
                {onlineUsers?.includes(user._id) && (
                  <span className="absolute bottom-1 right-1 w-[12px] h-[12px] bg-green-500 border-2 border-black rounded-full"></span>
                )}
              </div>

              {/* username + status */}
              <div className="flex flex-col flex-1">
                <div className="text-white text-[16px] font-semibold">
                  {user.userName}
                </div>
                {onlineUsers?.includes(user._id) ? (
                  <div className="text-green-500 text-[13px]">Active now</div>
                ) : (
                  <div className="text-gray-500 text-[13px]">
                    Last seen:{" "}
                    {user.lastSeen
                      ? new Date(user.lastSeen).toLocaleString()
                      : "recently"}
                  </div>
                )}
              </div>

              {/* last message time */}
              <div className="text-gray-500 text-[12px]">
                {user.lastMessageTime
                  ? new Date(user.lastMessageTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Messages;
