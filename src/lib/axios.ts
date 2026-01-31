import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // Enhanced error logging (Dev only to prevent leaking info in Prod)
        if (import.meta.env.DEV) {
            if (error.response) {
                // Server responded with error status
                console.error('API Error Response:', {
                    status: error.response.status,
                    data: error.response.data,
                    url: error.config?.url
                });
            } else if (error.request) {
                // Request made but no response received
                console.error('API No Response:', {
                    message: 'Server did not respond',
                    url: error.config?.url,
                    baseURL: error.config?.baseURL
                });
            } else {
                // Error in request setup
                console.error('API Request Setup Error:', error.message);
            }
        } else {
            // Production Logging (Minimal)
            if (error.response && error.response.status >= 500) {
                console.warn(`Server Error (${error.response.status}) at ${error.config?.url}`);
            } else if (error.request) {
                console.warn(`Network Error at ${error.config?.url}`);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
