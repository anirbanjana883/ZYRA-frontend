import React from 'react'
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

function Notifications() {
    const navigate = useNavigate();
  return (
    <div className='w-full h-[100vh] bg-black'>
        {/* back button */}
        <div className="w-full h-[80px]  flex items-center gap-[20px] px-[20px]">
        <IoArrowBack
          size={30}
          className="text-white cursor-pointer hover:text-gray-300 "
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white text-[20px] font-semibold">Notifications</h1>
      </div>

    </div>
  )
}

export default Notifications