import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserData } from "../redux/userSlice";
import { IoArrowBack } from "react-icons/io5";
import dp from "../assets/dp.png";
import Nav from "../components/Nav";
import FollowButton from "../components/FollowButton";
import Post from "../components/Post";
import { setSelectedUser } from "../redux/messageSlice";
import OtherUser from "../components/OtherUser";

function Profile() {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { profileData, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const [postType, setPostType] = useState("");
  const [suggestedUser, setSuggestedUser] = useState([]);
  const navigate = useNavigate();

  const handleProfile = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getProfile/${userName}`,
        { withCredentials: true }
      );
      dispatch(setProfileData(result.data));
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/suggested`, {
        withCredentials: true,
      });
      setSuggestedUser(result.data);
    } catch (error) {
      console.error("Failed to fetch suggested users:", error);
    }
  };

  useEffect(() => {
    handleProfile();
  }, [userName]);

  useEffect(() => {
    if (profileData?._id === userData?._id) {
      fetchSuggestedUsers();
    }
  }, [profileData, userData]);

  return (
    <div className="w-full min-h-screen bg-[#030712] text-white font-inter">
      {/* Top bar */}
      <div className="w-full h-[80px] flex justify-between items-center px-[30px] border-b border-blue-500/40 bg-[#0A0F1C] shadow-[0_0_25px_rgba(37,99,235,0.3)]">
        <div onClick={() => navigate("/")}>
          <IoArrowBack
            size={30}
            className="text-blue-400 cursor-pointer hover:text-blue-300 hover:scale-110 transition-all duration-300"
          />
        </div>
        <div className="font-semibold text-[20px] text-blue-400">
          {profileData?.userName || "Profile"}
        </div>
        <div
          className="font-semibold text-[20px] cursor-pointer text-red-500 hover:text-red-400 transition-all duration-300"
          onClick={handleLogOut}
        >
          Log Out
        </div>
      </div>

      {/* Profile Image */}
      <div className="w-full flex flex-col md:flex-row items-center gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center">
        <div className="w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-4 border-blue-500/50 rounded-full cursor-pointer overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.6)]">
          <img
            src={profileData?.profileImage || dp}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile details */}
        <div className="text-center md:text-left">
          <div className="font-semibold text-[22px] text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]">
            {profileData?.name}
          </div>
          <div className="text-[17px] text-gray-400 italic">
            {profileData?.profession || "New User"}
          </div>
          <div className="text-[17px] text-gray-300">{profileData?.bio}</div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full flex flex-wrap justify-center items-center gap-[40px] md:gap-[60px] px-[5%] pt-[30px] text-white">
        {/* Posts */}
        <div className="flex flex-col items-center p-4 bg-[#0A0F1C] border border-blue-500/40 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_35px_rgba(37,99,235,0.5)] transition-all duration-300">
          <div className="text-[22px] md:text-[30px] font-semibold text-blue-300">
            {
              postData.filter((post) => post.author?._id === profileData?._id)
                .length
            }
          </div>
          <div className="text-[18px] md:text-[22px] text-gray-400">Posts</div>
        </div>

        {/* Followers */}
        <div className="flex flex-col items-center p-4 bg-[#0A0F1C] border border-blue-500/40 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_35px_rgba(37,99,235,0.5)] transition-all duration-300">
          <div className="flex items-center justify-center gap-[20px]">
            <div className="relative flex gap-[5px]">
              <div className="relative w-[60px] h-[30px]">
                {profileData?.followers?.slice(0, 3).map((user, index) => (
                  <div
                    key={user?._id || index}
                    className="w-[30px] h-[30px] border-2 border-blue-500 rounded-full overflow-hidden absolute shadow-[0_0_10px_rgba(37,99,235,0.7)]"
                    style={{ left: `${index * 9}px`, zIndex: 30 - index }}
                  >
                    <img
                      src={user?.profileImage || dp}
                      alt="dp"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[22px] md:text-[30px] font-semibold text-blue-300">
              {profileData?.followers?.length || 0}
            </div>
          </div>
          <div className="text-[18px] md:text-[22px] text-gray-400">Followers</div>
        </div>

        {/* Following */}
        <div className="flex flex-col items-center p-4 bg-[#0A0F1C] border border-blue-500/40 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_35px_rgba(37,99,235,0.5)] transition-all duration-300">
          <div className="flex items-center justify-center gap-[20px]">
            <div className="relative flex gap-[5px]">
              <div className="relative w-[60px] h-[30px]">
                {profileData?.following?.slice(0, 3).map((user, index) => (
                  <div
                    key={user?._id || index}
                    className="w-[30px] h-[30px] border-2 border-blue-500 rounded-full overflow-hidden absolute shadow-[0_0_10px_rgba(37,99,235,0.7)]"
                    style={{ left: `${index * 9}px`, zIndex: 30 - index }}
                  >
                    <img
                      src={user?.profileImage || dp}
                      alt="dp"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[22px] md:text-[30px] font-semibold text-blue-300">
              {profileData?.following.length}
            </div>
          </div>
          <div className="text-[18px] md:text-[22px] text-gray-400">Following</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex justify-center items-center gap-[20px] mt-[10px] mb-6">
        {profileData?._id === userData?._id && (
          <button
            className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-blue-500/20 border border-blue-500 rounded-2xl text-blue-300 font-semibold shadow hover:shadow-[0_0_15px_rgba(37,99,235,0.7)] hover:bg-blue-500/30 transition duration-200 cursor-pointer"
            onClick={() => navigate("/editprofile")}
          >
            Edit Profile
          </button>
        )}

        {profileData?._id !== userData?._id && (
          <>
            <FollowButton
              tailwind="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-blue-500/20 border border-blue-500 rounded-2xl text-blue-300 font-semibold shadow hover:shadow-[0_0_15px_rgba(37,99,235,0.7)] hover:bg-blue-500/30 transition duration-200 cursor-pointer"
              targetUserId={profileData?._id}
              onfollowChange={handleProfile}
            />

            <button
              className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-cyan-500/20 border border-cyan-500 rounded-2xl text-cyan-300 font-semibold shadow hover:shadow-[0_0_15px_rgba(6,182,212,0.7)] hover:bg-cyan-500/30 transition duration-200 cursor-pointer"
              onClick={() => {
                dispatch(setSelectedUser(profileData));
                navigate("/messageArea");
              }}
            >
              Message
            </button>
          </>
        )}
      </div>

      {/* Suggested Users */}
      {profileData?._id === userData?._id && suggestedUser.length > 0 && (
        <div className="px-4 py-3">
          <h2 className="text-white text-lg font-semibold mb-2 drop-shadow-[0_0_6px_rgba(37,99,235,0.7)]">
            Suggested for you
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-600/50 hover:scrollbar-thumb-blue-500/80">
            {suggestedUser.map((user) => (
              <OtherUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div className="w-full min-h-[100vh] flex justify-center">
        <div className="w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-[#0A0F1C] relative gap-[20px] pt-[30px] pb-[100px] shadow-[0_0_30px_rgba(37,99,235,0.3)]">
          {/* Post Type Toggle */}
          {profileData?._id == userData._id && (
            <div className="w-[90%] max-w-[500px] h-[70px] bg-[#030712] rounded-full flex justify-center items-center gap-[10px] border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <div
                className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all duration-300 ${
                  postType === "posts"
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.8)]"
                    : "text-blue-300 hover:bg-blue-500/30 hover:text-white"
                }`}
                onClick={() => setPostType("posts")}
              >
                Posts
              </div>

              <div
                className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all duration-300 ${
                  postType === "saved"
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.8)]"
                    : "text-blue-300 hover:bg-blue-500/30 hover:text-white"
                }`}
                onClick={() => setPostType("saved")}
              >
                Saved
              </div>
            </div>
          )}

          {/* Navigation */}
          <Nav />

          {/* Posts Rendering */}
          {profileData?._id == userData._id ? (
            <>
              {postType === "posts" &&
                postData.map(
                  (post) =>
                    post.author?._id === profileData?._id && <Post key={post._id} post={post} />
                )}

              {postType === "saved" &&
                userData.saved.map((post, index) => <Post key={index} post={post} />)}
            </>
          ) : (
            postData.map(
              (post) =>
                post.author?._id === profileData?._id && <Post key={post._id} post={post} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
