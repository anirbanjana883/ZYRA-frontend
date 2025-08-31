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
        className="w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
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
      <div className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-green-500 border-2 border-black rounded-full"></div>
    </div>
  );
}

export default OnlineUser;
