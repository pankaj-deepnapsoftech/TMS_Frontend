import { axiosHandler } from "@/config/axiosConfig";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";


const TodoContext = createContext({
    getAllAssignedUser: () => { },
    assinedUser: [],
    CreateTask: () => { },
    totalTasks: [],
    GetTask: () => { },
    DeleteTask:() => {},
});

export const useTodoContext = () => useContext(TodoContext);


const TodoContextProvider = ({ children }) => {
    const [assinedUser, setAssinedUser] = useState([]);
    const [totalTasks, setTotalTasks] = useState([]);

    const getAllAssignedUser = async (ticketId) => {
        try {
            const res = await axiosHandler.get(`/tickets/get-assined_user/${ticketId}`);
            setAssinedUser(res.data?.data[0]?.assignedTo || []);
        } catch (error) {
            console.log(error);
        }
    }

    const GetTask = async (ticketId) => {
        try {
            const res = await axiosHandler.get(`/todos/get/${ticketId}`);
            setTotalTasks(res.data?.data || []);
        } catch (error) {
            console.log(error);
        }
    }

    const CreateTask = async (data) => {
        try {
            const res = await axiosHandler.post("/todos/create", data);
            toast.success(res.data.message || "Task Completed Successful");
            GetTask(data.ticket_id);
        } catch (error) {
            console.log(error)
        }
    }

    const DeleteTask = async (todoId) => {
        try {
            const res = await axiosHandler.delete(`/todos/delete/${todoId}`);
            toast.success(res.data.message || "task delete successfully ")

            setTotalTasks((prev) => prev.filter(task => task._id !== todoId));
        } catch (error) {
            console.log(error);
        }
    };




    return (
        <TodoContext.Provider value={{ getAllAssignedUser, assinedUser, CreateTask, GetTask, totalTasks, DeleteTask }}>
            {children}
        </TodoContext.Provider>
    )
}

export default TodoContextProvider
