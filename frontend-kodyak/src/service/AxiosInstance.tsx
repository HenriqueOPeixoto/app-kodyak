import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'

const backendBaseURL = import.meta.env.VITE_BACKEND_BASE_URL

const useAxiosInstance = () => {
    const navigate = useNavigate()

    let isRefreshing = false;
    let refreshSubscribers: ((token: string) => void)[] = [];

    const subscribeTokenRefresh = (cb: (token: string) => void) => {
        refreshSubscribers.push(cb);
    };

    const onRefreshed = (token: string) => {
        refreshSubscribers.forEach((cb) => cb(token));
        refreshSubscribers = [];
    };

    const handleUnauthorizedOrForbidden = async (
        response: AxiosResponse,
        originalRequest: AxiosRequestConfig
    ) => {
        if (response.status === 401 || response.status === 403) {
            if (isRefreshing) {
                // Se já está atualizando o token, aguarda a atualização antes de refazer a requisição
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        originalRequest.headers = {
                            ...originalRequest.headers,
                            Authorization: `Bearer ${token}`,
                        };
                        resolve(axios(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                // Atualiza o token
                const refreshResponse = await axios.get(`${backendBaseURL}/api/auth/refresh_token`, {
                    withCredentials: true,
                });

                const newAccessToken = refreshResponse.data.accessToken;
                isRefreshing = false;
                onRefreshed(newAccessToken);

                // Atualiza o header e refaz a requisição original
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };
                return axios(originalRequest);
            } catch (error) {
                isRefreshing = false;
                // Como não sei o tipo de error, preciso verificar se é um AxiosError
                // antes de acessar a propriedade response.
                // Esse else provalvemente nunca será executado, mas se não colocar dá erro.
                if (axios.isAxiosError(error) && error.response) {
                    console.error("Erro ao renovar token:" + error.response.data.name);
                } else {
                    console.error("Erro ao renovar token:", error);
                }
                navigate("/login", {
                    state: {
                        message: "Sua sessão expirou. Por favor, faça login novamente.",
                    },
                });
                return Promise.reject(error);
            }
        }
    };

    const axiosInstance = axios.create({
        withCredentials: true
    })

    axiosInstance.interceptors.response.use(
        (response) => {
            // Se response for bem sucedido, prossegue
            return response
        },
        (error) => {
            // Se erro, navegar para a tela de login
            if (error.response) {
                // error.config contém o request original
                return handleUnauthorizedOrForbidden(error.response, error.config)

            }

            // Avisar função que fez o request
            return Promise.reject(error)
        })

    return axiosInstance
}


export default useAxiosInstance
