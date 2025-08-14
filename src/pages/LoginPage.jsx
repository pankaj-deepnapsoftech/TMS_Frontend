import { useFormik } from "formik";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext2";
import { useForgetPass } from "../context/ForgetPassContext";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { UserLogin, user } = useAuthContext();

  const navigate = useNavigate();
  const { sendForgotPasswordEmail, resetPassword, loading, error } = useForgetPass();

  useEffect(() => {
    if (user) {
      if (user.role === "employee") {
        navigate("/employee", { replace: true });
      } else {
        navigate("/admin", { replace: true });
      }
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: (values) => {
      UserLogin(values);
    },
  });

  const sendForgotEmail = async (email) => {
    try {
      await sendForgotPasswordEmail(email);
      setForgotStep(2);
    } catch (e) {
      console.log(e);
    }
  };

  const verifyOtpAndReset = async (email, otp, password) => {
    try {
      await resetPassword({ email, otp, newPassword: password });
      setShowForgotPassword(false);
      setForgotStep(1);
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      toast.success("Password reset successful! Please login.");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <section className="relative h-screen w-full bg-white">
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        src="/LoginPageImg/loginbg.png"
        alt="Login background"
      />
      <div className="absolute inset-0 bg-white bg-opacity-50" />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
        <div className="backdrop-blur-lg bg-gray-100 rounded-xl shadow-xl p-8 w-full max-w-[30rem]">
          <div className="w-full flex justify-center items-center">
            <img className="h-32" src="/LoginPageImg/CompanyLogo.png" alt="" />
          </div>

          {!showForgotPassword ? (
            <>
              <form className="space-y-6" onSubmit={formik.handleSubmit}>
                <div className="relative">
                  <label
                    className="block text-sm font-[500] text-gray-700 mb-1"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-10 py-2 rounded-md bg-transparent text-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                    autoComplete="new-email"
                    value={formik.values.email}
                    onBlur={formik.onBlur}
                    onChange={formik.handleChange}
                  />
                  <Mail
                    color="gray"
                    size={19}
                    className="absolute top-9 left-2"
                  />
                </div>

                <div className="relative">
                  <label
                    className="block text-sm font-[500] text-gray-700 mb-1"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-10 py-2 border border-gray-600 rounded-md bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                    autoComplete="new-password"
                    value={formik.values.password}
                    onBlur={formik.onBlur}
                    onChange={formik.handleChange}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-3 top-9"
                  >
                    {showPassword ? (
                      <Eye size={20} color="gray" />
                    ) : (
                      <EyeOff color="gray" size={20} />
                    )}
                  </div>
                  <Lock
                    color="gray"
                    size={19}
                    className="absolute top-9 left-2"
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-blue-500" />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="hover:underline text-blue-500 bg-transparent border-none outline-none cursor-pointer"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-br from-blue-600 to-slate-700 text-white font-[500] py-2 rounded-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  Log In
                </button>
              </form>

              <p className="text-sm text-gray-700 text-center mt-6">
                Don't have an account?{" "}
                <NavLink
                  to="/registration"
                  className="text-blue-500 hover:underline"
                >
                  Register
                </NavLink>
              </p>
            </>
          ) : (
            <form
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                if (forgotStep === 1) {
                  await sendForgotEmail(forgotEmail);
                } else {
                  await verifyOtpAndReset(forgotEmail, otp, newPassword);
                }
              }}
            >
              {forgotStep === 1 ? (
                <>
                  <label
                    className="block text-sm font-[500] text-gray-700 mb-1"
                    htmlFor="forgot-email"
                  >
                    Enter your email to reset password
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 rounded-md bg-transparent text-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-[500] py-2 rounded-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 mt-2"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Verify Email"}
                  </button>
                </>
              ) : (
                <>
                  <label
                    className="block text-sm font-[500] text-gray-700 mb-1"
                    htmlFor="otp"
                  >
                    Enter OTP sent to your email
                  </label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 rounded-md bg-transparent text-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <label
                    className="block text-sm font-[500] text-gray-700 mb-1 mt-4"
                    htmlFor="new-password"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="New password"
                      className="w-full px-4 py-2 rounded-md bg-transparent text-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute cursor-pointer right-3 top-2.5"
                    >
                      {showPassword ? (
                        <Eye size={20} color="gray" />
                      ) : (
                        <EyeOff color="gray" size={20} />
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-slate-800 text-white font-[500] py-2 rounded-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 mt-2"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </>
              )}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button
                type="button"
                className="w-full text-blue-500 mt-2 underline"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotStep(1);
                  setForgotEmail("");
                  setOtp("");
                  setNewPassword("");
                }}
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
