import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  Trash2,
  Calendar,
  Clock,
  Flag,
  User,
  Briefcase,
  MessageSquare,
  Eye,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext2";
import { departmentFilters } from "../context/AuthContext2";

const TicketCard = ({ ticket, onEdit, onDelete, onStatusChange }) => {
  // const { user: currentUser } = useAuth();
  const { user: currentUser, allUsers } = useAuthContext();
  const navigate = useNavigate();

  // Helper function to safely get assigned users (robust matching)
  const getAssignedUsers = () => {
    if (!ticket.assignedTo) return [];
    const assignedArr = Array.isArray(ticket.assignedTo)
      ? ticket.assignedTo
      : [ticket.assignedTo];
    return allUsers.filter((u) =>
      assignedArr.some(
        (a) => a?._id === u._id || a?._id === u.id || a === u._id || a === u.id
      )
    );
  };

  // Helper function to check if current user is assigned (robust matching)
  const isAssignedToCurrentUser = () => {
    if (!ticket.assignedTo || !currentUser?.id) return false;
    const assignedArr = Array.isArray(ticket.assignedTo)
      ? ticket.assignedTo
      : [ticket.assignedTo];
    return assignedArr.some(
      (a) => a?._id === currentUser.id || a === currentUser.id
    );
  };

  const assignedUsers = getAssignedUsers();
  // For plain name list (if needed elsewhere):
  // const assignedNames = assignedUsers.map((u) => u.name).join(", ");
  // Robust department label matching (by value or label, case-insensitive)
  const department = departmentFilters.find(
    (d) =>
      d.value?.toLowerCase() === String(ticket?.department).toLowerCase() ||
      d.label?.toLowerCase() === String(ticket?.department).toLowerCase()
  ) || { label: ticket?.department || "N/A" };

  const status = allUsers.find((s) => s._id === ticket.status);

  // Priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  // Status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "in progress":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "under review":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "resolved":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "closed":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return (
      new Date(dueDate) < new Date() &&
      ticket.status !== "resolved" &&
      ticket.status !== "closed"
    );
  };

  const handleViewTicket = () => {
    const id = ticket?._id || ticket?.id;
    if (!id) {
      console.warn("Ticket ID is missing");
      return;
    }
    navigate(`/ticket/${id}/comment`);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };
   
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 overflow-hidden ${
          ticket.status === "closed" ? "opacity-75" : ""
        } ${isAssignedToCurrentUser() ? "ring-1 ring-purple-400/30" : ""}`}
        style={{ wordBreak: "break-word" }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className=" text-[10px] border border-red-500 bg-[#8b21265d] rounded-full px-4 py-1">
                   {ticket.ticketNumber}
                </div>
                <Badge className={getStatusColor(ticket.status)}>
                  {status?.name || ticket.status}
                </Badge>
              </div>
             
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleViewTicket}
                className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
              >
                <Eye className="h-4 w-4" />
              </Button>
              {currentUser && currentUser.role === "admin" && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(ticket)}
                    className="h-8 w-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(ticket._id)}
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge className={getPriorityColor(ticket.priority)}>
              <Flag className="w-3 h-3 mr-1" />
              {ticket.priority.charAt(0).toUpperCase() +
                ticket.priority.slice(1)}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-pink-500/20 text-pink-300 border-pink-500/30"
            >
              <Briefcase className="w-3 h-3 mr-1" />
              {department.label}
            </Badge>
            {ticket.comments && ticket.comments.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-green-500/20 text-green-300 border-green-500/30"
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                {ticket.comments.length} comment
                {ticket.comments.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          <div>
            <h3
              className={`font-semibold text-lg leading-tight ${ticket.status === "closed"
                  ? "line-through text-gray-400"
                  : "text-white"
                }`}
              style={{ wordBreak: "break-word" }}
            >
              {ticket.title}
            </h3>
            {ticket.description && (
              <p
                className={`text-sm mt-1 line-clamp-2 ${ticket.status === "closed"
                    ? "text-gray-500"
                    : "text-gray-300"
                  }`}
                style={{ wordBreak: "break-word" }}
              >
                {ticket.description}
              </p>
            )}
          </div>
          <div className="flex justify-between gap-3 items-end text-sm text-gray-400">
            {assignedUsers.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {assignedUsers.length === 1 ? (
                    <User className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Users className="w-4 h-4 text-purple-400" />
                  )}
                  <span>Assigned to ({assignedUsers.length}):</span>
                </div>
                <div className="flex flex-wrap gap-2 ">
                  {assignedUsers.slice(0, 3).map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex items-center gap-2 rounded-full px-2 py-1 border ${
                        user.id === currentUser?.id
                          ? "bg-purple-500/30 border-purple-400/50"
                          : "bg-slate-700/30 border-purple-500/20"
                      }`}
                    >
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs bg-purple-500/20">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`font-medium text-xs ${
                          user.id === currentUser?.id
                            ? "text-purple-200"
                            : "text-white"
                        }`}
                      >
                        {user.id === currentUser?.id ? "You" : user.name}
                      </span>
                    </motion.div>
                  ))}
                  {assignedUsers.length > 3 && (
                    <div className="flex items-center justify-center bg-slate-700/30 rounded-full px-2 py-1 border border-purple-500/20">
                      <span className="text-xs text-purple-300">
                        +{assignedUsers.length - 3} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {ticket.dueDate && (
              <div
                className={`flex items-center gap-2 ${
                  isOverdue(ticket.dueDate) ? "text-red-400" : ""
                }`}
              >
                {isOverdue(ticket.dueDate) ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <Calendar className="w-4 h-4" />
                )}
                <span>
                  {isOverdue(ticket.dueDate) ? "Overdue: " : "Due: "}{" "}
                  {formatDate(ticket.dueDate)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TicketCard;
