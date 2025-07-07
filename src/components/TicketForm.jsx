import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Plus, X, Calendar, Ticket, Search } from "lucide-react";
import { useTicketCreate } from "../context/TicketCreateContext";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { departmentFilters } from "../context/AuthContext2";

const TicketForm = ({ ticket, users, onClose, isOpen }) => {
  const { TicketCreate, updatedTicket } = useTicketCreate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (ticket?.assignedTo && users.length > 0) {
      const assignedArr = Array.isArray(ticket.assignedTo)
        ? ticket.assignedTo
        : [ticket.assignedTo];

      const assigned = users.filter((user) =>
        assignedArr.some(
          (a) => a === user._id || a?._id === user._id || a === user._id
        )
      );
      setSelectedUsers(assigned);
    }
  }, [ticket, users]);

  const handleAssigneeToggle = (userId) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === userId)
        ? prev.filter((u) => u._id !== userId)
        : [...prev, user]
    );
  };

  const removeAssignee = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const formik = useFormik({
    initialValues: {
      title: ticket?.title || "",
      description: ticket?.description || "",
      department: ticket?.department || "all",
      priority: ticket?.priority
        ? ticket.priority.charAt(0).toUpperCase() +
          ticket.priority.slice(1).toLowerCase()
        : "Medium",
      status: ticket?.status
        ? ticket.status
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")
        : "Open",
      dueDate: ticket?.dueDate?.split("T")[0] || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      department: Yup.string()
        .required("Department is required")
        .notOneOf(["all"], "Please select a department"),
      priority: Yup.string().oneOf(["Low", "Medium", "High"]).required(),
      status: Yup.string()
        .oneOf(["Open", "In Progress", "Under Review", "Resolved", "Closed"])
        .required(),
      dueDate: Yup.date().required("Due date is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      const departmentObj = departmentFilters.find(
        (d) => d.value === values.department
      );
      const payload = {
        title: values.title,
        description: values.description,
        department: departmentObj?.label || "",
        priority: values.priority,
        status: values.status,
        dueDate: values.dueDate,
        assignedTo: selectedUsers.map((u) => u._id),
      };
      if (ticket) {
        updatedTicket(ticket._id, payload);
      } else {
        TicketCreate(payload);
      }
      onClose()
      formik.resetForm()
    },
  });

  const filteredUsers = (
    formik.values.department === "all"
      ? users
      : users.filter((user) => user.department === formik.values.department)
  ).filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-gradient-to-r from-slate-900/95 to-purple-700/10 border-purple-500/20  max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
            <Ticket className="w-6 h-6 text-purple-400" />
            {ticket ? "Edit Ticket" : "Create New Ticket"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="text-sm font-medium text-purple-200 mb-2 block">
              Ticket Title
            </label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="Enter ticket title..."
              className="bg-slate-800/50 border-purple-500/30 text-white"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-xs text-red-400">{formik.errors.title}</p>
            )}
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-sm font-medium text-purple-200 mb-2 block">
              Description
            </label>
            <Textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Describe the ticket..."
              className="bg-slate-800/50 border-purple-500/30 text-white"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-xs text-red-400">
                {formik.errors.description}
              </p>
            )}
          </motion.div>

          {/* Department */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-sm font-medium text-purple-200 mb-2 block">
              Department
            </label>
            <Select
              value={formik.values.department}
              onValueChange={(value) =>
                formik.setFieldValue("department", value)
              }
            >
              <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                {departmentFilters.map((dep) => (
                  <SelectItem key={dep.id} value={dep.value}>
                    {dep.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Team Assignment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="text-sm font-medium text-purple-200 mb-3 block">
              Team Assignment ({selectedUsers.length})
            </label>

            {/* Selected Users Display */}
            {selectedUsers.length > 0 && (
              <Card className="mb-4 bg-slate-800/30 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedUsers.map((user) => (
                      <motion.div
                        key={user._id}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user.department || "No Department"}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAssignee(user._id)}
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search Box */}
            <div className="relative mb-4">
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800/50 border-purple-500/30 text-white pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
            </div>

            {/* User List */}
            <Card className="bg-slate-800/30 border-purple-500/20">
              <CardContent className="p-4">
                <div className="text-sm text-purple-400 mb-4">
                  Select Team Members
                </div>
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleAssigneeToggle(user._id)}
                        className="flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg cursor-pointer"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-white text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">
                            {user.department || "No Department"}
                          </p>
                        </div>
                        <Plus className="w-4 h-4 text-purple-400" />
                      </div>
                    ))
                  ) : (
                    <p className="text-purple-300 text-sm">No users found.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedUsers.length === 0 && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <X className="w-3 h-3" />
                Please assign at least one team member to this ticket
              </p>
            )}
          </motion.div>

          {/* Priority, Status, Due Date */}
          <div className="grid grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label className="text-sm font-medium text-purple-200 mb-2 block">
                Priority
              </label>
              <Select
                value={formik.values.priority}
                onValueChange={(value) =>
                  formik.setFieldValue("priority", value)
                }
              >
                <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  <SelectItem value="Low" className="text-green-400">
                    Low
                  </SelectItem>
                  <SelectItem value="Medium" className="text-yellow-400">
                    Medium
                  </SelectItem>
                  <SelectItem value="High" className="text-red-400">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-purple-200 mb-2 block">
                Status
              </label>
              <Select
                value={formik.values.status}
                onValueChange={(value) => formik.setFieldValue("status", value)}
              >
                <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  <SelectItem value="Open" className="text-white">
                    Open
                  </SelectItem>
                  <SelectItem value="In Progress" className="text-white">
                    In Progress
                  </SelectItem>
                  <SelectItem value="Under Review" className="text-white">
                    Under Review
                  </SelectItem>
                  <SelectItem value="Resolved" className="text-white">
                    Resolved
                  </SelectItem>
                  <SelectItem value="Closed" className="text-white">
                    Closed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-sm font-medium text-purple-200 mb-2 block">
                Due Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  name="dueDate"
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  className="bg-slate-800/50 border-purple-500/30 text-white "
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-purple-500/30 text-purple-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formik.values.title || selectedUsers.length === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              {ticket ? "Update Ticket" : "Create Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TicketForm;