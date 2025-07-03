import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/context/AuthContext';
import { initialNotifications } from '@/data';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useLocalStorage('notifications', initialNotifications);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = (userId) => {
    setNotifications(prev => 
      prev.map(n => n.userId === userId ? { ...n, read: true } : n)
    );
  };

  const getUserNotifications = (userId) => {
    return notifications.filter(n => n.userId === userId);
  };

  const getUnreadCount = (userId) => {
    return notifications.filter(n => n.userId === userId && !n.read).length;
  };

  const createTicketAssignedNotification = (ticketId, ticketNumber, ticketTitle, assignedUserId) => {
    addNotification({
      userId: assignedUserId,
      type: 'ticket_assigned',
      title: 'New Ticket Assigned',
      message: `You have been assigned ticket ${ticketNumber}: ${ticketTitle}`,
      ticketId,
    });
  };

  const createTicketCommentNotification = (ticketId, ticketNumber, commenterName, assignedUserId) => {
    if (assignedUserId) {
      addNotification({
        userId: assignedUserId,
        type: 'ticket_comment',
        title: 'New Comment',
        message: `${commenterName} commented on ticket ${ticketNumber}`,
        ticketId,
      });
    }
  };

  const createTicketStatusNotification = (ticketId, ticketNumber, newStatus, assignedUserId) => {
    if (assignedUserId) {
      addNotification({
        userId: assignedUserId,
        type: 'ticket_status',
        title: 'Ticket Status Updated',
        message: `Ticket ${ticketNumber} status changed to ${newStatus}`,
        ticketId,
      });
    }
  };

  // Clean up notifications for deleted tickets
  const cleanupNotificationsForDeletedTickets = (existingTicketIds) => {
    setNotifications(prev => 
      prev.filter(notification => 
        !notification.ticketId || existingTicketIds.includes(notification.ticketId)
      )
    );
  };

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    getUserNotifications,
    getUnreadCount,
    createTicketAssignedNotification,
    createTicketCommentNotification,
    createTicketStatusNotification,
    cleanupNotificationsForDeletedTickets,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}