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
    <div className='
      w-[90%] lg:w-[40%] h-[70px] 
      fixed bottom-[20px] flex justify-around items-center 
      rounded-full border border-blue-400/40
      bg-black/30 backdrop-blur-xl 
      shadow-lg shadow-blue-600/40
      z-[100]
    '>
      {/* Home */}
      <div 
        className="text-[#00ffff] hover:text-[#ff00ff] text-[26px] cursor-pointer transition duration-300"
        onClick={() => navigate("/")}
        title="Home"
      >
        <TbHomeFilled />
      </div>

      {/* Search */}
      <div 
        className="text-[#00ffea] hover:text-[#ff6fff] text-[26px] cursor-pointer transition duration-300"
        onClick={() => navigate("/search")}
        title="Search"
      >
        <FaSearch />
      </div>

      {/* Upload */}
      <div 
        className="text-[#00bfff] hover:text-[#ff00aa] text-[26px] cursor-pointer transition duration-300"
        onClick={() => navigate("/upload")}
        title="Upload"
      >
        <FaRegSquarePlus />
      </div>

      {/* Reels */}
      <div 
        className="text-[#00ffff] hover:text-[#ff55ff] text-[26px] cursor-pointer transition duration-300"
        onClick={() => navigate("/loops")}
        title="Reels"
      >
        <BsCameraReelsFill />
      </div>

      {/* Profile */}
      <div
        className="w-[44px] h-[44px] border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden
        shadow-md shadow-blue-500/70 hover:scale-110 transition transform"
        onClick={() => userData?.userName && navigate(`/profile/${userData.userName}`)}
        title="Profile"
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
