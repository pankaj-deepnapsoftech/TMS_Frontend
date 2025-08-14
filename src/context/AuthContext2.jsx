import { createContext, useContext, useEffect, useState } from "react";
import { axiosHandler } from "../config/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket";

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
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);

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
      axiosHandler.defaults.headers.authorization = `Bearer ${authToken}`;

      toast.success(res?.data?.message);

      if (loggedInUser.role === "employee") {
        navigate("/employee");
        window.location.reload();
      } else {
        navigate("/admin");
        window.location.reload();
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
      // console.log(res?.data);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  const GtAllUsers = async () => {
    try {
      const res = await axiosHandler.get("/auth/employees");
      setAllUsers(res?.data?.data);
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

  useEffect(() => {
    if (token) {
      GtAllUsers();
    }
  }, []);

  const UnapprovedUsers = async () => {
    try {
      const res = await axiosHandler.get("/auth/unapproved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUnapprovedUsers(res?.data?.data);
      // console.log(res?.data)
    } catch (error) {
      console.error("Error fetching unapproved users:", error);
      toast.error("Failed to fetch unapproved users");
    }
  };

  const approveUser = async (userId) => {
    try {
      const res = await axiosHandler.put(
        `/auth/approve/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await UnapprovedUsers();
      toast.success(res?.data?.message || "User approved successfully");
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user");
    }
  };

  const rejectUser = async (userId) => {
    try {
      const res = await axiosHandler.put(
        `/auth/reject/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res?.data?.message || "User rejected successfully");
      setUnapprovedUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Failed to reject user");
    }
  };

  useEffect(() => {
    if (token) {
      UnapprovedUsers()
    }
  }, [token])


  useEffect(() => {
    socket.on("registeruser", (data) => {

      setUnapprovedUsers((prev) => [data, ...prev])

      //  console.log("resgisterUser",data)
    });

    return () => {
      socket.off("registeruser");
    };
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
        UnapprovedUsers,
        unapprovedUsers,
        approveUser,
        rejectUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
