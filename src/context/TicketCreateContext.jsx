import { createContext, useContext, useEffect, useState } from "react";
import { axiosHandler } from "../config/axiosConfig";
import { toast } from "react-toastify";
import { useAuthContext } from "./AuthContext2";
import { socket } from "@/socket";
import { useNotifications } from "./NotificationContext";
import { useLocation } from "react-router-dom";
// import { useNotifications } from "./NotificationContext";

const TicketCreateContext = createContext();

export const useTicketCreate = () => useContext(TicketCreateContext);

const TicketCreateProvider = ({ children }) => {
  const { token, user } = useAuthContext();
  const { setNotifications, notifications } = useNotifications()
  const [allTicket, setAllTicket] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [statsError, setStatsError] = useState(null);
  const [comments, setComments] = useState([]);
  const location = useLocation()

  


  const fetchTicketStats = async () => {
    setStatsError(null);
    try {
      const res = await axiosHandler.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      GetAllTicket();
      setTicketStats(res.data);
    } catch (error) {
      setStatsError("Failed to fetch stats");
      console.log(error);
    }
  };
  const TicketCreate = async (formData) => {
    try {
      const res = await axiosHandler.post("/tickets", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      GetAllTicket();
      toast.success(res?.data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  const GetAllTicket = async () => {
    try {
      const res = await axiosHandler.get("/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllTicket(res?.data?.data); 
      // location.pathname.split("/")[2] 
      const filter = res?.data?.data.filter((item) => item._id === location.pathname.split("/")[2] || "")[0]
      setComments(filter?.comments || []) 
    } catch (error) {
      console.log(error);
    }
  };
  
  const DeleteTicket = async (ticketId) => {

    try {
      const res = await axiosHandler.delete(`/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res?.data)
      GetAllTicket();
      fetchTicketStats();
      toast.success(res?.data?.message);
    } catch (error) {
      console.log(error);
    }
  };
  const updatedTicket = async (id, payload) => {
    try {
      const res = await axiosHandler.put(`/tickets/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res?.data?.message);
      GetAllTicket();
    } catch (error) {
      console.log(error);
    }
  };

  const updatedComments = async (id, comment) => {
    try {
      const res = await axiosHandler.put(`/tickets/${id}/comment`, comment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res?.data?.message);
      GetAllTicket();
    } catch (error) {
      console.log("Error updating comment:", error);
    }finally{
     
    }
  };
  

  const GetMyTicket = async () => {
    try {
      const response = await axiosHandler("/tickets/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyTickets(response?.data?.data);
      //   console.log(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      GetAllTicket();
      fetchTicketStats();
      
    }
  }, []);
 
 useEffect(()=>{
   if(token)(
     GetMyTicket()
   )
}, [notifications])

  useEffect(() => {
    socket.on("ticket", (data) => {
      // console.log("this is testing data", data)
      if (data?.updatedTicket?.comments) {
        setComments(data?.updatedTicket?.comments);
      } else if (data?.updatedTicket?.comment) {
        setComments((prev) => [...prev, data?.updatedTicket.comment]);
      }

      const filter = data?.notificatiosn.filter((item) => user.id === item.user)[0]

      if(filter){
        setNotifications((prev) => [filter,...prev])
      }
    });

    return () => {
      socket.off("ticket");
    };
  }, []);


  useEffect(() => {
    socket.on("ticketCreateNotification", (data) => {
      if (data.user === user.id){
        setNotifications((prev) => [data, ...prev])
      }
    //  console.log(data) 
    });

    return () => {
      socket.off("ticketCreateNotification");
    };
  }, []);

  useEffect(() => {
    socket.on("UpdatedNoti", (data) => {
      const filter = data?.filter((item) => user.id === item.user)[0]

      if (filter) {
        setNotifications((prev) => [filter, ...prev])
      }
    });

    return () => {
      socket.off("UpdatedNoti");
    };
  }, []);

  
  return (
    <TicketCreateContext.Provider
      value={{
        TicketCreate,
        allTicket,
        DeleteTicket,
        GetMyTicket,
        myTickets,
        setMyTickets,
        updatedTicket,
        ticketStats,
        fetchTicketStats,
        statsError,
        updatedComments,
        comments
      }}
    >
      {children}
    </TicketCreateContext.Provider>
  );
};

export default TicketCreateProvider;
