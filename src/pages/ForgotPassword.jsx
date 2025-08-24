import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [err, setError] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [inputClick, setInputClick] = useState({ email: false, otp: false });
  const [loading, setLoading] = useState(false);

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

const handleSendOtp = async () => {
  setLoading(true);
  setError(""); 
  try {
    const result = await axios.post(
      `${serverUrl}/api/auth/sendotp`,
      { email: formData.email },
      { withCredentials: true }
    );
    console.log(result.data);
    setStep(2);
  } catch (error) {
    setError(error.response?.data?.message || "Failed to send OTP");
  } finally {
    setLoading(false);
  }
};


const handleVerifyOtp = async () => {
  setLoading(true);
  setError("");
  try {
    const result = await axios.post(`${serverUrl}/api/auth/verifyotp`, {
      email: formData.email,
      otp: formData.otp,
    });
    console.log(result.data);
    setStep(3);
  } catch (error) {
    setError(error.response?.data?.message || "Invalid OTP");
  } finally {
    setLoading(false);
  }
};


const handleResetPassword = async () => {
  if (formData.newPassword !== formData.confirmNewPassword) {
    return setError("Passwords do not match");
  }
  if (formData.newPassword.length < 6) {
    return setError("Password must be at least 6 characters");
  }

  setLoading(true);
  setError("");
  try {
    const result = await axios.post(`${serverUrl}/api/auth/resetpassword`, {
      email: formData.email,
      password: formData.newPassword,
    });
    console.log(result.data);
    alert("Password reset successful! Redirecting to login...");

    setTimeout(() => {
        navigate("/signin");  // <-- Redirect to login page
      }, 2000);

  } catch (error) {
    setError(error.response?.data?.message || "Failed to reset password");
  } finally {
    setLoading(false);
  }
};

  const renderInput = (field, label, type = "text") => (
    <div className="relative w-[90%] h-[50px]">
      <label
        htmlFor={field}
        className={`absolute left-4 transition-all duration-200 bg-white px-1 text-[15px] text-gray-700 pointer-events-none
        ${inputClick[field] || formData[field] ? "top-[-10px] text-sm text-black" : "top-[14px]"}`}
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
      />
    </div>
  );

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center">
      <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-2 border-[#1a1f23] gap-6">
        <h2 className="text-[30px] font-semibold">Forgot Password</h2>

        {step === 1 && (
          <>
            {renderInput("email", "Enter your email", "email")}
            <button
              className="w-[90%] h-[50px] bg-black text-white font-semibold rounded-2xl"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={25} color="#ffffff" /> : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {renderInput("otp", "Enter the OTP", "text")}
            <button
              className="w-[90%] h-[50px] bg-black text-white font-semibold rounded-2xl"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={25} color="#ffffff" /> : "Verify OTP"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            {renderInput("newPassword", "New Password", "password")}
            {renderInput("confirmNewPassword", "Confirm New Password", "password")}
            <button
              className="w-[90%] h-[50px] bg-black text-white font-semibold rounded-2xl"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? <ClipLoader size={25} color="#ffffff" /> : "Reset Password"}
            </button>
          </>
        )}
        <div className="h-[5px] w-[90%] text-center">
            {err && <p className="text-red-500 text-lg font-medium">{err}</p>}
          </div>
      </div>
      
    </div>
  );
}

export default ForgotPassword;
