import { axiosHandler } from "@/config/axiosConfig";
import {createContext, useContext, useState} from "react";


const TodoContext = createContext({
    getAllAssignedUser:()=>{},
    assinedUser:[]
});

export const useTodoContext = () => useContext(TodoContext);


const TodoContextProvider = ({children}) => {
    const [assinedUser,setAssinedUser] = useState([]);

    const getAllAssignedUser = async (ticketId) => {
        try {
            const res = await axiosHandler.get(`/tickets/get-assined_user/${ticketId}`);
            setAssinedUser(res.data?.data[0]?.assignedTo || []);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <TodoContext.Provider value={{ getAllAssignedUser, assinedUser }}>
            {children}
        </TodoContext.Provider>
    )
}

export default TodoContextProvider
