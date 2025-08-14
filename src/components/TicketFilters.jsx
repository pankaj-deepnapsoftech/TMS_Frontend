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
      className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-purple-500/20 mb-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-purple-500/30">
              <SelectItem value="all">All Statuses</SelectItem>
              {ticketStatuses.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-purple-500/30">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>             
            </SelectContent>
          </Select>

          {user && user.role === "admin" && (
            <>
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  <SelectItem value="all">All Employees</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u._id} value={u._id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  {departments.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {/* {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={onClearFilters}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
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
