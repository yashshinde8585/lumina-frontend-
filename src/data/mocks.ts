import { Template, ContentBlock } from '../types';

export const MOCK_LOGS = [
    { id: 1, type: 'error', msg: 'PDF Generation Timeout (User ID: 4)', time: '14:02' },
    { id: 2, type: 'info', msg: 'New Subscription (Stripe ID: ch_123)', time: '14:05' },
    { id: 3, type: 'success', msg: 'Backup completed successfully', time: '14:10' },
    { id: 4, type: 'info', msg: 'User Login: yash@example.com', time: '14:12' },
    { id: 5, type: 'warning', msg: 'High API Latency detected (3.5s)', time: '14:15' },
];

export const MOCK_TEMPLATES: Template[] = [
    { id: 'creative', name: 'Creative', thumbnail: 'bg-gradient-to-br from-purple-100 to-pink-100', active: true, isPro: false },
    { id: 'compact', name: 'Compact', thumbnail: 'bg-white border border-silver', active: true, isPro: true },
    { id: 'modern', name: 'Modern', thumbnail: 'bg-blue-50', active: false, isPro: true },
    { id: 'tech', name: 'Tech', thumbnail: 'bg-charcoal text-white/50', active: true, isPro: false },
];

export const MOCK_CONTENT: ContentBlock[] = [
    { id: '1', section: 'Landing Page', key: 'Hero Title', value: 'Build your professional resume in minutes checking.', lastUpdated: '2d ago' },
    { id: '2', section: 'Landing Page', key: 'Hero Subtitle', value: 'Join 10,000+ users building their careers with AI.', lastUpdated: '5d ago' },
    { id: '3', section: 'Pricing', key: 'Pro Plan Price', value: '$12/month', lastUpdated: '1w ago' },
];
