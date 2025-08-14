import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useAuthContext } from "../context/AuthContext2";
import { ticketStatuses } from "@/data";

const TicketFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  assigneeFilter,
  setAssigneeFilter,
  departmentFilter,
  setDepartmentFilter,
  onClearFilters,
  users = [],
  departments = [],
}) => {
  const { user } = useAuthContext();
  const hasActiveFilters =
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    categoryFilter !== "all" ||
    searchTerm ||
    (user &&
      user.role === "admin" &&
      (assigneeFilter !== "all" || departmentFilter !== "all"));

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-4 md:p-6 border border-gray-300 mb-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-400"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-900">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300">
              <SelectItem value="all" className="text-black">All Statuses</SelectItem>
              {ticketStatuses.map((status) => (
                <SelectItem key={status.id} value={status.id} className="text-black">
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-900">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300">
              <SelectItem value="all" className="text-black">All Priorities</SelectItem>
              <SelectItem value="high" className="text-black">High</SelectItem>
              <SelectItem value="medium" className="text-black">Medium</SelectItem>
              <SelectItem value="low" className="text-black">Low</SelectItem>
            </SelectContent>
          </Select>

          {user && user.role === "admin" && (
            <>
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="all" className="text-black">All Employees</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u._id} value={u._id} className="text-black">
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-900">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {departments.map((d) => (
                    <SelectItem key={d.value} value={d.value} className="text-black">
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {/* Uncomment if you want clear filters button */}
          {/* {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={onClearFilters}
              className="border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )} */}
        </div>
      </div>
    </motion.div>
  );
};

export default TicketFilters;
