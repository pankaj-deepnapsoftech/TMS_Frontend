import { createContext, useContext, useEffect, useState } from "react";
import { axiosHandler } from "../config/axiosConfig";
import { toast } from "react-toastify";
import { useAuthContext } from "./AuthContext2";



const TicketCreateContext = createContext();

export const useTicketCreate = () => useContext(TicketCreateContext)

const TicketCreateProvider = ({ children }) => {

    const { token } = useAuthContext()
    const [allTicket, setAllTicket] = useState([])

    const TicketCreate = async (formData) => {
        try {
            const res = await axiosHandler.post('/tickets', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            GetAllTicket()
            toast.success(res?.data?.message)
            console.log(res?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const GetAllTicket = async () => {
        try {
            const res = await axiosHandler.get('/tickets',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setAllTicket(res?.data?.data)
            console.log(res?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const DeleteTicket = async (ticketId) => {
        console.log(ticketId)
        try {
            const res = await axiosHandler.delete(`/tickets/${ticketId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            console.log(res?.data)
            GetAllTicket()
            toast.success(res?.data?.message)
        } catch (error) {
            console.log(error)
        }
    }

   const UpdatedTicket = async(_id,formData) => {
    console.log(_id,formData)
    try {
        const res = await axiosHandler.put(`/tickets/${_id}`,formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        toast.success(res?.data?.message)
        GetAllTicket()
        console.log(res?.data)
    } catch (error) {
        console.log(error)
    }
   }

    useEffect(() => {
        if (token) {
            GetAllTicket()
        }
    }, [])

    return (
        <TicketCreateContext.Provider value={{ TicketCreate, allTicket, DeleteTicket, UpdatedTicket }}>  
            {children}
        </TicketCreateContext.Provider>
    )
}

export default TicketCreateProvider;