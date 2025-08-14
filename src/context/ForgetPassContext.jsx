import React, { createContext, useContext, useState } from "react";
import { axiosHandler } from "@/config/axiosConfig";

const ForgetPassContext = createContext();

export const useForgetPass = () => useContext(ForgetPassContext);

const ForgetPassContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendForgotPasswordEmail = async (email) => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosHandler.post(
        "auth/forgot-password",
        { email }
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async ({ email, otp, newPassword }) => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosHandler.post(
        "/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgetPassContext.Provider
      value={{
        sendForgotPasswordEmail,
        resetPassword,
        loading,
        error,
      }}
    >
      {children}
    </ForgetPassContext.Provider>
  );
};

export default ForgetPassContextProvider;
