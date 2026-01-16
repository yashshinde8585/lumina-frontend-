import axiosInstance from '../lib/axios';

export interface GenerateResumeParams {
    jd: string;
    level: string;
    template: string;
}

export const resumeService = {
    generateResume: async (params: GenerateResumeParams) => {
        const response = await axiosInstance.post('/resumes/generate', params);
        return response.data;
    },

    saveResume: async (data: any) => {
        const response = await axiosInstance.post('/resumes', data);
        return response.data;
    },

    getAllResumes: async () => {
        const response = await axiosInstance.get('/resumes');
        return response.data;
    },

    uploadResumeFile: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post(`/resumes/${id}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    importResume: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        // Default title to filename
        formData.append('title', file.name.replace(/\.[^/.]+$/, ""));

        const response = await axiosInstance.post('/resumes/import', formData);
        return response.data;
    },

    downloadResume: async (id: string) => {
        const response = await axiosInstance.get(`/resumes/${id}/download`, {
            responseType: 'blob'
        });
        return response.data;
    },

    deleteResume: async (id: string | number) => {
        const response = await axiosInstance.delete(`/resumes/${id}`);
        return response.data;
    },
};
