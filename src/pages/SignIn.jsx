import React, { useState } from "react";
import logo from "../assets/ZYRA_LOGO.png";
import logo2 from "../assets/ZYRA_LOGO2.png";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [err, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [inputClick, setInputClick] = useState({
    userName: false,
    password: false,
  });

  const [formData, setFormData] = useState({
    userName: "",
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

  const handleSignin = async () => {
    const { userName, password } = formData;
    setLoading(true);
    setError("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { userName, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/"); // redirect after login
    } catch (error) {
      setError(error.response?.data?.message || "Sign in failed");
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (field, label, type = "text") => (
    <div className="relative w-[90%] h-[50px]">
      <label
        htmlFor={field}
        className={`absolute left-4 px-1 transition-all duration-200 bg-[#0A0F1C]
          ${inputClick[field] || formData[field]
            ? "top-[-10px] text-sm text-blue-400"
            : "top-[14px] text-gray-400"
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
        className="w-full h-full border-2 border-blue-500 rounded-2xl px-4 pt-0 outline-none text-white bg-[#0A0F1C] 
          focus:border-blue-400 focus:shadow-[0_0_10px_rgba(37,99,235,0.7)] transition-all"
        required
        disabled={loading}
      />
    </div>
  );

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-[90%] lg:max-w-[60%] h-[500px] bg-[#0A0F1C] rounded-2xl flex overflow-hidden border-2 border-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.5)]">
        {/* Left Section (form) */}
        <div className="w-full lg:w-[50%] h-full flex flex-col items-center pt-8 px-6 gap-8">
          <div className="flex gap-3 items-center text-[20px] font-semibold text-blue-400">
            <span>Sign in to</span>
            <img src={logo} alt="ZYRA Logo" className="h-8 w-auto" />
          </div>

          {renderInput("userName", "Enter your username")}
          {renderInput("password", "Enter your password", "password")}

          <p
            className="w-[85%] text-blue-400 underline cursor-pointer mb-2 hover:text-blue-300"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>

          <div className="h-[5px] w-[90%] text-center">
            {err && <p className="text-red-500 text-lg font-medium">{err}</p>}
          </div>

          <div className="flex flex-col items-center gap-4 mt-1 w-full">
            <button
              onClick={handleSignin}
              disabled={loading}
              className="w-[90%] h-[50px] bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl shadow-[0_0_15px_rgba(37,99,235,0.7)] hover:shadow-[0_0_25px_rgba(37,99,235,0.9)] transition-all flex items-center justify-center"
            >
              {loading ? <ClipLoader size={25} color="#ffffff" /> : "Sign In"}
            </button>

            <p
              className="text-gray-400 cursor-pointer mt-2"
              onClick={() => navigate("/signup")}
            >
              Don't have an account?{" "}
              <span className="underline text-blue-400 hover:text-blue-300">Sign Up</span>
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-[55%] lg:w-[52%] h-full hidden lg:flex flex-col justify-center items-center gap-4 bg-black text-white text-base font-semibold rounded-l-3xl shadow-2xl shadow-black p-6 transition-all duration-300 ease-in-out">
          <img src={logo2} alt="ZYRA_LOGO" className="w-[90%] mb-2" />
          <p className="text-xl font-bold text-blue-400">Where your vibe becomes visible</p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
