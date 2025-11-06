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
  const [inputClick, setInputClick] = useState({
    email: false,
    otp: false,
    newPassword: false,
    confirmNewPassword: false,
  });
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
        navigate("/signin");
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
        className={`absolute left-4 transition-all duration-200 px-1
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
        className="w-full h-full border-2 border-blue-500 rounded-2xl px-4 pt-0 outline-none text-white bg-[#0A0F1C] focus:border-blue-400 focus:shadow-[0_0_10px_rgba(37,99,235,0.7)] transition-all"
        required
      />
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-[90%] max-w-[500px] bg-[#0A0F1C] rounded-2xl flex flex-col items-center gap-6 p-6 shadow-[0_0_25px_rgba(37,99,235,0.5)] border border-blue-500">
        <h2 className="text-[28px] font-bold text-blue-400 tracking-wide">
          Forgot Password
        </h2>

        {step === 1 && (
          <>
            {renderInput("email", "Enter your email", "email")}
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-[90%] h-[50px] bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl shadow-[0_0_15px_rgba(37,99,235,0.7)] hover:shadow-[0_0_25px_rgba(37,99,235,0.9)] transition-all flex items-center justify-center"
            >
              {loading ? <ClipLoader size={25} color="#ffffff" /> : "Send OTP"}
            </button>

            <p
              className="text-gray-400 cursor-pointer mt-2"
              onClick={() => navigate("/signin")}
            >
              Back to Sign In{" "}
              <span className="underline text-blue-400 hover:text-blue-300">Sign In</span>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            {renderInput("otp", "Enter the OTP", "text")}
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-[90%] h-[50px] bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl shadow-[0_0_15px_rgba(37,99,235,0.7)] hover:shadow-[0_0_25px_rgba(37,99,235,0.9)] transition-all flex items-center justify-center"
            >
              {loading ? <ClipLoader size={25} color="#ffffff" /> : "Verify OTP"}
            </button>

            <p
              className="text-gray-400 cursor-pointer mt-2"
              onClick={() => navigate("/signin")}
            >
              Back to Sign In{" "}
              <span className="underline text-blue-400 hover:text-blue-300">Sign In</span>
            </p>

          </>
        )}

        {step === 3 && (
          <>
            {renderInput("newPassword", "New Password", "password")}
            {renderInput("confirmNewPassword", "Confirm New Password", "password")}
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-[90%] h-[50px] bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl shadow-[0_0_15px_rgba(37,99,235,0.7)] hover:shadow-[0_0_25px_rgba(37,99,235,0.9)] transition-all flex items-center justify-center"
            >
              {loading ? <ClipLoader size={25} color="#ffffff" /> : "Reset Password"}
            </button>

            <p
              className="text-gray-400 cursor-pointer mt-2"
              onClick={() => navigate("/signin")}
            >
              Back to Sign In{" "}
              <span className="underline text-blue-400 hover:text-blue-300">Sign In</span>
            </p>
          </>
        )}

        {err && (
          <p className="text-red-500 text-center font-medium">{err}</p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
