import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext2";

const Registrations = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const { PostUserData, user } = useAuthContext();
  
  const navigate = useNavigate();

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
    initialValues: {
      name: "",
      email: "",
      password: "",
      department: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      if (values.password !== confirmPassword) {
        setConfirmError("Passwords do not match");
        return;
      }

      PostUserData(values);
      setConfirmError("");

      formik.resetForm();
      setConfirmPassword("");
    },
  });

  return (
    <section className="relative h-screen w-full">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="/LoginPageImg/loginBGimg2.jpg"
        alt="Registration background"
      />
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl shadow-xl p-8 w-full h-[70%] flex flex-col justify-center max-w-[30rem]">
          <h2 className="text-3xl font-[500] text-center mb-6 font-rubik text-white">
            Create Your Account
          </h2>

          <form
            className="space-y-5"
            onSubmit={formik.handleSubmit}
            autoComplete="off"
          >
            <div className="relative">
              <label
                className="block text-sm text-white font-medium mb-1"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full px-10 py-2 rounded-md bg-transparent text-gray-300 placeholder-gray-600 focus:outline-none border border-gray-300"
                {...formik.getFieldProps("name")}
              />
              <User className="absolute top-9 left-2" size={19} color="gray" />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-400 mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                className="block text-sm text-white font-medium mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="new-email"
                className="w-full px-10 py-2 rounded-md bg-transparent text-gray-300 placeholder-gray-600 focus:outline-none border border-gray-300"
                {...formik.getFieldProps("email")}
              />
              <Mail className="absolute top-9 left-2" size={18} color="gray" />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-400 mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                className="block text-sm text-white font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full px-10 py-2 rounded-md bg-transparent text-gray-300 placeholder-gray-600 focus:outline-none border border-gray-300"
                {...formik.getFieldProps("password")}
              />
              <Lock className="absolute top-9 left-2" size={18} color="gray" />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-9"
              >
                {showPassword ? (
                  <Eye size={20} color="gray" />
                ) : (
                  <EyeOff size={20} color="gray" />
                )}
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-400 mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                className="block text-sm text-white font-medium mb-1"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={confirmShowPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full px-10 py-2 rounded-md bg-transparent text-gray-300 placeholder-gray-600 focus:outline-none border border-gray-300"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Lock className="absolute top-9 left-2" size={18} color="gray" />
              <div
                onClick={() => setConfirmShowPassword(!confirmShowPassword)}
                className="absolute cursor-pointer right-3 top-9"
              >
                {confirmShowPassword ? (
                  <Eye size={20} color="gray" />
                ) : (
                  <EyeOff size={20} color="gray" />
                )}
              </div>
              {confirmError && (
                <p className="text-sm text-red-400 mt-1">{confirmError}</p>
              )}
            </div>
            <div className="relative">
              <label
                className="block text-sm text-white font-medium mb-1"
                htmlFor="department"
              >
                Department
              </label>
              <select
                id="department"
                name="department"
                className="w-full px-3 py-2 rounded-md bg-[#272727a1] text-gray-300 placeholder-gray-600 focus:outline-none border border-gray-300"
                {...formik.getFieldProps("department")}
              >
                <option value="" disabled>
                  Select your department
                </option>
                <option value="Engineering" className="text-white">
                  Engineering
                </option>
                <option value="Marketing" className="text-white">
                  Marketing
                </option>
                <option value="Sales" className="text-white">
                  Sales
                </option>
                <option value="Design" className="text-white">
                  Design
                </option>
                <option value="Developer" className="text-white">
                  Developer
                </option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <p className="text-sm text-red-400 mt-1">
                  {formik.errors.role}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r to-sky-500 from-purple-600 hover:opacity-90 text-white font-[500] py-2 rounded-md transition duration-200"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-white text-center mt-6">
            Already have an account?{" "}
            <NavLink to="/login" className="text-blue-400 hover:underline">
              Log in
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Registrations;
