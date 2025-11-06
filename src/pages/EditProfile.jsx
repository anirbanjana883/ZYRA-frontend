import React, { useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.png";
import { serverUrl } from "../App";
import axios from "axios";
import { setProfileData, setUserData } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";

function EditProfile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const imageInput = useRef();
  const [frontendImage, setFrontendImage] = useState(userData.profileImage || dp);
  const [backendImage, setBackendImage] = useState(null);
  const [name, setName] = useState(userData.name || "");
  const [userName, setUserName] = useState(userData.userName || "");
  const [bio, setBio] = useState(userData.bio || "");
  const [profession, setProfession] = useState(userData.profession || "");
  const [gender, setGender] = useState(userData.gender || "");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

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
      const result = await axios.post(`${serverUrl}/api/user/editprofile`, fromdata, {
        withCredentials: true,
      });
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
    <div className="w-full min-h-[100vh] bg-[#0A0F1C] flex flex-col items-center gap-6 py-6">
      {/* Back button */}
      <div className="w-full flex items-center gap-4 px-6">
        <IoArrowBack
          size={30}
          className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
          onClick={() => navigate(`/profile/${userData.userName}`)}
        />
        <h1 className="text-blue-300 text-2xl font-semibold tracking-wide">
          Edit Profile
        </h1>
      </div>

      {/* Profile image */}
      <div
        className="w-20 h-20 md:w-24 md:h-24 border-4 border-blue-500/50 rounded-full cursor-pointer overflow-hidden shadow-[0_0_15px_rgba(37,99,235,0.7)] hover:shadow-[0_0_25px_rgba(37,99,235,0.9)] transition-all"
        onClick={() => imageInput.current.click()}
      >
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          hidden
          onChange={handleImage}
        />
        <img src={frontendImage} alt="profile" className="w-full h-full object-cover" />
      </div>

      <div
        className="text-blue-400 text-center text-lg cursor-pointer hover:text-blue-300 transition-colors"
        onClick={() => imageInput.current.click()}
      >
        Change your profile picture
      </div>

      {/* Input fields */}
      {[
        { value: name, setter: setName, placeholder: "Enter your name" },
        { value: userName, setter: setUserName, placeholder: "Enter your username" },
        { value: bio, setter: setBio, placeholder: "Bio" },
        { value: profession, setter: setProfession, placeholder: "Profession" },
        { value: gender, setter: setGender, placeholder: "Gender" },
      ].map((field, idx) => (
        <input
          key={idx}
          type="text"
          value={field.value}
          onChange={(e) => field.setter(e.target.value)}
          placeholder={field.placeholder}
          className="w-[90%] max-w-[600px] h-14 bg-[#0a1010] border-2 border-blue-500/50 rounded-2xl text-white font-semibold px-5 outline-none placeholder:text-blue-300 focus:border-blue-400 focus:shadow-[0_0_10px_rgba(37,99,235,0.7)] transition-all"
        />
      ))}

      {/* Save button */}
      <button
        onClick={handleEditProfile}
        className="w-[60%] max-w-[400px] h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl shadow-[0_0_15px_rgba(37,99,235,0.6)] hover:shadow-[0_0_25px_rgba(37,99,235,0.9)] transition-all flex items-center justify-center"
      >
        {loading ? <ClipLoader size={28} color="white" /> : "Save Profile"}
      </button>
    </div>
  );
}

export default EditProfile;
