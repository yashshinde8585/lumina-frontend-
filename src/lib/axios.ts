import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const axiosInstance = axios.create({
    baseURL: `http://${window.location.hostname}:5002/api`,
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
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
