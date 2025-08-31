import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OnlineUser from "../components/onlineUser";

function Messages() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  return (
    <div className="w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[20px]">
      {/* back button */}
      <div className="w-full h-[80px]  flex items-center gap-[20px] px-[20px]">
        <IoArrowBack
          size={30}
          className="text-white cursor-pointer hover:text-gray-300 lg:hidden w-[25px] h-[25px]"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white text-[20px] font-semibold">Mesaages</h1>
      </div>

      <div
        className="w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto
      p-[20px] border-b-2 border-gray-800"
      >
        {userData.following?.map(
          (user, index) =>
            onlineUsers?.includes(user._id) && (
              <OnlineUser key={index} user={user} />
            )
        )}
      </div>
    </div>
  );
}

export default Messages;
