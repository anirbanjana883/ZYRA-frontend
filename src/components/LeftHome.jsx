import React, { useState } from "react";
import logo from "../assets/ZYRA_logo.png";
import { FaRegHeart } from "react-icons/fa";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from "../redux/userSlice";
import OtherUser from "./OtherUser";

function LeftHome() {
  const { userData, suggestedUser } = useSelector((state) => state.user); 
  const {notificationData} = useSelector(state=>state.user)
  const[showNotificaton , setShowNotification] = useState(false)
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[25%] hidden lg:block min-h-[100vh] bg-black border-r-2 border-gray-900">
      
      {/* Logo and notification */}
      <div className="w-full h-[100px] flex items-center justify-between px-[20px]">
        <img src={logo} alt="ZYRA logo" className="w-[50px]" />
        <div className="relative">
          <FaRegHeart className="text-white w-[25px] h-[25px]" />

          {(notificationData?.length > 0 &&
          notificationData.some((noti)=>noti.isRead === false))
          && 
          <div className="w-[10px] h-[10px] bg-red-600 rounded-full absolute top-0 right-[-5px]"></div>

          }

        </div>
        
      </div>

      {/* Profile & logout */}
      <div className="flex items-center justify-between px-[20px] py-[15px] border-b-2 border-b-gray-900">
        
        {/* Profile image & name */}
        <div className="flex items-center gap-4">
          <div className="w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
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

        {/* Logout button */}
        <div
          className="text-red-500 font-semibold cursor-pointer"
          onClick={handleLogOut}
        >
          Log out
        </div>
      </div>

      {/* Suggested users */}
      <div className="px-[20px] py-[10px] border-b-2 border-b-gray-900">
        <h1 className="text-white text-[19px] mb-2">Suggested Users</h1>
        {suggestedUser && suggestedUser.map((user, index) => (
          <OtherUser key={index} user={user} />
        ))}
      </div>
    </div>
  );
}

export default LeftHome;
