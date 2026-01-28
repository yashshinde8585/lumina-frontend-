export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    links?: string[];
}

export interface Experience {
    title: string;
    company: string;
    duration: string;
    description: string;
}

export interface Education {
    school: string;
    degree: string;
    year: string;
}

export interface Project {
    name: string;
    tech: string;
    description: string;
}

export interface Certification {
    name: string;
    issuer: string;
    year: string;
}

export interface ResumeData {
    personalInfo: PersonalInfo;
    summary: string;
    experience: Experience[];
    skills: string[];
    projects: Project[];
    education: Education[];
    certifications: Certification[];
}

export interface Resume {
    id: number;
    title: string;
    content: ResumeData;
    updatedAt: string;
}

export interface User {
    id: string | number;
    name: string;
    email: string;
    avatar?: string;
    plan?: 'Free' | 'Pro';
    resumes?: number;
    spent?: number;
    lastActive?: string;
    status?: 'Active' | 'Banned';
}

export interface Template {
    id: string;
    name: string;
    thumbnail: string;
    active: boolean;
    isPro: boolean;
}

export interface ContentBlock {
    id: string;
    section: string;
    key: string;
    value: string;
    lastUpdated: string;
}

export interface JobCard {
    id: string;
    company: string;
    role: string;
    date: Date;
    salary?: string;
    location?: string;
    type?: string;
    source?: string;
    jobUrl?: string;
    linkedResumeId?: string | number;
    externalResume?: {
        name: string;
        data: string; // Base64 Data URI
    };
    notes?: string;
    description?: string;
    reflection?: string;
    rejectionRound?: string;
    rejectionReason?: string;
    history?: {
        status: string;
        date: string;
        type?: 'status_change' | 'note_added' | 'manual';
    }[];
    recruiter?: {
        name?: string;
        email?: string;
        linkedin?: string;
        phone?: string;
    };
    tasks?: {
        id: string;
        text: string;
        completed: boolean;
    }[];
    upcomingRounds?: {
        id: string;
        type: 'aptitude' | 'technical' | 'interview' | 'screening' | 'other';
        scheduledDate: string; // ISO date string
        notes?: string;
    }[];
}

export interface BoardColumn {
    id: string;
    title: string;
    color: string;
    items: JobCard[];
}
