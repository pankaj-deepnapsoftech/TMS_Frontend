import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Plus, X, Ticket, Search } from "lucide-react";
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
      onClose();
      formik.resetForm();
      setSelectedUsers([]);
    },
  });

  const handleCancel = () => {
    if (!ticket) {
      formik.resetForm();
      setSelectedUsers([]);
    }
    onClose();
  };

  const filteredUsers = (
    formik.values.department === "all"
      ? users
      : users.filter((user) => user.department === formik.values.department)
  ).filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-gray-800" />
            {ticket ? "Edit Ticket" : "Create New Ticket"}
          </DialogTitle>
        </DialogHeader>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </Button>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Ticket Title
            </label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter ticket title..."
              className="bg-gray-100 border-gray-300 text-gray-900"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-red-500">{formik.errors.title}</p>
            )}
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Description
            </label>
            <Textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Describe the ticket..."
              className="bg-gray-100 border-gray-300 text-gray-900"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-red-500">
                {formik.errors.description}
              </p>
            )}
          </motion.div>

          {/* Department */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="text-sm font-medium text-gray-500 mb-2 block">
              Department
            </label>
            <Select
              value={formik.values.department}
              onBlur={formik.handleBlur}
              onValueChange={(value) =>
                formik.setFieldValue("department", value)
              }
            >
              <SelectTrigger className="bg-gray-100 text-gray-700">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent className="bg-white h-64 p-0 overflow-y-auto">
                {departmentFilters.map((dep) => (
                  <SelectItem
                    key={dep.id}
                    value={dep.value}
                    className="text-black"
                  >
                    {dep.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formik.touched.department && formik.errors.department && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.department}
              </p>
            )}
          </motion.div>

          {/* Team Assignment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Team Assignment ({selectedUsers.length})
            </label>

            {selectedUsers.length > 0 && (
              <Card className="mb-4 bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedUsers.map((user) => (
                      <motion.div
                        key={user._id}
                        className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg border border-gray-200"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 text-sm truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.department || "No Department"}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAssignee(user._id)}
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search */}
            <div className="relative mb-4">
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 border-gray-300 text-gray-900 pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>

            {/* User List */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="text-sm text-gray-700 mb-4">
                  Select Team Members
                </div>
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleAssigneeToggle(user._id)}
                        className="flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-gray-800 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">
                            {user.department || "No Department"}
                          </p>
                        </div>
                        <Plus className="w-4 h-4 text-gray-500" />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No users found.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedUsers.length === 0 && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <X className="w-3 h-3" />
                Please assign at least one team member
              </p>
            )}
          </motion.div>

          {/* Priority / Status / Due Date */}
          <div className="grid grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Priority
              </label>
              <Select
                value={formik.values.priority}
                onValueChange={(value) =>
                  formik.setFieldValue("priority", value)
                }
              >
                <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Low" className="text-green-500">
                    Low
                  </SelectItem>
                  <SelectItem value="Medium" className="text-yellow-500">
                    Medium
                  </SelectItem>
                  <SelectItem value="High" className="text-red-500">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <Select
                value={formik.values.status}
                onValueChange={(value) => formik.setFieldValue("status", value)}
              >
                <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {[
                    "Open",
                    "In Progress",
                    "Under Review",
                    "Resolved",
                    "Closed",
                  ].map((s) => (
                    <SelectItem className="text-black" key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Due Date
              </label>
              <Input
                type="date"
                name="dueDate"
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                className="bg-gray-100 border-gray-300 text-gray-900"
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
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
