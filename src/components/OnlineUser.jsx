import React from 'react'
import dp from "../assets/dp.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setSelectedUser } from '../redux/messageSlice';

function OnlineUser({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="relative w-[50px] h-[50px] flex justify-center items-center">
      {/* profile image */}
      <div
        className="w-[50px] h-[50px] rounded-full cursor-pointer overflow-hidden 
          border-2 border-blue-400 hover:scale-105 transition-transform duration-200 shadow-[0_0_15px_rgba(0,191,255,0.5)]"
        onClick={() => {
          dispatch(setSelectedUser(user));
          navigate('/messageArea');
        }}
      >
        <img
          src={user?.profileImage || dp}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* dot for online user */}
      {user.isOnline && (
        <div className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-green-500 rounded-full
          border-2 border-blue-900 shadow-[0_0_8px_rgba(0,255,0,0.7)] animate-pulse"></div>
      )}
    </div>
  );
}

export default OnlineUser;
