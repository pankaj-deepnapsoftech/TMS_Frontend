import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNotifications } from '@/context/NotificationContext';
import TicketForm from '@/components/TicketForm';
import TicketCard from '@/components/TicketCard';
import TicketStats from '@/components/TicketStats';
import TicketFilters from '@/components/TicketFilters';
import { Plus, Ticket } from 'lucide-react';
import { users, departments, initialTickets } from '@/data';

const AdminDashboard = () => {
  const { toast } = useToast();
  const { createTicketAssignedNotification, createTicketStatusNotification, cleanupNotificationsForDeletedTickets } = useNotifications();
  const [tickets, setTickets] = useLocalStorage('tickets', initialTickets);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Clean up notifications when tickets are deleted
  useEffect(() => {
    const existingTicketIds = tickets.map(t => t.id);
    cleanupNotificationsForDeletedTickets(existingTicketIds);
  }, [tickets, cleanupNotificationsForDeletedTickets]);

  // Helper function to normalize assignment data
  const normalizeAssignedTo = (assignedTo) => {
    if (!assignedTo) return [];
    const assignedArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    return assignedArray.filter(id => users.some(user => user.id === id));
  };

  // Helper function to check if a ticket matches assignee filter
  const ticketMatchesAssigneeFilter = (ticket, assigneeFilter) => {
    if (assigneeFilter === 'all') return true;
    const assignedUserIds = normalizeAssignedTo(ticket.assignedTo);
    return assignedUserIds.includes(assigneeFilter);
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (ticket.description && ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
      const matchesAssignee = ticketMatchesAssigneeFilter(ticket, assigneeFilter);
      const matchesDepartment = departmentFilter === 'all' || ticket.departmentId === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignee && matchesDepartment;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter, assigneeFilter, departmentFilter]);

  const handleCreateTicket = (ticketData) => {
    const validAssignedUserIds = normalizeAssignedTo(ticketData.assignedTo);

    const normalizedTicketData = {
      ...ticketData,
      assignedTo: validAssignedUserIds,
      id: Date.now().toString(),
      ticketNumber: `TKT-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'u1',
      comments: [],
    };

    // Update tickets state with immediate synchronization
    setTickets(prev => {
      const newTickets = [normalizedTicketData, ...prev];
      // Force localStorage update
      localStorage.setItem('tickets', JSON.stringify(newTickets));
      return newTickets;
    });
    
    // Send notifications to all assigned employees
    validAssignedUserIds.forEach(userId => {
      createTicketAssignedNotification(normalizedTicketData.id, normalizedTicketData.ticketNumber, normalizedTicketData.title, userId);
    });
    
    toast({ 
      title: "Ticket Created! 🎫", 
      description: `New ticket assigned to ${validAssignedUserIds.length} employee${validAssignedUserIds.length > 1 ? 's' : ''} and notifications sent.` 
    });
  };

  const handleEditTicket = (ticketData) => {
    const validAssignedUserIds = normalizeAssignedTo(ticketData.assignedTo);
    const oldTicket = tickets.find(t => t.id === ticketData.id);

    const normalizedTicketData = {
      ...ticketData,
      assignedTo: validAssignedUserIds,
      updatedAt: new Date().toISOString(),
    };

    // Update tickets state with immediate synchronization
    setTickets(prev => {
      const newTickets = prev.map(t => t.id === ticketData.id ? normalizedTicketData : t);
      // Force localStorage update
      localStorage.setItem('tickets', JSON.stringify(newTickets));
      return newTickets;
    });
    
    // Handle reassignment notifications
    if (oldTicket) {
      const oldAssignees = normalizeAssignedTo(oldTicket.assignedTo);
      const newAssignees = validAssignedUserIds;
      
      // Find newly assigned users
      const newlyAssigned = newAssignees.filter(userId => !oldAssignees.includes(userId));
      
      // Send assignment notifications to newly assigned users
      newlyAssigned.forEach(userId => {
        createTicketAssignedNotification(normalizedTicketData.id, normalizedTicketData.ticketNumber, normalizedTicketData.title, userId);
      });
      
      // Send status change notifications to all current assignees if status changed
      if (oldTicket.status !== normalizedTicketData.status) {
        newAssignees.forEach(userId => {
          createTicketStatusNotification(normalizedTicketData.id, normalizedTicketData.ticketNumber, normalizedTicketData.status, userId);
        });
      }
    }
    
    setEditingTicket(null);
    toast({ 
      title: "Ticket Updated! ✨", 
      description: "Ticket details have been updated and notifications sent to assignees." 
    });
  };

  const handleDeleteTicket = (ticketId) => {
    // Remove ticket from state with immediate synchronization
    setTickets(prev => {
      const newTickets = prev.filter(t => t.id !== ticketId);
      // Force localStorage update
      localStorage.setItem('tickets', JSON.stringify(newTickets));
      return newTickets;
    });
    
    toast({ 
      title: "Ticket Deleted! 🗑️", 
      description: "Ticket has been removed from all dashboards." 
    });
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
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setAssigneeFilter('all');
    setDepartmentFilter('all');
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - ITSYBIZZ TMS</title>
        <meta name="description" content="Manage all team tickets from the admin dashboard." />
      </Helmet>
      <div className="p-4 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Ticket Management Dashboard</h1>
          <p className="text-gray-400 mb-8">Oversee and manage all tickets across the team.</p>
        </motion.div>
        
        <TicketStats tickets={tickets} />
        <TicketFilters
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
          categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
          assigneeFilter={assigneeFilter} setAssigneeFilter={setAssigneeFilter}
          departmentFilter={departmentFilter} setDepartmentFilter={setDepartmentFilter}
          onClearFilters={handleClearFilters}
          users={users.filter(u => u.role === 'employee')}
          departments={departments}
        />

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center mb-8">
          <Button onClick={() => setIsFormOpen(true)} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Plus className="w-5 h-5 mr-2" />
            Create & Assign Ticket
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <TicketCard 
                  key={`admin-ticket-${ticket.id}-${ticket.updatedAt}`} 
                  ticket={ticket} 
                  onEdit={handleEditClick} 
                  onDelete={handleDeleteTicket} 
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
                  <h3 className="text-2xl font-semibold text-gray-300 mb-2">No tickets match your filters</h3>
                  <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <TicketForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={editingTicket ? handleEditTicket : handleCreateTicket}
          ticket={editingTicket}
          users={users.filter(u => u.role === 'employee')}
          departments={departments}
        />
      </div>
      <Toaster />
    </>
  );
};

export default AdminDashboard;