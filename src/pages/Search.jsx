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
    <div className="w-full min-h-[100vh] bg-black flex flex-col items-center">
      {/* Back button */}
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] absolute top-0">
        <IoArrowBack
          size={30}
          className="text-white cursor-pointer hover:text-gray-300"
          onClick={() => navigate(`/`)}
        />
      </div>

      {/* Search bar */}
      <div className="w-full flex items-center justify-center mt-[100px] md:mt-[120px] lg:mt-[80px]">
        <form
          onSubmit={handleSearch}
          className="w-[90%] max-w-[800px] h-[55px] bg-[#0f1414] rounded-full flex items-center px-5 shadow-md"
        >
          <FaSearch className="text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none px-4 text-base"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </form>
      </div>

      {/* Search Results */}
      {input && (
        <div className="w-full flex flex-col items-center gap-3 mt-6 px-4">
          {searchData?.length > 0 ? (
            searchData.map((user) => (
              <div
                key={user._id}
                className="w-full max-w-[700px] h-[80px] rounded-xl bg-[#111] flex items-center gap-4 px-4 cursor-pointer hover:bg-[#1a1a1a] transition"
                onClick={() => navigate(`/profile/${user.userName}`)}
              >
                {/* Avatar */}
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden border border-gray-700 flex-shrink-0">
                  <img
                    src={user.profileImage || dp}
                    alt={user.userName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* User Info */}
                {/* User Info */}
                <div className="flex flex-col text-white truncate">
                  <span className="font-semibold text-[16px] truncate">
                    {user.userName}
                  </span>
                  <span className="text-sm text-gray-400 truncate">
                    {user.name}
                  </span>

                  {/* Followers & Following */}
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                    <span>{user.followersCount} Followers</span>
                    <span>{user.followingCount} Following</span>
                  </div>
                </div>
              </div>
            ))
          ) : input.trim() ? (
            <p className="text-gray-500 mt-10">No users found</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Search;
