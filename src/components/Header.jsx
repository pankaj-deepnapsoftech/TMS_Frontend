import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { BellIcon, CheckSquare, LogOutIcon, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthContext } from "../context/AuthContext2";
import { useProfile } from "@/context/UserProfileUpdateContext";
import { useNotifications } from "@/context/NotificationContext";
import { departmentFilters } from "../context/AuthContext2";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket";

const Header = () => {
  const {
    user,
    Logout,
    UnapprovedUsers,
    unapprovedUsers,
    approveUser,
    rejectUser,
  } = useAuthContext();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [showAdmitDropdown, setShowAdmitDropdown] = useState(false);
  const { notifications, handleMarkAsRead } = useNotifications();
  const {
    editName,
    setEditName,
    editDepartment,
    setEditDepartment,
    editRole,
    editEmail,
    loading,
    error,
    dialogOpen,
    setDialogOpen,
    handleProfileSave,
  } = useProfile();

  const navigation = useNavigate();

  const handleShowAdmitDropdown = () => {
    setShowAdmitDropdown((prev) => !prev);
    if (!showAdmitDropdown && user?.role === "admin") {
      UnapprovedUsers();
    }
  };

  const handleAdmitUser = (userId, accept) => {
    if (accept) {
      approveUser(userId);
    } else {
      rejectUser(userId);
    }
  };

  return (
    <section className="bg-white backdrop-blur-lg border-b border-blue-300 sticky top-0 z-40">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex md:flex-row items-center justify-between h-auto md:h-20 py-3 md:py-0 gap-2 md:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <span className="text-lg whitespace-nowrap sm:text-2xl font-bold bg-gradient-to-br from-blue-600 to-slate-700 bg-clip-text text-transparent">
              ITSYBIZZ TMS
            </span>
          </motion.div>

          {user && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center flex-wrap md:flex-nowrap justify-end gap-2 w-full md:w-auto"
            >
              {user.role === "admin" && (
                <DropdownMenu
                  open={showAdmitDropdown}
                  onOpenChange={setShowAdmitDropdown}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 border-blue-400 hover:bg-blue-100 hover:text-blue-800 relative transition-colors duration-200"
                      aria-label="Show pending user requests"
                    >
                      <UserPlus size="20" />
                      {unapprovedUsers && unapprovedUsers.length > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border-blue-300 text-black max-w-xs md:max-w-lg w-80 mt-2 shadow-lg">
                    <div className="px-4 py-2 border-b border-blue-200 flex items-center justify-between">
                      <span className="font-semibold text-blue-700">
                        Pending User Requests
                      </span>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto px-1 py-2">
                      {unapprovedUsers && unapprovedUsers.length > 0 ? (
                        unapprovedUsers.map((pending) => (
                          <motion.div
                            key={pending._id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-3 rounded-lg bg-blue-50 flex flex-col gap-1 border border-blue-100"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarFallback>
                                  {pending.name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {pending.name}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                  {pending.department}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2 justify-end">
                              <Button
                                size="sm"
                                className="bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 transition-colors duration-150"
                                onClick={() =>
                                  handleAdmitUser(pending._id, true)
                                }
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition-colors duration-150"
                                onClick={() =>
                                  handleAdmitUser(pending._id, false)
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600 px-4 py-2">
                          No pending requests.
                        </p>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <div className="relative">
                <DropdownMenu
                  open={notificationOpen}
                  onOpenChange={setNotificationOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:text-blue-200 relative"
                      aria-label="Show notifications"
                    >
                      <BellIcon className="h-5 w-5" />
                      {notifications.some((note) => !note.isRead) && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white max-w-xs md:max-w-lg w-80 mt-2 shadow-lg">
                    <div className="px-4 py-2 flex items-center justify-between">
                      <span className="font-semibold text-blue-700">
                        Notifications
                      </span>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto px-1 py-2">
                      {notifications.length > 0 ? (
                        notifications.map((note) => (
                          <motion.div
                            key={note._id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => {
                              navigation(`/ticket/${note.ticket}/comment`);
                              setNotificationOpen(false);
                            }}
                            className={`cursor-pointer p-3 rounded-lg transition-colors duration-150 ${
                              note.isRead
                                ? "bg-gray-50"
                                : "bg-blue-100 border-l-4 border-blue-400"
                            } hover:bg-blue-200`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full mr-2 font-medium ${
                                    note.type === "comment"
                                      ? "bg-blue-500 text-white"
                                      : note.type === "message"
                                      ? "bg-green-500 text-white"
                                      : note.type === "ticket"
                                      ? "bg-red-500 text-white"
                                      : "bg-gray-500 text-white"
                                  }`}
                                >
                                  {note.type.charAt(0).toUpperCase() +
                                    note.type.slice(1)}
                                </span>
                                <p className="text-sm font-semibold text-blue-700 inline">
                                  {note.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  From: {note?.sender?.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(note.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            {!note.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(note._id);
                                }}
                                className="text-xs text-blue-600 hover:underline mt-1"
                              >
                                Mark as Read
                              </button>
                            )}
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600 px-4 py-2">
                          No new notifications.
                        </p>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setDialogOpen(true)}
              >
                <Avatar>
                  <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-gray-900 group-hover:underline">
                    {user.name}
                  </p>
                  <p className="text-xs text-blue-600 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-white border-blue-300 text-black shadow-lg">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    {error && (
                      <div className="text-red-500 text-sm">{error}</div>
                    )}
                    <div>
                      <label className="block text-sm text-gray-700-700 mb-1">
                        Name
                      </label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-gray-100 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700-700 mb-1">
                        Email
                      </label>
                      <Input
                        value={editEmail}
                        disabled
                        className="bg-gray-100 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700-700 mb-1">
                        Role
                      </label>
                      <Input
                        value={editRole}
                        disabled
                        className="bg-gray-100 text-gray-900"
                      />
                    </div>
                    {user.department && user.role !== "admin" && (
                      <div>
                        <label className="block text-sm text-gray-700-700 mb-1">
                          Department
                        </label>
                        <select
                          value={editDepartment}
                          onChange={(e) => setEditDepartment(e.target.value)}
                          className="bg-gray-100 text-gray-900 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          {departmentFilters
                            .filter((dept) => dept.value !== "all")
                            .map((dept) => (
                              <option key={dept.value} value={dept.value}>
                                {dept.label}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="text-white bg-blue-500 hover:bg-blue-600"
                        type="submit"
                        variant="default"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Updated Logout Button with Confirmation */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (window.confirm("Are you sure you want to log out?")) {
                    Logout();
                  }
                }}
                className="text-blue-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <LogOutIcon className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Header;
