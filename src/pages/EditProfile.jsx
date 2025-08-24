import React, { useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.png";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setProfileData, setUserData } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";

function EditProfile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const imageInput = useRef();
  const [frontendImage, setFrontendImage] = useState(
    userData.profileImage || dp
  );
  const [backendImage, setBackendImage] = useState(null);
  const [name, setName] = useState(userData.name || "");
  const [userName, setUserName] = useState(userData.userName || "");
  const [bio, setBio] = useState(userData.bio || "");
  const [profession, setProfession] = useState(userData.profession || "");
  const [gender, setGender] = useState(userData.gender || "");
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const fromdata = new FormData();
      fromdata.append("name", name);
      fromdata.append("userName", userName);
      fromdata.append("bio", bio);
      fromdata.append("profession", profession);
      fromdata.append("gender", gender);

      if (backendImage) {
        fromdata.append("profileImage", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/editprofile`,
        fromdata,
        { withCredentials: true }
      );
      dispatch(setProfileData(result.data));
      dispatch(setUserData(result.data));
      navigate(`/profile/${userName}`);
      setLoading(false);
    } catch (error) {
      console.log("Failed to edit profile:", error);
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-[100vh] bg-black flex flex-col items-center gap-[20px] ">
      {/* back button */}
      <div className="w-full h-[80px]  flex items-center gap-[20px] px-[20px]">
        <IoArrowBack
          size={30}
          className="text-white cursor-pointer hover:text-gray-300 "
          onClick={() => navigate(`/profile/${userData.userName}`)}
        />
        <h1 className="text-white text-[20px] font-semibold">Edit Profile</h1>
      </div>

      {/* profile image  */}
      <div
        className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-4 border-white rounded-full cursor-pointer overflow-hidden shadow-md "
        onClick={() => imageInput.current.click()}
      >
        {/* image input */}
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          hidden
          onChange={handleImage}
        ></input>
        {/* profile image */}
        <img
          src={frontendImage}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* all inputs */}
      <div
        className="text-blue-500 text-center text-lg opacity-100 cursor-pointer"
        onClick={() => imageInput.current.click()}
      >
        Change your profile picture
      </div>

      {/* All input fields */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-[90%] max-w-[600px] h-[60px] 
  bg-[#0a1010] border-2 border-gray-700 rounded-2xl text-white font-semibold px-[20px]
  outline-none placeholder:text-gray-400"
        placeholder="Enter your name"
      />

      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="w-[90%] max-w-[600px] h-[60px] 
  bg-[#0a1010] border-2 border-gray-700 rounded-2xl text-white font-semibold px-[20px]
  outline-none placeholder:text-gray-400"
        placeholder="Enter your username"
      />

      <input
        type="text"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-[90%] max-w-[600px] h-[60px] 
  bg-[#0a1010] border-2 border-gray-700 rounded-2xl text-white font-semibold px-[20px]
  outline-none placeholder:text-gray-400"
        placeholder="Bio"
      />

      <input
        type="text"
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
        className="w-[90%] max-w-[600px] h-[60px] 
  bg-[#0a1010] border-2 border-gray-700 rounded-2xl text-white font-semibold px-[20px]
  outline-none placeholder:text-gray-400"
        placeholder="Profession"
      />

      <input
        type="text"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-[90%] max-w-[600px] h-[60px] 
  bg-[#0a1010] border-2 border-gray-700 rounded-2xl text-white font-semibold px-[20px]
  outline-none placeholder:text-gray-400"
        placeholder="Gender"
      />

      <button
        className="px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white 
  cursor-pointer rounded-2xl font-semibold text-black"
      onClick={handleEditProfile}      
      >
        {loading ? <ClipLoader size={30} color="black" /> : "Save Profile"}
      </button>
    </div>
  );
}

export default EditProfile;
