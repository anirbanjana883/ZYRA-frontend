import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function Messages() {
    const navigate = useNavigate();
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
    </div>


  );
}

export default Messages;
