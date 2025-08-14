import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext2";
import { departmentFilters } from "../context/AuthContext2";

const Registrations = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const { PostUserData, user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "employee") navigate("/employee", { replace: true });
      else navigate("/admin", { replace: true });
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
    <section className="relative min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 sm:p-8">
      {/* Background Image */}
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        src="/LoginPageImg/loginbg.png"
        alt="Registration background"
      />

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Form Card */}
        <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 flex flex-col">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
            Create Your Account
          </h2>

          <form
            className="space-y-5"
            onSubmit={formik.handleSubmit}
            autoComplete="off"
          >
            {/* Name */}
            <div className="relative">
              <label className="block text-sm text-gray-800 mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full pl-10 pr-3 py-2 rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...formik.getFieldProps("name")}
              />
              <User className="absolute top-9 left-2" size={19} color="gray" />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm text-gray-800 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2 rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...formik.getFieldProps("email")}
              />
              <Mail className="absolute top-9 left-2" size={18} color="gray" />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm text-gray-800 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...formik.getFieldProps("password")}
              />
              <Lock className="absolute top-9 left-2" size={18} color="gray" />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-9"
              >
                {showPassword ? <Eye size={20} color="gray" /> : <EyeOff size={20} color="gray" />}
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm text-gray-800 mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={confirmShowPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 rounded-md bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Lock className="absolute top-9 left-2" size={18} color="gray" />
              <div
                onClick={() => setConfirmShowPassword(!confirmShowPassword)}
                className="absolute cursor-pointer right-3 top-9"
              >
                {confirmShowPassword ? <Eye size={20} color="gray" /> : <EyeOff size={20} color="gray" />}
              </div>
              {confirmError && <p className="text-sm text-red-500 mt-1">{confirmError}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm text-gray-800 mb-1" htmlFor="department">
                Department
              </label>
              <select
                id="department"
                name="department"
                className="w-full px-3 py-2 rounded-md bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...formik.getFieldProps("department")}
              >
                <option value="" disabled>
                  Select your department
                </option>
                {departmentFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-sky-500 hover:opacity-90 text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-gray-800 text-center mt-6">
            Already have an account?{" "}
            <NavLink to="/login" className="text-blue-500 hover:underline">
              Log in
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Registrations;
