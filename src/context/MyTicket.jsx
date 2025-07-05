// import React, { createContext, useContext, useEffect, useState } from "react";
// import { axiosHandler } from "@/config/axiosConfig";
// import { useAuthContext } from "./AuthContext2";

// const MyTicketContext = createContext();

// export const useMyTicket = () => useContext(MyTicketContext);

// const MyTicketProvider = ({ children }) => {
//   const { user } = useAuthContext();
//   const [myTickets, setMyTickets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchMyTickets = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosHandler("/tickets/my", {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       });
//       if (response && response.data) {
//         setMyTickets(response.data);
//       } else {
//         setMyTickets([]);
//       }
//     } catch (error) {
//       setMyTickets([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const authToken = localStorage.getItem("authToken");
    
//     if (user && authToken) fetchMyTickets();
//   }, [user]);

//   return (
//     <MyTicketContext.Provider value={{ myTickets, loading, setMyTickets }}>
//       {children}
//     </MyTicketContext.Provider>
//   );
// };

// export default MyTicketProvider;
