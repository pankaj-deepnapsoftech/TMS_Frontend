import axios from "axios";


export const axiosHandler = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
    }
})
