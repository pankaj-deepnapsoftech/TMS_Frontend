import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useAuthContext } from "../context/AuthContext2";
import { useTicketCreate } from "../context/TicketCreateContext";
import TicketForm from "@/components/TicketForm";
import TicketCard from "@/components/TicketCard";
import TicketFilters from "@/components/TicketFilters";
import TicketStats from "@/components/TicketStats";
import { Plus, Ticket } from "lucide-react";
import { departmentFilters } from "../context/AuthContext2";

const AdminDashboard = () => {
  const { allUsers } = useAuthContext();
  const { allTicket, DeleteTicket } = useTicketCreate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const normalizeTicket = (ticket) => ({
    ...ticket,
    id: ticket._id,
    status: ticket.status?.toLowerCase(),
    priority: ticket.priority?.toLowerCase(),
    category: ticket.category?.toLowerCase(),
    departmentId:
      departmentFilters.find((d) => d.label === ticket.department)?.value ??
      "unknown",
  });

  const ticketMatchesAssigneeFilter = (ticket, assigneeFilter) => {
    if (assigneeFilter === "all") return true;
    return (
      Array.isArray(ticket.assignedTo) &&
      ticket.assignedTo.some((user) => user._id === assigneeFilter)
    );
  };

  const filteredTickets = useMemo(() => {
    return allTicket.map(normalizeTicket).filter((ticket) => {
      const matchesSearch =
        ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const now = new Date();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "overdue"
          ? ticket.status !== "resolved" &&
            ticket.dueDate &&
            new Date(ticket.dueDate) < now
          : ticket.status === statusFilter);

      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === "all" || ticket.category === categoryFilter;
      const matchesAssignee = ticketMatchesAssigneeFilter(
        ticket,
        assigneeFilter
      );
      const matchesDepartment =
        departmentFilter === "all" || ticket.departmentId === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory &&
        matchesAssignee &&
        matchesDepartment
      );
    });
  }, [
    allTicket,
    searchTerm,
    statusFilter,
    priorityFilter,
    categoryFilter,
    assigneeFilter,
    departmentFilter,
  ]);

  const handleDeleteTicket = (ticketId) => {
    if (window.confirm("Are you sure you want to delete ticket?")) {
      DeleteTicket(ticketId);
    }
  };

  const handleEditClick = (ticket) => {
    setEditingTicket(ticket);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTicket(null);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setAssigneeFilter("all");
    setDepartmentFilter("all");
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - ITSYBIZZ TMS</title>
        <meta
          name="description"
          content="Manage all team tickets from the admin dashboard."
        />
      </Helmet>
      <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ticket Management Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Oversee and manage all tickets across the team.
          </p>
        </motion.div>

        <TicketStats
          onStatClick={(filter) => {
            setStatusFilter(filter);
          }}
        />

        <TicketFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          assigneeFilter={assigneeFilter}
          setAssigneeFilter={setAssigneeFilter}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          onClearFilters={handleClearFilters}
          users={allUsers.filter((u) => u.role === "employee")}
          departments={departmentFilters}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-8"
        >
          <Button
            onClick={() => setIsFormOpen(true)}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create & Assign Ticket
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <TicketCard
                  key={`admin-ticket-${ticket._id || ticket.id}`}
                  ticket={ticket}
                  onEdit={handleEditClick}
                  onDelete={() => handleDeleteTicket(ticket._id || ticket.id)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-16"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-200/50 to-gray-200/50 flex items-center justify-center">
                    <Ticket className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    No tickets match your filters
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <TicketForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          ticket={editingTicket}
          users={allUsers.filter((u) => u.role === "employee")}
          departments={departmentFilters}
        />
      </div>
      <Toaster />
    </>
  );
};

export default AdminDashboard;
