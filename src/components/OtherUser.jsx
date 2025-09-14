// OtherUser.jsx (Instagram-style card)
import React from 'react';
import { useSelector } from 'react-redux';
import dp from "../assets/dp.png";
import { useNavigate } from 'react-router-dom';
import FollowButton from './FollowButton';

function OtherUser({ user }) {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="min-w-[150px] max-w-[160px] bg-gray-900 rounded-2xl p-4 flex flex-col items-center">
      {/* Profile image */}
      <div
        className="w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-gray-700 cursor-pointer"
        onClick={() => navigate(`/profile/${user.userName}`)}
      >
        <img
          src={user?.profileImage || dp}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Username & name */}
      <div className="mt-2 text-center">
        <p className="text-white text-sm font-semibold">@{user?.userName}</p>
        <p className="text-gray-400 text-xs">{user?.name}</p>
      </div>

      {/* Follow button */}
      {userData._id !== user._id && (
        <div className="mt-3">
          <FollowButton
            tailwind={
              "px-[10px] w-[100px] py-[5px] h-[36px] bg-white text-black text-sm font-semibold rounded-2xl cursor-pointer"
            }
            targetUserId={user._id}
          />
        </div>
      )}
    </div>
  );
}

export default OtherUser;
