import React, { useState } from "react";
import logo from "../assets/ZYRA_LOGO.png";
import logo2 from "../assets/ZYRA_LOGO2.png";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice.js";
import { useDispatch } from "react-redux"; 


function SignUp() {
  const dispatch = useDispatch()
  const [err, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [inputClick, setInputClick] = useState({
    name: false,
    userName: false,
    email: false,
    password: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });

  const handleFocus = (field) => {
    setInputClick((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    if (formData[field] === "") {
      setInputClick((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    const { name, userName, email, password } = formData;
    setLoading(true);
    setError("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, userName, email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data))
      setLoading(false);
      
    } catch (error) {
      setError(error.response?.data?.message);
      console.error(error.response?.data || error.message);
      setLoading(false);
    }
  };

  const renderInput = (field, label, type = "text") => (
    <div className="relative w-[90%] h-[50px]">
      <label
        htmlFor={field}
        className={`absolute left-4 transition-all duration-200 bg-white px-1 text-[15px] text-gray-700 pointer-events-none
          ${
            inputClick[field] || formData[field]
              ? "top-[-10px] text-sm text-black"
              : "top-[14px]"
          }`}
      >
        {label}
      </label>
      <input
        type={type}
        id={field}
        name={field}
        value={formData[field]}
        onFocus={() => handleFocus(field)}
        onBlur={() => handleBlur(field)}
        onChange={handleChange}
        className="w-full h-full border-2 border-black rounded-2xl px-4 pt-0 outline-none"
        required
        disabled={loading}
      />
    </div>
  );

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">
        {/* Left Section (white) */}
        <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center pt-8 px-6 gap-8">
          <div className="flex gap-3 items-center text-[20px] font-semibold">
            <span>Sign up to</span>
            <img src={logo} alt="ZYRA Logo" className="h-8 w-auto" />
          </div>

          {/* Input Fields */}
          {renderInput("name", "Enter your name")}
          {renderInput("userName", "Choose a username")}
          {renderInput("email", "Enter your email")}
          {renderInput("password", "Create a password", "password")}

          <div
            className="w-full flex items-center justify-center"
            style={{ minHeight: "20px", marginBottom: "-30px" }}
          >
            {err && <p className="text-red-500 text-lg font-medium">{err}</p>}
          </div>

          <div className="flex flex-col items-center gap-2 mt-8">
            <button
              className="w-[90%] h-[50px] bg-black text-white font-semibold rounded-2xl flex justify-center items-center"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? <ClipLoader size={25} color="#ffffff" /> : "Sign Up"}
            </button>

            <p
              className="text-gray-800  cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Already have an account?{" "}
              <span className="underline text-black">Sign In</span>
            </p>
          </div>
        </div>

        {/* Right Section (black) */}
        <div className="md:w-[55%] lg:w-[52%] h-full hidden lg:flex flex-col justify-center items-center gap-4 bg-black text-white text-base font-semibold rounded-l-3xl shadow-2xl shadow-black p-6 transition-all duration-300 ease-in-out">
          <img src={logo2} alt="ZYRA_LOGO" className="w-[90%] mb-2" />
          <p className="text-xl font-bold">Where your vibe becomes visible</p>

          {/* Right panel content here */}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
