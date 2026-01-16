export const EXPERIENCE_LEVELS = [
    { id: 'Student', label: 'Student', years: 'Intern' },
    { id: 'Entry-Level', label: 'Entry', years: '0-2y' },
    { id: 'Mid-Level', label: 'Mid', years: '3-5y' },
    { id: 'Senior', label: 'Senior', years: '5y+' }
];

export const STATUS_PRIORITY = {
    'offer': 5,
    'interview': 4,
    'screening': 3,
    'applied': 2,
    'saved': 1,
    'rejected': 0
} as const; // distinct from number

export const TRACKING_COLUMNS = ['applied', 'aptitude', 'technical', 'interview', 'offer'];

export const INITIAL_COLUMNS = [
    { id: 'saved', title: 'Wishlist / Saved', color: 'gray' },
    { id: 'applied', title: 'Applied Jobs', color: 'blue' },
    { id: 'screening', title: 'Resume Review', color: 'orange' },
    { id: 'aptitude', title: 'Aptitude Test', color: 'cyan' },
    { id: 'technical', title: 'Technical Round', color: 'indigo' },
    { id: 'interview', title: 'Interview Stage', color: 'purple' },
    { id: 'offer', title: 'Job Offers', color: 'green' },
    { id: 'rejected', title: 'Rejected', color: 'red' },
    { id: 'ghosted', title: 'Ghosted', color: 'gray' }
];

export const COLUMN_ORDER = INITIAL_COLUMNS.map(c => c.id);


export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER_NAME: 'userName',
    USER_EMAIL: 'userEmail',
    RESUME_DATA: 'resumeData',
} as const;

export const API_ENDPOINTS = {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    GOOGLE_AUTH: '/auth/google',
    AUTH: '/auth',
} as const;

export const FONTS = {
    SERIF: 'serif',
    SANS: 'sans-serif',
} as const;

export const THEME_COLORS = {
    PRIMARY: '#2563EB',
} as const;

export const TEMPLATES = {
    COMPACT: 'compact',
    DETAILED: 'detailed',
} as const;
