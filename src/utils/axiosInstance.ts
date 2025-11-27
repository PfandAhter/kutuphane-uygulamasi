import axios from 'axios';
import {refresh} from "next/cache";
import { router} from "next/client";

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        if(typeof window !== 'undefined'){
            const token = localStorage.getItem("token");
            if(token){
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if(error.response && error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
                const refreshToken = localStorage.getItem("refreshToken");

                if(!refreshToken){
                    throw new Error("Refresh token is missing");
                }

                const response = await axios.post(`${API_BASE_URL}/api/Auth/refresh-token`, {
                    refreshToken: refreshToken
                });

                const {token: newAccessToken, refreshToken: newRefreshToken} = response.data;

                localStorage.setItem('token', newAccessToken);

                if(refreshToken){
                    localStorage.setItem('refreshToken',newRefreshToken);
                }

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest);
            }catch(refreshError){
                console.error("Session Expired: ", refreshError);

                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userProfile');

                if (typeof window !== 'undefined') {
                    // window.location.href = '/login';
                    router.push('/login');
                    refresh();
                }

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)