import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BellIcon, CheckSquare, LogOutIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthContext } from "../context/AuthContext2";
import { useProfile } from "@/context/UserProfileUpdateContext";
import { useNotifications } from "@/context/NotificationContext";
import { departmentFilters } from "../context/AuthContext2";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, Logout } = useAuthContext();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { notifications, handleMarkAsRead } = useNotifications();
  console.log(notifications)
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

  const navigation = useNavigate()
  const closeNotificationPanel = () => {
    setNotificationOpen(false); 
  };


  return (
    <section className="bg-slate-900/50 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-40">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex  md:flex-row items-center justify-between h-auto md:h-20 py-3 md:py-0 gap-4 md:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <CheckSquare className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xl whitespace-nowrap sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ITSYBIZZ TMS
            </span>
          </motion.div>


          {user && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center flex-wrap md:flex-nowrap justify-end gap-4 w-full md:w-auto"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotificationOpen(true)}
                className="text-purple-400 hover:text-white relative"
              >
                <BellIcon className="h-5 w-5" />
                {notifications.some((note) => !note.isRead) && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping" />
                )}
              </Button>


              <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
                <DialogContent className="bg-slate-900 border-purple-500/30 max-w-md">
                  <DialogHeader>
                    <DialogTitle>Notifications</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((note) => (
                        <div
                          key={note._id}
                          onClick={() => {
                            navigation(`/ticket/${note.ticket}/comment`);
                            closeNotificationPanel();
                          }}
                          className={`cursor-pointer p-3 rounded-lg ${note.isRead
                            ? "bg-[#00000096]"
                            : "bg-[#3f235d] border-l-4 border-[#7d3cbd]"
                            }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              {/* Type Badge */}
                              <span
                                className={`text-xs px-2 py-1 rounded-full mr-2 font-medium ${note.type === "comment"
                                  ? "bg-blue-600 text-white"
                                  : note.type === "message"
                                    ? "bg-green-600 text-white"
                                    : note.type === "ticket"
                                      ? "bg-red-600 text-white"
                                      : "bg-gray-600 text-white"
                                  }`}
                              >
                                {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                              </span>

                              {/* Message */}
                              <p className="text-sm font-semibold text-purple-300 inline">
                                {note.message}
                              </p>

                              {/* Sender */}
                              <p className="text-xs text-gray-300 mt-1">
                                From: {note.sender?.name}
                              </p>

                              {/* Timestamp */}
                              <p className="text-xs text-gray-400">
                                {new Date(note.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Mark as Read Button */}
                          {!note.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // prevent routing on button click
                                handleMarkAsRead(note._id);
                              }}
                              className="text-xs text-purple-400 hover:underline mt-1"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-white">No new notifications.</p>
                    )}
                  </div>


                </DialogContent>
              </Dialog>


              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setDialogOpen(true)}
              >
                <Avatar>
                  <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-white group-hover:underline">
                    {user.name}
                  </p>
                  <p className="text-xs text-purple-300 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-slate-900 border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    {error && (
                      <div className="text-red-400 text-sm">{error}</div>
                    )}
                    <div>
                      <label className="block text-sm text-purple-300 mb-1">
                        Name
                      </label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-purple-300 mb-1">
                        Email
                      </label>
                      <Input
                        value={editEmail}
                        disabled
                        className="bg-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-purple-300 mb-1">
                        Role
                      </label>
                      <Input
                        value={editRole}
                        disabled
                        className="bg-slate-800 text-white"
                      />
                    </div>
                    {user.department && user.role !== "admin" && (
                      <div>
                        <label className="block text-sm text-purple-300 mb-1">
                          Department
                        </label>
                        <select
                          value={editDepartment}
                          onChange={(e) => setEditDepartment(e.target.value)}
                          className="bg-slate-800 text-white px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                        className="text-white"
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


              <Button
                variant="ghost"
                size="icon"
                onClick={Logout}
                className="text-purple-400 hover:text-red-400 hover:bg-red-500/10"
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
