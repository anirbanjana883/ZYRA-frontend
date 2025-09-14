import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserData } from "../redux/userSlice";
import { IoArrowBack } from "react-icons/io5";
import dp from "../assets/dp.png";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
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

  // ✅ [CHANGE] Fetch suggested users
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
    <div className="w-full min-h-screen bg-black text-black">
      {/* Top bar */}
      <div className="w-full h-[80px] flex justify-between items-center px-[30px] border-b border-gray-700">
        <div onClick={() => navigate("/")}>
          <IoArrowBack
            size={30}
            className="text-white cursor-pointer hover:text-gray-300"
          />
        </div>
        <div className="font-semibold text-[20px]">
          {profileData?.userName || "Profile"}
        </div>
        <div
          className="font-semibold text-[20px] cursor-pointer text-red-500 hover:text-red-400 transition"
          onClick={handleLogOut}
        >
          Log Out
        </div>
      </div>

      {/* Profile Image */}
      <div className="w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center">
        <div className="w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-4 border-white rounded-full cursor-pointer overflow-hidden shadow-md">
          <img
            src={profileData?.profileImage || dp}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile details */}
        <div>
          <div className="font-semibold text-[22px] text-white">
            {profileData?.name}
          </div>
          <div className="text-[17px] text-gray-400 italic">
            {profileData?.profession || "New User"}
          </div>
          <div className="text-[17px] text-gray-300">{profileData?.bio}</div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px] text-white">
        {/* Posts */}
        <div>
          <div className="text-white text-[22px] md:text-[30px] font-semibold">
            {
              postData.filter((post) => post.author?._id === profileData?._id)
                .length
            }
          </div>
          <div className="text-[18px] md:text-[22px] text-gray-400">Posts</div>
        </div>

        {/* Followers */}
        <div>
          <div className="flex items-center justify-center gap-[20px]">
            <div className="relative flex gap-[5px]">
              <div className="relative w-[60px] h-[30px]">
                {profileData?.followers?.slice(0, 3).map((user, index) => (
                  <div
                    key={user?._id || index}
                    className="w-[30px] h-[30px] border-2 border-white rounded-full overflow-hidden absolute shadow"
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
            <div className="text-white text-[22px] md:text-[30px] font-semibold">
              {profileData?.followers?.length || 0}
            </div>
          </div>
          <div className="text-[18px] md:text-[22px] text-gray-400">
            Followers
          </div>
        </div>

        {/* Following */}
        <div>
          <div className="flex items-center justify-center gap-[20px]">
            <div className="relative flex gap-[5px]">
              <div className="relative w-[60px] h-[30px]">
                {profileData?.following?.slice(0, 3).map((user, index) => (
                  <div
                    key={user?._id || index}
                    className="w-[30px] h-[30px] border-2 border-white rounded-full overflow-hidden absolute shadow"
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
            <div className="text-white text-[22px] md:text-[30px] font-semibold">
              {profileData?.following.length}
            </div>
          </div>
          <div className="text-[18px] md:text-[22px] text-gray-400">
            Following
          </div>
        </div>
      </div>

      {/* button */}
      <div className="w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]">
        {/* own profile */}
        {profileData?._id === userData?._id && (
          <button
            className="px-[10px] min-w-[150px] py-[5px] h-[40px]
      bg-white text-black font-semibold rounded-2xl shadow hover:bg-gray-200 transition duration-200 cursor-pointer"
            onClick={() => navigate("/editprofile")}
          >
            Edit Profile
          </button>
        )}

        {/* other's profile */}
        {profileData?._id !== userData?._id && (
          <>
            <FollowButton
              tailwind={
                "px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white text-black font-semibold rounded-2xl shadow hover:bg-gray-200 transition duration-200 cursor-pointer"
              }
              targetUserId={profileData?._id}
              onfollowChange={handleProfile}
            />

            <button
              className="px-[10px] min-w-[150px] py-[5px] h-[40px] cursor-pointer
      bg-white text-black font-semibold rounded-2xl shadow hover:bg-gray-200 transition duration-200"
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

            {/*  [CHANGE FIXED] Suggested Users - only for my profile */}
      {profileData?._id === userData?._id && suggestedUser.length > 0 && (
        <div className="px-4 py-3">
          <h2 className="text-white text-lg font-semibold mb-2">
            Suggested for you
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {suggestedUser.map((user) => (
              <OtherUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}


      {/* posts of own  */}
      <div className="w-full min-h-[100vh] flex justify-center">
        <div className="w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[100px]">
          {/* posts and saved post */}

          {profileData?._id == userData._id && (
            <div className="w-[90%] max-w-[500px] h-[70px] bg-white rounded-full flex justify-center items-center gap-[10px]">
              <div
                className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer ${
                  postType === "posts"
                    ? "bg-black text-white shadow-2xl shadow-black"
                    : "hover:bg-black hover:text-white hover:shadow-2xl hover:shadow-black"
                }`}
                onClick={() => setPostType("posts")}
              >
                Posts
              </div>

              <div
                className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer ${
                  postType === "saved"
                    ? "bg-black text-white shadow-2xl shadow-black"
                    : "hover:bg-black hover:text-white hover:shadow-2xl hover:shadow-black"
                }`}
                onClick={() => setPostType("saved")}
              >
                Saved
              </div>
            </div>
          )}

          {/* navigation bar */}
          <Nav />

          {/* for own profile both post and saved post will be visible  */}
          {profileData?._id == userData._id && (
            <>
              {/* posts */}
              {postType === "posts" &&
                postData.map(
                  (post, index) =>
                    post.author?._id === profileData?._id && (
                      <Post key={post._id} post={post} />
                    )
                )}

              {postType === "saved" &&
                userData.saved.map((post, index) => (
                  <Post key={index} post={post} />
                ))}
            </>
          )}

          {/* for others only posts will be visible */}
          {profileData?._id != userData._id &&
            postData.map(
              (post, index) =>
                post.author?._id === profileData?._id && (
                  <Post key={post._id} post={post} />
                )
            )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
