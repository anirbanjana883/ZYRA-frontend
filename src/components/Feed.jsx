import React from "react";
import logo from "../assets/ZYRA_logo.png";
import { FaRegHeart } from "react-icons/fa";
import StoryDp from "./StoryDp";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import Post from "./Post";
import { TbMessage2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

function Feed() {
  const { postData } = useSelector((state) => state.post);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { storyList, currentUserStory } = useSelector((state) => state.story);

  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
      {/* Logo and notification */}
      <div className="w-full h-[100px] flex items-center justify-between px-[20px] lg:hidden">
        {/* Left: Logo */}
        <img src={logo} alt="ZYRA logo" className="w-[50px]" />

        {/* Right: Icons */}
        <div className="flex items-center gap-6">

          <FaRegHeart className="text-white w-[25px] h-[25px]" />
          <TbMessage2
            className="text-white w-[27px] h-[27px]"
            onClick={() => navigate("/messages")}
          />

        </div>
      </div>

      {/* story card */}
      <div className="flex w-full overflow-x-auto gap-[20px] items-center p-[20px] scrollbar-hide">
        {/* Always show your DP */}
        <StoryDp
          userName={"Your Story"}
          profileImage={userData?.profileImage}
          story={currentUserStory} // null => shows +, ring only if story exists
        />

        {/* Show others' stories only if they have one */}
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

      {/* post section */}
      <div className="w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]">
        {/* nav bar */}
        <Nav />

        {postData?.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
