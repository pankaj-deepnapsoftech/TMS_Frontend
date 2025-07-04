import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
// import { useLocalStorage } from '@/hooks/useLocalStorage';
// import { useAuth } from '@/context/AuthContext';
import TicketCard from "@/components/TicketCard";
import TicketStats from "@/components/TicketStats";
import TicketFilters from "@/components/TicketFilters";
import { Ticket } from "lucide-react";
import { initialTickets } from "@/data";
import { useAuthContext } from "../context/AuthContext2";
import { useTicketCreate } from "../context/TicketCreateContext";
import Header from "../components/Header";

const EmployeeDashboard = () => {
  const { user } = useAuthContext();
  const { myTickets } = useTicketCreate();
  // If you want to show a loading state, you can add it to TicketCreateContext and use it here
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  // Optionally, you can add loading state from context if needed
  const loading = false;

  // Ensure myTickets is always an array
  const ticketsArray = Array.isArray(myTickets)
    ? myTickets
    : myTickets && myTickets.data && Array.isArray(myTickets.data)
    ? myTickets.data
    : [];

  // Apply search and filter criteria
  const filteredTickets = useMemo(() => {
    return ticketsArray.filter((ticket) => {
      const matchesSearch =
        ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.description &&
          ticket.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (ticket.ticketNumber &&
          ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === "all" || ticket.category === categoryFilter;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesCategory
      );
    });
  }, [ticketsArray, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
  };

  return (
    <>
      {/* <Header /> */}
      <Helmet>
        <title>My Tickets - ITSYBIZZ TMS</title>
        <meta
          name="description"
          content="View and manage your assigned tickets."
        />
      </Helmet>
      <div className="p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Tickets</h1>
          <p className="text-gray-400 mb-8">
            Welcome {user?.name}! Here are all the tickets assigned specifically
            to you. Let's get them resolved!
          </p>
        </motion.div>
        <TicketStats tickets={ticketsArray} />
        <TicketFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          onClearFilters={handleClearFilters}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="col-span-full text-center py-16 text-gray-400">
                Loading tickets...
              </div>
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <TicketCard
                  key={`ticket-${ticket._id || ticket.id}-${ticket.updatedAt}`}
                  ticket={ticket}
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
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Ticket className="w-12 h-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-300 mb-2">
                    {myTickets.length === 0
                      ? "No tickets assigned yet!"
                      : "All clear!"}
                  </h3>
                  <p className="text-gray-400">
                    {myTickets.length === 0
                      ? "You have no tickets assigned to you at the moment. Check back later!"
                      : "You have no tickets matching the current filters. Great job!"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default EmployeeDashboard;
