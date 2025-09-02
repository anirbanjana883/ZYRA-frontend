import React from 'react';
import { TbHomeFilled } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { BsCameraReelsFill } from "react-icons/bs";
import { FaRegSquarePlus } from "react-icons/fa6";
import dp from "../assets/dp.png";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

function Nav() {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);

  return (
    <div className='w-[90%] lg:w-[40%] h-[70px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]'>
      {/* home */}
      <div className="text-white text-[22px] cursor-pointer hover:text-gray-300 transition"
      onClick={() => navigate("/")}
      ><TbHomeFilled /></div>
      {/* search */}
      <div className="text-white text-[22px] cursor-pointer hover:text-gray-300 transition" onClick={()=>navigate("/search")}><FaSearch /></div>
      {/* upload */}
      <div className="text-white text-[22px] cursor-pointer hover:text-gray-300 transition" onClick={()=>navigate("/upload")}><FaRegSquarePlus /></div>
      {/* reels */}
      <div className="text-white text-[22px] cursor-pointer hover:text-gray-300 transition" onClick={()=>navigate("/loops")}><BsCameraReelsFill /></div>
      {/* profile */}
      <div
        className="w-[40px] h-[40px] border-[1.5px] border-gray-500 rounded-full cursor-pointer overflow-hidden"
        onClick={() => userData?.userName && navigate(`/profile/${userData.userName}`)}
      >
        <img
          src={userData?.profileImage || dp}
          alt={`${userData?.userName || "default"} profile`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Nav;
