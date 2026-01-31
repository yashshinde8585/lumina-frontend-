import React, { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';

import { ResumeData } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

interface ResumeState {
    resumeData: ResumeData;
    isLoading: boolean;
}

interface ResumeDispatch {
    setResumeData: Dispatch<SetStateAction<ResumeData>>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    updateSection: (section: keyof ResumeData, newData: any) => void;
}

const ResumeStateContext = createContext<ResumeState | undefined>(undefined);
const ResumeDispatchContext = createContext<ResumeDispatch | undefined>(undefined);

export const useResumeState = () => {
    const context = useContext(ResumeStateContext);
    if (!context) {
        throw new Error('useResumeState must be used within a ResumeProvider');
    }
    return context;
};

export const useResumeDispatch = () => {
    const context = useContext(ResumeDispatchContext);
    if (!context) {
        throw new Error('useResumeDispatch must be used within a ResumeProvider');
    }
    return context;
};

export const useResume = (): ResumeState & ResumeDispatch => {
    const state = useResumeState();
    const dispatch = useResumeDispatch();
    return { ...state, ...dispatch };
};


const DEFAULT_RESUME: ResumeData = {
    personalInfo: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        linkedin: '',
        links: []
    },
    summary: 'Highly motivated professional with experience in software development...',
    experience: [],
    skills: ['React', 'JavaScript', 'Node.js'],
    projects: [],
    education: [],
    certifications: []
};

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [resumeData, setResumeData] = useState<ResumeData>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.RESUME_DATA);
            if (!saved || saved === "undefined") return DEFAULT_RESUME;
            return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse resume data", e);
            return DEFAULT_RESUME;
        }
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Persist to local storage
    React.useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.RESUME_DATA, JSON.stringify(resumeData));
    }, [resumeData]);

    // Actions
    const updateSection = React.useCallback((section: keyof ResumeData, newData: any) => {
        setResumeData(prev => ({
            ...prev,
            [section]: newData
        }));
    }, []);

    // Memoize the state value to prevent consumers from re-rendering unless resumeData/isLoading changes
    const stateValue = React.useMemo(() => ({ resumeData, isLoading }), [resumeData, isLoading]);

    // Memoize dispatch value. This is stable and won't cause re-renders.
    const dispatchValue = React.useMemo(() => ({ setResumeData, setIsLoading, updateSection }), [updateSection]);

    return (
        <ResumeStateContext.Provider value={stateValue}>
            <ResumeDispatchContext.Provider value={dispatchValue}>
                {children}
            </ResumeDispatchContext.Provider>
        </ResumeStateContext.Provider>
    );
};
