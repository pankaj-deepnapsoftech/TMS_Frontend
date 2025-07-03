import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import TicketDetailHeader from '@/components/TicketDetailHeader';
import TicketComments from '@/components/TicketComments';
import TicketDetailSidebar from '@/components/TicketDetailSidebar';
import { users, departments, ticketStatuses, initialTickets } from '@/data';

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { createTicketCommentNotification, createTicketStatusNotification } = useNotifications();
  const [tickets, setTickets] = useLocalStorage('tickets', initialTickets);

  const ticket = useMemo(() => {
    return tickets.find(t => t.id === ticketId);
  }, [tickets, ticketId]);

  // Redirect if ticket doesn't exist or user is not assigned (for employees)
  useEffect(() => {
    if (!ticket) {
      return;
    }
    
    // If user is an employee and not assigned to this ticket, redirect to their dashboard
    if (user?.role === 'employee') {
      const isAssigned = ticket.assignedTo && (
        Array.isArray(ticket.assignedTo) 
          ? ticket.assignedTo.includes(user.id)
          : ticket.assignedTo === user.id
      );
      
      if (!isAssigned) {
        navigate('/employee');
        return;
      }
    }
  }, [ticket, user, navigate]);

  if (!ticket) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Ticket Not Found</h1>
        <p className="text-gray-400 mb-4">This ticket may have been deleted or you don't have access to it.</p>
        <Button onClick={() => navigate(-1)} className="bg-purple-500 hover:bg-purple-600">
          Go Back
        </Button>
      </div>
    );
  }

  // Helper function to safely get assigned users
  const getAssignedUsers = () => {
    if (!ticket.assignedTo) return [];
    
    const assignedUserIds = Array.isArray(ticket.assignedTo) ? ticket.assignedTo : [ticket.assignedTo];
    return users.filter(u => assignedUserIds.includes(u.id));
  };

  // Helper function to check if current user is assigned
  const isAssignedToCurrentUser = () => {
    if (!ticket.assignedTo || !user?.id) return false;
    
    const assignedUserIds = Array.isArray(ticket.assignedTo) ? ticket.assignedTo : [ticket.assignedTo];
    return assignedUserIds.includes(user.id);
  };

  const assignedUsers = getAssignedUsers();
  const createdByUser = users.find(u => u.id === ticket.createdBy);
  const department = departments.find(d => d.id === ticket.departmentId);
  const status = ticketStatuses.find(s => s.id === ticket.status);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const handleAddComment = (content) => {
    const comment = {
      id: Date.now().toString(),
      userId: user.id,
      content,
      createdAt: new Date().toISOString(),
    };

    setTickets(prev => prev.map(t => 
      t.id === ticketId 
        ? { ...t, comments: [...(t.comments || []), comment], updatedAt: new Date().toISOString() }
        : t
    ));

    // Send notifications to all assigned users except the commenter
    const assignedUserIds = Array.isArray(ticket.assignedTo) ? ticket.assignedTo : [ticket.assignedTo];
    assignedUserIds.forEach(userId => {
      if (userId !== user.id) {
        createTicketCommentNotification(ticket.id, ticket.ticketNumber, user.name, userId);
      }
    });

    toast({ title: "Comment Added! 💬", description: "Your comment has been posted and notifications sent." });
  };

  const handleStatusChange = (newStatus) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId 
        ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
        : t
    ));

    // Send notifications to all assigned users
    const assignedUserIds = Array.isArray(ticket.assignedTo) ? ticket.assignedTo : [ticket.assignedTo];
    assignedUserIds.forEach(userId => {
      createTicketStatusNotification(ticket.id, ticket.ticketNumber, newStatus, userId);
    });

    toast({ 
      title: "Status Updated! 📋", 
      description: `Ticket status changed to ${ticketStatuses.find(s => s.id === newStatus)?.name} and notifications sent.` 
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && ticket.status !== 'resolved' && ticket.status !== 'closed';
  };

  return (
    <>
      <Helmet>
        <title>{`${ticket.ticketNumber} - ${ticket.title} - ITSYBIZZ TMS`}</title>
        <meta name="description" content={`Ticket details for ${ticket.ticketNumber}: ${ticket.title}`} />
      </Helmet>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TicketDetailHeader 
              ticket={ticket}
              status={status}
              user={user}
              isAssignedToCurrentUser={isAssignedToCurrentUser}
              getPriorityColor={getPriorityColor}
            />

            <TicketComments 
              ticket={ticket}
              user={user}
              onAddComment={handleAddComment}
              formatDate={formatDate}
              getInitials={getInitials}
            />
          </div>

          <TicketDetailSidebar 
            ticket={ticket}
            user={user}
            assignedUsers={assignedUsers}
            department={department}
            createdByUser={createdByUser}
            isAssignedToCurrentUser={isAssignedToCurrentUser}
            onStatusChange={handleStatusChange}
            formatDate={formatDate}
            getInitials={getInitials}
            isOverdue={isOverdue}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default TicketDetailPage;