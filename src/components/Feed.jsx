import React from "react";
import logo from "../assets/ZYRA_LOGO.png";
import tagLine from "../assets/tag_line.png";
import { FaRegHeart } from "react-icons/fa";
import { TbMessage2 } from "react-icons/tb";
import StoryDp from "./StoryDp";
import Nav from "./Nav";
import Post from "./Post";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Feed() {
  const { postData } = useSelector((state) => state.post);
  const { userData, notificationData } = useSelector((state) => state.user);
  const { storyList, currentUserStory } = useSelector((state) => state.story);
  const navigate = useNavigate();

  return (
    <div className="lg:ml-[25%] lg:mr-[25%] w-full h-screen bg-gradient-to-b from-black via-[#0a0f1f] to-[#01030a] relative">
      {/* Inner scrollable feed */}
      <div className="w-full h-full overflow-y-auto">
        {/* Mobile Top Bar */}
        <div className="w-full h-[100px] flex items-center justify-between px-5 lg:hidden bg-[#0e1718] shadow-[0_0_15px_rgba(0,123,255,0.5)] border-b border-[#1e2a35]">
  {/* Logo */}
  <img
    src={logo}
    alt="ZYRA logo"
    className="w-12 h-12 rounded-full border-2 border-[#0f4fff] shadow-[0_0_10px_rgba(0,123,255,0.7)]"
  />

  {/* Tagline */}
  <div className="flex-1 flex justify-center items-center px-4">
    <img
      src={tagLine}
      alt="Tagline"
      className="max-w-[150px] h-auto object-contain filter drop-shadow-[0_0_5px_rgba(0,123,255,0.7)]"
    />
  </div>

  {/* Icons */}
  <div className="flex items-center gap-6">
    {/* Notifications */}
    <div
      className="relative cursor-pointer hover:text-[#1ad6ff] transition-colors duration-300"
      onClick={() => navigate("/notifications")}
    >
      <FaRegHeart className="text-blue-400 w-6 h-6 hover:drop-shadow-[0_0_8px_rgba(0,123,255,0.8)]" />
      {notificationData?.length > 0 &&
        notificationData.some((noti) => !noti.isRead) && (
          <div className="w-2 h-2 bg-red-600 rounded-full absolute top-0 right-[-2px] shadow-[0_0_4px_red] animate-pulse" />
        )}
    </div>

    {/* Messages */}
    <TbMessage2
      className="text-blue-400 w-6 h-6 cursor-pointer hover:drop-shadow-[0_0_8px_rgba(0,123,255,0.8)] transition duration-300"
      onClick={() => navigate("/messages")}
    />
  </div>
</div>


        {/* Stories */}
        <div className="flex w-full overflow-x-auto gap-4 items-center p-5 scrollbar-hide">
          <StoryDp userName={"Your Story"} profileImage={userData?.profileImage} story={currentUserStory} />
          {storyList
            ?.filter((story) => story?.media && story.author._id !== userData._id)
            .map((story, index) => (
              <StoryDp
                key={index}
                userName={story.author.userName}
                profileImage={story.author.profileImage}
                story={story}
              />
            ))}
        </div>

        {/* Posts */}
        <div className="w-full flex flex-col items-center gap-5 p-5 pt-10 bg-[#0c1b3b] rounded-t-[60px] relative pb-[120px]">
          <Nav />
          {postData?.map((post, index) => (
            <Post post={post} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
