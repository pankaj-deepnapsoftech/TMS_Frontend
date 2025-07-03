import { axiosHandler } from "@/config/axiosConfig";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext2";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [editName, setEditName] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, updateUser } = useAuthContext();

  const fetchProfile = async () => {
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await axiosHandler.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const u = res.data.user || res.data;
      setEditName(u.name || "");
      setEditDepartment(u.department || "");
      setEditRole(u.role || "");
      setEditEmail(u.email || "");
    } catch (err) {
      setError("Failed to fetch profile");
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await axiosHandler.put(
        `/auth/profile`,
        {
          name: editName,
          department: editDepartment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedUser = res.data.user || res.data;
      setEditName(updatedUser.name || editName);
      setEditDepartment(updatedUser.department || editDepartment);
      if (updateUser) updateUser(updatedUser);
      setDialogOpen(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        editName,
        setEditName,
        editDepartment,
        setEditDepartment,
        editRole,
        editEmail,
        loading,
        error,
        fetchProfile,
        handleProfileSave,
        dialogOpen,
        setDialogOpen,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
