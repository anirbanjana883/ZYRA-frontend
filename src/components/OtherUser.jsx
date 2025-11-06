// OtherUser.jsx (Glowing blue theme)
import React from 'react';
import { useSelector } from 'react-redux';
import dp from "../assets/dp.png";
import { useNavigate } from 'react-router-dom';
import FollowButton from './FollowButton';

function OtherUser({ user }) {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="min-w-[150px] max-w-[160px] bg-[#0e1718] rounded-2xl p-4 flex flex-col items-center shadow-[0_0_20px_rgba(0,123,255,0.5)] border border-[#1e2a35] hover:shadow-[0_0_25px_rgba(0,123,255,0.8)] transition-shadow duration-300">
      {/* Profile image */}
      <div
        className="w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-[#0f4fff] hover:border-[#1ad6ff] cursor-pointer transition-colors duration-300"
        onClick={() => navigate(`/profile/${user.userName}`)}
      >
        <img
          src={user?.profileImage || dp}
          alt="profile"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Username & name */}
      <div className="mt-3 text-center">
        <p className="text-white text-sm font-semibold truncate hover:text-[#1ad6ff] transition-colors duration-300">
          @{user?.userName}
        </p>
        <p className="text-gray-400 text-xs truncate">{user?.name}</p>
      </div>

      {/* Follow button */}
      {userData._id !== user._id && (
        <div className="mt-3 w-full flex justify-center">
          <FollowButton
            tailwind="px-4 py-2 w-[110px] bg-[#0f4fff] text-white text-sm font-semibold rounded-2xl cursor-pointer hover:bg-[#1ad6ff] transition-colors duration-300"
            targetUserId={user._id}
          />
        </div>
      )}
    </div>
  );
}

export default OtherUser;
