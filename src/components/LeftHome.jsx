import React from "react";
import logo from "../assets/ZYRA_logo.png";
import tagLine from "../assets/tag_line.png";
import { FaRegHeart } from "react-icons/fa";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import Notifications from "../pages/Notifications";

function LeftHome() {
  const { userData, notificationData } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[25%] hidden lg:flex flex-col bg-black border-r-2 border-gray-900 h-screen">
      {/* Logo and notification button */}
      <div className="w-full h-[100px] flex items-center justify-between px-[20px] shrink-0">
        <img src={logo} alt="ZYRA logo" className="w-[50px]" />
        {/* Tagline */}
        <div className="flex-1 flex justify-center items-center px-4">
          <img
            src={tagLine}
            alt="Tagline"
            className="max-w-[180px] h-auto object-contain"
          />
        </div>
        <div
          className="relative cursor-pointer lg:hidden"
          onClick={() => navigate("/notifications")}
        ></div>
      </div>

      {/* Profile & logout */}
      <div className="flex items-center justify-between px-[20px] py-[15px] border-b-2 border-b-gray-900 shrink-0">
        <div className="flex items-center gap-4">
          <div
            className="w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
            onClick={() => navigate(`/profile/${userData.userName}`)}
          >
            <img
              src={userData?.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-[18px] text-white font-semibold">
              @{userData?.userName}
            </div>
            <div className="text-[15px] text-gray-400 font-semibold">
              {userData?.name}
            </div>
          </div>
        </div>

        <div
          className="text-red-500 font-semibold cursor-pointer"
          onClick={handleLogOut}
        >
          Log out
        </div>
      </div>

      {/* Notifications section header */}
      <div className="w-full px-30 py-3 border-b border-gray-900 items-centercenter">
        <h2 className="text-white text-lg font-semibold">Notifications</h2>
      </div>

      {/* Notifications scrollable */}
      <div className="flex-1 overflow-y-auto px-[20px] py-[15px]">
        <Notifications />
      </div>
    </div>
  );
}

export default LeftHome;
