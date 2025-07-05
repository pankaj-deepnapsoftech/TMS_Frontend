import { axiosHandler } from "@/config/axiosConfig";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext2";

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
 console.log(notifications)
    const { token } = useAuthContext();

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axiosHandler.get('/notifications', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotifications(response?.data?.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchNotifications();
            // Optional: auto-refresh notifications
            // const intervalId = setInterval(fetchNotifications, 30000);
            // return () => clearInterval(intervalId);
        }
    }, [token]); // fetch again if token changes

    return (
        <NotificationsContext.Provider value={{ notifications, fetchNotifications, loading }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export default NotificationProvider;
