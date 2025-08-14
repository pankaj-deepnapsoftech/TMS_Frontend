import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
// import { useNotifications } from '@/context/NotificationContext';
import TicketDetailHeader from '@/components/TicketDetailHeader';
import TicketComments from '@/components/TicketComments';
import TicketDetailSidebar from '@/components/TicketDetailSidebar';
import { useAuthContext } from '@/context/AuthContext2';
import { useTicketCreate } from '@/context/TicketCreateContext';
import { departmentFilters } from '@/context/AuthContext2';


const TicketDetailPage = () => {
  const { ticketId } = useParams();


  const navigate = useNavigate();
  const { user, allUsers } = useAuthContext();
  const [topNavbar, setTopNavbar] = useState("Dashboard")
  const { allTicket, updatedTicket, updatedComments } = useTicketCreate(); // Assuming updateTicket is available
  const { toast } = useToast();
  const isLoading = !allTicket || allTicket.length === 0;
  const ticket = useMemo(() => allTicket.find(t => t._id === ticketId), [allTicket, ticketId]);

  useEffect(() => {
    if (!ticket) return;

    if (user?.role === 'employee') {
      const assigned = Array.isArray(ticket.assignedTo)
        ? ticket.assignedTo.includes(user.id)
        : ticket.assignedTo === user.id;

      // if (!assigned) {
      //   navigate('/employee');
      // }
    }
  }, [ticket, user, navigate]);

  const assignedIds = Array.isArray(ticket?.assignedTo)
    ? ticket?.assignedTo
    : [ticket?.assignedTo];

  const isAssignedToCurrentUser = useMemo(() => {
    const assignedIds = Array.isArray(ticket?.assignedTo)
      ? ticket?.assignedTo
      : [ticket?.assignedTo];
    return assignedIds.includes(user.id);
  }, [ticket, user]);

  const createdByUser = ticket ? allUsers.find(u => u._id === ticket.createdBy) : null;
  const department = ticket ? departmentFilters.find(d => d.value === ticket.department) : null;
  const status = user?.status?.find(s => s._id === ticket?.status);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Low":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-500/20 text-blue-300  border-blue-500/30";
      case "In Progress":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Under Review":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Resolved":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Closed":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleAddComment = (content) => {
    const newComment = {
      text: content,
      timestamp: new Date().toISOString(),
      author: {
        _id: user?.id,
        name: user?.name,
        email: user?.email,
      },
    };

    updatedComments(ticket._id, newComment);

    toast({
      title: 'Comment Added 💬',
      description: 'Your comment was posted.',
    });
  };


  const handleStatusChange = (newStatus) => {
    const UpdatedTicket = {
      ...ticket,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    updatedTicket(ticket._id, UpdatedTicket);

    const newStatusName = user?.status?.find(s => s._id === newStatus)?.name || newStatus;

    toast({
      title: 'Status Updated! 📋',
      description: `Ticket status changed to ${newStatusName} and notifications sent.`
    });
  };

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date() && !['resolved', 'closed'].includes(ticket.status);
  };

  return (
    <>
      <Helmet>
        <title>
          {ticket
            ? `${ticket.ticketNumber} - ${ticket.title} - ITSYBIZZ TMS`
            : "Ticket Not Found - ITSYBIZZ TMS"}
        </title>
        <meta
          name="description"
          content={
            ticket
              ? `Ticket details for ${ticket.ticketNumber}: ${ticket.title}`
              : "Ticket not found"
          }
        />
      </Helmet>

      {isLoading ? (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Loading Ticket...
          </h1>
          <p className="text-gray-400 mb-4">
            Please wait while we load the ticket details.
          </p>
        </div>
      ) : !ticket ? (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Ticket Not Found
          </h1>
          <p className="text-gray-400 mb-4">
            This ticket may have been deleted or you don't have access to it.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Go Back
          </Button>
        </div>
      ) : (
        // <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        //   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        //     <div className="lg:col-span-2 space-y-6">
        //       <TicketDetailHeader
        //         ticket={ticket}
        //         status={status}
        //         user={user}
        //         isAssignedToCurrentUser={isAssignedToCurrentUser}
        //         getPriorityColor={getPriorityColor}
        //         getStatusColor={getStatusColor}
        //       />

        //       <TicketComments
        //         ticket={ticket}
        //         user={user}
        //         onAddComment={handleAddComment}
        //         formatDate={formatDate}
        //         getInitials={getInitials}
        //       />
        //     </div>

        //     <TicketDetailSidebar
        //       ticket={ticket}
        //       user={user}
        //       status={status}
        //       assignedIds={assignedIds}
        //       department={department}
        //       createdByUser={createdByUser}
        //       isAssignedToCurrentUser={isAssignedToCurrentUser}
        //       onStatusChange={handleStatusChange}
        //       formatDate={formatDate}
        //       getInitials={getInitials}
        //       isOverdue={isOverdue}
        //     />
        //   </div>
        // </div>
        <div>
          <div className="bg-[#120338] text-white px-6">
            <nav className="flex space-x-8 border-b border-purple-500">
              <button
                onClick={() => setTopNavbar('Dashboard')}
                className={`py-3 text-sm font-medium hover:text-purple-400 ${topNavbar === "Dashboard" && " text-purple-400 border-b-2 border-purple-500"} hover:border-b-2 hover:border-purple-500 transition-all`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setTopNavbar('Tasks')}
                className={`py-3 text-sm font-medium hover:text-purple-400 ${topNavbar === "Tasks" && " text-purple-400 border-b-2 border-purple-500"} hover:border-b-2 hover:border-purple-500 transition-all`}
              >
                Tasks
              </button>
              <button
                onClick={() => setTopNavbar('Comments')}
                className={`py-3 text-sm font-medium hover:text-purple-400 ${topNavbar === "Comments" && " text-purple-400 border-b-2 border-purple-500"} hover:border-b-2 hover:border-purple-500 transition-all`}
              >
                Comments
              </button>

            </nav>
          </div>

          {/* here sohow components conditinally  */}

          hello
        </div>
      )}

      <Toaster />
    </>
  );
};

export default TicketDetailPage;
