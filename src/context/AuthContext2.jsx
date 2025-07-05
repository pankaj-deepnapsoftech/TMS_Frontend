import { createContext, useContext, useEffect, useState } from "react";
import { axiosHandler } from "../config/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const departmentFilters = [
  { label: "All Departments", value: "all" },
  { label: "Human Resources", value: "hr" },
  { label: "Engineering", value: "engineering" },
  { label: "Sales", value: "sales" },
  { label: "Marketing", value: "marketing" },
  { label: "Finance", value: "finance" },
  { label: "Customer Support", value: "support" },
  { label: "IT & Infrastructure", value: "it" },
  { label: "Legal", value: "legal" },
  { label: "Operations", value: "operations" },
  { label: "Product Management", value: "product" },
  { label: "Research & Development", value: "rnd" },
  { label: "Developer", value: "Developer" },
];


const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [allUsers, setAllUsers] = useState([]);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("authUser", JSON.stringify(updatedUser));
    
  };

  const navigate = useNavigate();

  const UserLogin = async (values) => {
    try {
      const res = await axiosHandler.post("/auth/login", values);
      const loggedInUser = res?.data?.user;
      const authToken = res?.data?.token;
      setToken(authToken);
      setUser(loggedInUser);
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("authUser", JSON.stringify(loggedInUser));

      toast.success(res?.data?.message);

      if (loggedInUser.role === "employee") {
        navigate("/employee");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  const PostUserData = async (values) => {
    try {
      const res = await axiosHandler.post("/auth/register", values);
      toast.success(res?.data?.message);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  const GtAllUsers = async () => {
    try {
      const res = await axiosHandler.get("/auth/employees");
      setAllUsers(res?.data?.data);
      console.log(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const Logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  // console.log(user)
  useEffect(() => {
    if (token) {
      GtAllUsers();
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        UserLogin,
        PostUserData,
        Logout,
        allUsers,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
