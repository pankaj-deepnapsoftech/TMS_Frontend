import { createContext, useContext, useState, useEffect } from 'react';
import { axiosHandler } from '@/config/axiosConfig';
import { useAuthContext } from './AuthContext2';
import { socket } from '@/socket';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    // console.log("this is notifictaion",notifications)
    const [loading, setLoading] = useState(false);
    const { token } = useAuthContext();
 
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await axiosHandler.get('/notifications', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotifications(res?.data?.data || []);
            return res?.data?.data;
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await axiosHandler.put(`/notifications/${id}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    useEffect(() => {
        if (token) fetchNotifications();
    }, [token]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationsContext.Provider
            value={{ notifications, loading, fetchNotifications, handleMarkAsRead, unreadCount, setNotifications }}
        >
            {children}
        </NotificationsContext.Provider>
    );
};

export default NotificationProvider;
