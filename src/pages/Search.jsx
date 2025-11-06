import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSearchData } from "../redux/userSlice";
import { serverUrl } from "../App";
import dp from "../assets/dp.png";

function Search() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.user.searchData);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    try {
      if (!input.trim()) return;
      const result = await axios.get(
        `${serverUrl}/api/user/search?keyWord=${input}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ debounce input search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (input.trim()) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [input]);

  return (
    <div className="w-full min-h-screen bg-black relative flex flex-col items-center overflow-hidden">
      {/* Back Button */}
      <div className="w-full h-[80px] flex items-center gap-5 px-6 absolute top-0 z-20">
        <div
          onClick={() => navigate(`/`)}
          className="p-2 rounded-full hover:bg-blue-500/20 cursor-pointer transition duration-300"
        >
          <IoArrowBack size={28} className="text-blue-400" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full flex items-center justify-center mt-[100px] z-10">
        <form
  onSubmit={handleSearch}
  className="w-[90%] max-w-[800px] h-[55px] bg-[#0f1414]/60 backdrop-blur-md border border-blue-400/40 rounded-full flex items-center px-5 transition duration-300 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(0,200,255,0.5)]"
>
  <FaSearch className="text-blue-400 text-lg" />
  <input
    type="text"
    placeholder="Search users..."
    className="flex-1 bg-transparent text-white placeholder-blue-300 outline-none px-4 text-base"
    onChange={(e) => setInput(e.target.value)}
    value={input}
  />
</form>
      </div>

      {/* Search Results */}
      {input && (
<div className="w-full flex flex-col items-center gap-4 mt-6 px-4 z-10">
  {searchData?.length > 0 ? (
    searchData.map((user) => (
      <div
        key={user._id}
        className="w-full max-w-[700px] h-[80px] rounded-xl bg-[#111]/70 backdrop-blur-md border border-blue-400/30 flex items-center gap-4 px-4 cursor-pointer
                   hover:bg-blue-500/10 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(0,200,255,0.35)] transition-all duration-200"
        onClick={() => navigate(`/profile/${user.userName}`)}
      >
        {/* Avatar */}
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-blue-400 flex-shrink-0 shadow-[0_0_10px_rgba(0,200,255,0.4)]">
          <img
            src={user.profileImage || dp}
            alt={user.userName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex flex-col truncate">
          <span className="font-semibold text-[16px] text-blue-300 truncate">
            {user.userName}
          </span>
          <span className="text-sm text-blue-400 truncate">{user.name}</span>

          <div className="flex gap-4 text-xs text-red-500 mt-1">
            <span>{user.followersCount} Followers</span>
            <span>{user.followingCount} Following</span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-blue-400/60 mt-10">No users found</p>
  )}
</div>
      )}
    </div>
  );
}

export default Search;
