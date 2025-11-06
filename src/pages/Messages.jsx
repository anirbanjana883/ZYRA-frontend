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

  const filteredChats = (prevChatUsers || [])
    .filter((user) =>
      user.userName?.toLowerCase().includes(search.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
    );

  return (
    <div className="w-full min-h-[100vh] flex flex-col bg-gradient-to-b from-black via-[#0a0f1f] to-[#01030a] gap-5 p-5">
      {/* Back & header */}
      <div className="w-full h-[80px] flex items-center gap-4 px-2 lg:px-5">
        <IoArrowBack
          size={28}
          className="text-blue-400 cursor-pointer hover:text-blue-200 lg:hidden"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white text-[20px] font-semibold">Messages</h1>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search chats"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 rounded-lg bg-[#0c1b3b] text-white placeholder-blue-400 outline-none mb-2 border border-blue-700 focus:border-blue-400"
      />

      {/* Online users */}
      <h2 className="text-blue-400 text-sm px-2">Online</h2>
      <div className="w-full h-[80px] flex gap-4 justify-start items-center overflow-x-auto p-2 border-b border-blue-700">
        {userData.following?.map(
          (user, index) =>
            onlineUsers?.includes(user._id) && (
              <OnlineUser key={user._id || index} user={user} />
            )
        )}
      </div>

      {/* Previously chatted users */}
      <h2 className="text-blue-400 text-sm px-2 mt-4">Chats</h2>
      <div className="w-full h-full overflow-auto flex flex-col gap-2 pb-5">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-blue-400 mt-10 opacity-70">
            <FiMessageSquare size={80} className="mb-4 opacity-50" />
            <p className="text-lg">No conversations found</p>
            <p className="text-sm text-blue-300">
              Start chatting with your friends!
            </p>
          </div>
        ) : (
          filteredChats.map((user, index) => (
            <div
              key={user._id || index}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#0c1b3b] cursor-pointer transition border border-transparent hover:border-blue-700"
              onClick={() => {
                dispatch(setSelectedUser(user));
                navigate("/messageArea");
              }}
            >
              {/* Avatar with online dot */}
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

              {/* Username + status */}
              <div className="flex flex-col flex-1">
                <div className="text-white text-[16px] font-semibold">
                  {user.userName}
                </div>
                {onlineUsers?.includes(user._id) ? (
                  <div className="text-green-500 text-[13px]">Active now</div>
                ) : (
                  <div className="text-blue-300 text-[13px]">
                    Last seen:{" "}
                    {user.lastSeen
                      ? new Date(user.lastSeen).toLocaleString()
                      : "recently"}
                  </div>
                )}
              </div>

              {/* Last message time */}
              <div className="text-blue-300 text-[12px]">
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
