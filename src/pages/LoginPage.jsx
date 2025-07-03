import { useFormik } from 'formik'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext2'

const LoginPage = () => {

    const [showPassword, setShowPassword] = useState(false)
    const { UserLogin } = useAuthContext()
   const formik = useFormik({
    initialValues:{
        email:'',
        password:'',
    },
    onSubmit: (values) =>{
        UserLogin(values)
    }
   })


    return (
        <section className="relative h-screen w-full ">

            <img
                className="absolute inset-0 h-full w-full object-cover"
                src="/LoginPageImg/loginBGimg2.jpg"
                alt="Login background"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl shadow-xl p-8 w-full  max-w-[30rem]">
                    <div className='w-full flex justify-center items-center'>
                        <img className='h-32' src="/LoginPageImg/CompanyLogo.png" alt="" />

                    </div>
                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        <div className='relative'>
                            <label className="block text-sm font-[500] text-white mb-1" htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-10 py-2 rounded-md bg-transparent text-gray-300 border border-gray-400 placeholder-gray-600 focus:outline-none "
                                required
                                autoComplete="new-email"
                                value={formik.values.email}
                                onBlur={formik.onBlur}
                                onChange={formik.handleChange}
                            />
                            <Mail color='gray' size={19} className='absolute top-9 left-2' />
                        </div>

                        <div className='relative'>
                            <label className="block text-sm font-[500]  text-white mb-1" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full px-10 py-2 border border-gray-400 rounded-md bg-transparent text-gray-300 placeholder-gray-600 focus:outline-none "
                                required
                                autoComplete="new-password"
                                value={formik.values.password}
                                onBlur={formik.onBlur}
                                onChange={formik.handleChange}
                            />
                            <div onClick={() => setShowPassword(!showPassword)} className='absolute cursor-pointer right-3 top-9  '>
                                {showPassword ? <Eye size={20} color='gray'  /> : <EyeOff color='gray' size={20} />}
                            </div>
                            <Lock color='gray' size={19} className="absolute top-9 left-2" />
                        </div>

                        <div className="flex items-center justify-between text-sm text-white">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="accent-blue-500" />
                                Remember me
                            </label>
                            <a href="#" className="hover:underline text-blue-300">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r to-sky-500 from-purple-600 hover:opacity-90 text-white font-[500] py-2 rounded-md transition duration-200"
                        >
                            Log In
                        </button>
                    </form>

                    <p className="text-sm text-white text-center mt-6">
                        Don't have an account?{" "}
                        <NavLink to="/registration" className="text-blue-400 hover:underline">
                            Register
                        </NavLink>
                    </p>
                </div>
            </div>
        </section>

    )
}

export default LoginPage