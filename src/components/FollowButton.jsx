import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from '../App';
import { toggleFollow } from '../redux/userSlice';

function FollowButton({ targetUserId, tailwind , onfollowChange }) {
  const { following } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const isFollowing = Array.isArray(following) && following.some(f =>
    typeof f === "string"
      ? f === targetUserId
      : f?._id === targetUserId
  );

  const handleFollow = async () => {
    try {
      await axios.get(`${serverUrl}/api/user/follow/${targetUserId}`, {
        withCredentials: true
      });
      if (onfollowChange) {
        onfollowChange();
      }
      dispatch(toggleFollow(targetUserId));
    } catch (error) {
      console.error("Follow/unfollow error:", error);
    }
  };

  return (
    <button className={tailwind} onClick={handleFollow}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;
