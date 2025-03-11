import axios, { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'

const useAxiosInstance = () => {
    const navigate = useNavigate()
    
    const handleUnauthorizedOrForbidden = (response: AxiosResponse) => {
        if (response.status === 401 || response.status === 403) {
            navigate('/login', {
                state: {
                    message: 'Sua sessão expirou. Por favor, faça login novamente.'
                }
            })
        }
    }
    
    const axiosInstance = axios.create({
        withCredentials: true
    })
    
    axiosInstance.interceptors.response.use(
        (response) => {
            // Se response for bem sucedido, prossegue
            return response;
        },
        (error) => {
            // Se erro, navegar para a tela de login
            if (error.response) {
                handleUnauthorizedOrForbidden(error.response);
            }
    
            // Avisar função que fez o request
            return Promise.reject(error);
    })

    return axiosInstance
}


export default useAxiosInstance
