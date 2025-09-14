import React from 'react'
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from 'react-redux';
import NotificationCard from '../components/NotificationCard';

import { MdNotificationsOff } from "react-icons/md";
import getAllNotification from '../hooks/getAllNotification';

function Notifications() {
  const navigate = useNavigate();
  const { notificationData } = useSelector(state => state.user);

  // Real-time notifications
  getAllNotification();

  return (
    <div className='w-full h-[100vh] bg-black flex flex-col'>
      {/* back button (only visible on mobile) */}
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden">
        <IoArrowBack
          size={30}
          className="text-white cursor-pointer hover:text-gray-300"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white text-[20px] font-semibold">Notifications</h1>
      </div>

      {/* Notifications list */}
      <div className='w-full flex-1 flex flex-col gap-[10px] px-[20px] py-[15px] overflow-auto'>
        {notificationData?.length > 0 ? (
          notificationData.map((noti, index) => (
            <NotificationCard key={index} noti={noti} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-2">
            <MdNotificationsOff size={60} />
            <p className="text-lg md:text-xl">No notifications yet</p>
            <p className="text-sm md:text-base">All your notifications will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications;
