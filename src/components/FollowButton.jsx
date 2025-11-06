import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { toggleFollow } from "../redux/userSlice";

function FollowButton({ targetUserId, tailwind, onfollowChange }) {
  const { following } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const isFollowing =
    Array.isArray(following) &&
    following.some((f) =>
      typeof f === "string" ? f === targetUserId : f?._id === targetUserId
    );

  const handleFollow = async () => {
    if (loading) return; // prevent multiple clicks
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/user/follow/${targetUserId}`,
        {},
        { withCredentials: true }
      );
      if (onfollowChange) onfollowChange();
      dispatch(toggleFollow(targetUserId));
    } catch (error) {
      console.error("Follow/unfollow error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`
        ${tailwind} 
        px-5 py-2 rounded-full font-semibold transition-all duration-300
        ${isFollowing 
          ? "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white shadow-md shadow-pink-400/50 hover:scale-105" 
          : "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white shadow-md shadow-cyan-400/50 hover:scale-105"}
        ${loading ? "opacity-70 cursor-not-allowed" : ""}
      `}
      style={{ textShadow: "0 0 2px rgba(255,255,255,0.6)" }}
    >
      {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;
