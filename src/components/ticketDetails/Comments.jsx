import React, { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import TicketDetailHeader from '@/components/TicketDetailHeader';
import TicketComments from '@/components/TicketComments';
import TicketDetailSidebar from '@/components/TicketDetailSidebar';
import { useAuthContext } from '@/context/AuthContext2';
import { useTicketCreate } from '@/context/TicketCreateContext';
import { departmentFilters } from '@/context/AuthContext2';

const Comments = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const { user, allUsers } = useAuthContext();
    const { allTicket, updatedTicket, updatedComments } = useTicketCreate();
    const { toast } = useToast();

    const isLoading = !allTicket || allTicket.length === 0;
    const ticket = useMemo(() => allTicket.find(t => t._id === ticketId), [allTicket, ticketId]);

    useEffect(() => {
        if (!ticket) return;
        if (user?.role === 'employee') {
            const assigned = Array.isArray(ticket.assignedTo)
                ? ticket.assignedTo.includes(user.id)
                : ticket.assignedTo === user.id;
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
                return "bg-red-100 text-red-700 border-red-200";
            case "Medium":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Low":
                return "bg-green-100 text-green-700 border-green-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Open":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "In Progress":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Under Review":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "Resolved":
                return "bg-green-100 text-green-700 border-green-200";
            case "Closed":
                return "bg-gray-100 text-gray-700 border-gray-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
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
            {isLoading ? (
                <div className="p-8 text-center w-full bg-gray-50 text-gray-900 rounded-md shadow-md">
                    <h1 className="text-2xl font-bold mb-4">
                        Loading Ticket...
                    </h1>
                    <p className="text-gray-700 mb-4">
                        Please wait while we load the ticket details.
                    </p>
                </div>
            ) : !ticket ? (
                <div className="p-8 text-center w-full bg-gray-50 text-gray-900 rounded-md shadow-md">
                    <h1 className="text-2xl font-bold mb-4">
                        Ticket Not Found
                    </h1>
                    <p className="text-gray-700 mb-4">
                        This ticket may have been deleted or you don't have access to it.
                    </p>
                    <Button
                        onClick={() => navigate(-1)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Go Back
                    </Button>
                </div>
            ) : (
                <div className="p-4 lg:p-8 max-w-6xl mx-auto bg-gray-50 text-gray-900 rounded-md shadow-md">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <TicketDetailHeader
                                ticket={ticket}
                                status={status}
                                user={user}
                                isAssignedToCurrentUser={isAssignedToCurrentUser}
                                getPriorityColor={getPriorityColor}
                                getStatusColor={getStatusColor}
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
                            status={status}
                            assignedIds={assignedIds}
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
            )}
        </>
    )
}

export default Comments;
