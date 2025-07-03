import { createContext, useContext, useState } from "react";
import { axiosHandler } from "../config/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('authUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const navigate = useNavigate();

  
    const UserLogin = async (values) => {
        try {
            const res = await axiosHandler.post('/auth/login', values);
            const loggedInUser = res?.data?.user;
            const authToken = res?.data?.token;
            setToken(authToken);
            setUser(loggedInUser);
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('authUser', JSON.stringify(loggedInUser));

            toast.success(res?.data?.message);

            if (loggedInUser.role === "employee") {
                navigate('/employee');
            } else {
                navigate('/admin');
            }

        } catch (error) {
            console.error("Login error:", error);
            toast.error(error?.response?.data?.message || "Login failed");
        }
    };

  
    const PostUserData = async (values) => {
        try {
            const res = await axiosHandler.post('/auth/register', values);
            toast.success(res?.data?.message);
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error?.response?.data?.message || "Registration failed");
        }
    };


    const Logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        navigate('/login');
        toast.info("Logged out successfully");
    };

    // console.log(user)
    return (
        <AuthContext.Provider value={{ token, user, UserLogin, PostUserData, Logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
