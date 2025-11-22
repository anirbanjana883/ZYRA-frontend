import React from "react";
import logo from "../assets/ZYRA_LOGO.png";
import tagLine from "../assets/tag_line.png";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import Notifications from "../pages/Notifications";

function LeftHome() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[25%] hidden lg:flex fixed left-0 top-0 flex-col bg-gradient-to-b from-black via-[#0a0f1f] to-[#01030a] border-r border-[#0c1b3b] h-screen">
      {/* Logo */}
      <div className="w-full h-[100px] flex items-center justify-between px-5 shrink-0">
        <img src={logo} alt="ZYRA logo" className="w-12 h-12" />
        <div className="flex-1 flex justify-center items-center px-4">
          <img src={tagLine} alt="Tagline" className="max-w-[180px] h-auto object-contain" />
        </div>
      </div>

      {/* Profile & Logout */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#0c1b3b] shrink-0">
        <div className="flex items-center gap-4">
          <div
            className="w-[70px] h-[70px] border-2 border-blue-500 rounded-full cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300"
            onClick={() => navigate(`/profile/${userData.userName}`)}
          >
            <img
              src={userData?.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-[18px] text-blue-300 font-semibold">@{userData?.userName}</div>
            <div className="text-[15px] text-gray-400 font-semibold">{userData?.name}</div>
          </div>
        </div>

        <div
          className="text-red-500 font-semibold cursor-pointer hover:text-red-400 transition-colors duration-300"
          onClick={handleLogOut}
        >
          Log out
        </div>
      </div>

      {/* Notifications Header */}
      <div className="w-full px-5 py-3 border-b border-[#0c1b3b]">
        <h2 className="text-white text-lg font-semibold">Notifications</h2>
      </div>

      {/* Notifications Scroll */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <Notifications />
      </div>
    </div>
  );
}

export default LeftHome;
