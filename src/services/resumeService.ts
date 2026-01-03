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

};
