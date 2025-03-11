import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../../service/AxiosInstance";
import { useEffect } from "react";

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

export default function Logout() {
    const axios = useAxiosInstance()
    const navigate = useNavigate()

    useEffect(() => {
        axios.delete(`${backendBaseURL}/api/auth/refresh_token`, {
            withCredentials: true
        })
            .then(() => {
                navigate('/login')
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])


    return(
        <>
            <p>Saindo...</p>
        </>
    )
    
}