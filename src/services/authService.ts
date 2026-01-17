import axiosInstance from '../lib/axios';
import { STORAGE_KEYS, API_ENDPOINTS } from '../utils/constants';


export interface LoginCredentials {
    email: string;
    password?: string;
}

export interface SignupData {
    name: string;
    email: string;
    password?: string;
}

export interface AuthResponse {
    token: string;
    name: string;
    email?: string;
    id?: string;
}

/**
 * Service for handling authentication and user session.
 * @namespace AuthService
 */
export const authService = {
    /**
     * Authenticates a user.
     * @param {LoginCredentials} credentials - { email, password }
     * @returns {Promise<AuthResponse>} User data and token.
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials);
        if (response.data.token) {
            localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
            localStorage.setItem(STORAGE_KEYS.USER_NAME, response.data.name);
            if (response.data.email) localStorage.setItem(STORAGE_KEYS.USER_EMAIL, response.data.email);
        }
        return response.data;
    },

    /**
     * Authenticates with Google.
     * @param {string} credential - Google JWT token
     * @returns {Promise<AuthResponse>} User data and token.
     */
    loginWithGoogle: async (credential: string): Promise<AuthResponse> => {
        const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.GOOGLE_AUTH, { credential });
        if (response.data.token) {
            localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
            localStorage.setItem(STORAGE_KEYS.USER_NAME, response.data.name);
            if (response.data.email) localStorage.setItem(STORAGE_KEYS.USER_EMAIL, response.data.email);
        }
        return response.data;
    },

    /**
     * Registers a new user.
     * @param {SignupData} data - { name, email, password }
     * @returns {Promise<AuthResponse>} User data and token.
     */
    signup: async (data: SignupData): Promise<AuthResponse> => {
        const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.SIGNUP, data);
        if (response.data.token) {
            localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
            localStorage.setItem(STORAGE_KEYS.USER_NAME, response.data.name);
            if (response.data.email) localStorage.setItem(STORAGE_KEYS.USER_EMAIL, response.data.email);
        }
        return response.data;
    },

    /**
     * Logs out the current user.
     */
    logout: (): void => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_NAME);
        localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    },

    /**
     * Gets the current auth token.
     * @returns {string|null}
     */
    getToken: (): string | null => localStorage.getItem(STORAGE_KEYS.TOKEN),

    /**
     * Gets the current user's name.
     * @returns {string|null}
     */
    getUserName: (): string | null => localStorage.getItem(STORAGE_KEYS.USER_NAME),

    /**
     * Gets the current user's email.
     * @returns {string|null}
     */
    getUserEmail: (): string | null => localStorage.getItem(STORAGE_KEYS.USER_EMAIL),

    /**
     * Sets the auth token (for admin impersonation).
     * @param {string} token
     */
    setToken: (token: string): void => {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    },

    /**
     * Sets the user name (for admin impersonation).
     * @param {string} name
     */
    setUserName: (name: string): void => {
        localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
    },

    /**
     * Sets the user email (for admin impersonation).
     * @param {string} email
     */
    setUserEmail: (email: string): void => {
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
    },

    /**
     * Fetches the job board data from the backend.
     * @returns {Promise<any>}
     */
    getBoard: async (): Promise<any> => {
        const response = await axiosInstance.get(API_ENDPOINTS.AUTH + '/board');
        return response.data;
    },

    /**
     * Updates the job board data on the backend.
     * @param {any} boardData
     * @returns {Promise<void>}
     */
    updateBoard: async (boardData: any): Promise<void> => {
        await axiosInstance.post(API_ENDPOINTS.AUTH + '/board', { boardData });
    },

    /**
     * Sends a magic link to the user's email.
     * @param {string} email
     * @returns {Promise<void>}
     */
    sendMagicLink: async (email: string): Promise<void> => {
        console.log('Sending magic link to:', email);
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
};
