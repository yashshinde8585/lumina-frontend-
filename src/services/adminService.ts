import axiosInstance from '../lib/axios';

const adminService = {
    // Get dashboard stats
    async getDashboardStats() {
        try {
            const response = await axiosInstance.get('/admin/stats');
            return response.data;
        } catch (error) {
            console.error('Get stats error:', error);
            throw error;
        }
    },

    // Get all users
    async getAllUsers() {
        try {
            const response = await axiosInstance.get('/admin/users');
            return response.data;
        } catch (error) {
            console.error('Get users error:', error);
            throw error;
        }
    },

    // Delete user
    async deleteUser(userId: string | number) {
        try {
            const response = await axiosInstance.delete(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Delete user error:', error);
            throw error;
        }
    },

    // Update user status
    async updateUserStatus(userId: string | number, status: string) {
        try {
            const response = await axiosInstance.patch(`/admin/users/${userId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Update status error:', error);
            throw error;
        }
    },

    // Reset user password
    async resetUserPassword(userId: string | number) {
        try {
            const response = await axiosInstance.post(`/admin/users/${userId}/reset-password`);
            return response.data;
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    },



    // Impersonate user
    async impersonateUser(userId: string | number) {
        try {
            const response = await axiosInstance.post(`/admin/users/${userId}/impersonate`);
            return response.data;
        } catch (error) {
            console.error('Impersonate user error:', error);
            throw error;
        }
    },




};

export default adminService;
