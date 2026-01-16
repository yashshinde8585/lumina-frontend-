
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Briefcase, Camera,
    Bell, CreditCard, Moon, Sun, Monitor, FileText
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import AppHeader from '../components/layout/AppHeader';

// Mock types for extended profile data
interface UserProfile {
    name: string;
    email: string;
    phone: string;
    location: string;
    jobTitle: string;
    bio: string;
    avatarUrl?: string;
}

interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    paperSize: 'A4' | 'Letter';
    emailNotifications: boolean;
    jobAlerts: boolean;
}

const AccountProfile = () => {

    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    // In a real app, this would come from an API endpoint like /api/me
    // For now, we seed it with authService data and maybe localStorage for persistence of extra fields
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        email: '',
        phone: '',
        location: '',
        jobTitle: '',
        bio: '',
    });

    const [preferences, setPreferences] = useState<UserPreferences>({
        theme: 'light',
        paperSize: 'A4',
        emailNotifications: true,
        jobAlerts: true
    });

    const [activeTab, setActiveTab] = useState<'general' | 'preferences'>('general');

    // Handle URL query param for tab
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'preferences') {
            setActiveTab('preferences');
        } else {
            setActiveTab('general');
        }
    }, [searchParams]);

    useEffect(() => {
        const loadProfile = () => {
            const userName = authService.getUserName() || '';
            const userEmail = authService.getUserEmail() || '';

            // Try to load extended data from localStorage
            const savedProfile = localStorage.getItem('user_profile_extended');
            if (savedProfile) {
                const parsed = JSON.parse(savedProfile);
                setProfile({
                    ...parsed,
                    name: userName, // Always sync critical auth fields
                    email: userEmail
                });
            } else {
                setProfile(prev => ({
                    ...prev,
                    name: userName,
                    email: userEmail
                }));
            }

            // Load Preferences
            const savedPrefs = localStorage.getItem('user_preferences');
            if (savedPrefs) {
                setPreferences(JSON.parse(savedPrefs));
            }
        };
        loadProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
        const newPrefs = { ...preferences, [key]: value };
        setPreferences(newPrefs);
        localStorage.setItem('user_preferences', JSON.stringify(newPrefs));

        // In a real app, apply theme immediately here
        if (key === 'theme') {
            toast.success(`Theme set to ${value}`);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Save to localStorage
        localStorage.setItem('user_profile_extended', JSON.stringify(profile));

        // Also update authService name if changed (mock)
        // authService.updateUser({ name: profile.name }); // If this existed

        setIsLoading(false);
        toast.success("Profile updated successfully");
    };

    const handleTabChange = (tab: 'general' | 'preferences') => {
        setActiveTab(tab);
        // Update URL without reload to maintain state URL sync
        const newUrl = tab === 'general' ? '/profile' : `/profile?tab=${tab}`;
        window.history.pushState({}, '', newUrl);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans">
            {/* Header */}
            <AppHeader user={{ name: profile.name, email: profile.email }} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
                        <button
                            onClick={() => handleTabChange('general')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <User size={18} /> General
                        </button>


                        {/* Placeholder for Billing */}
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed"
                                onClick={() => toast.info("Billing features coming soon")}
                            >
                                <CreditCard size={18} /> Billing
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">

                        {/* Tab: General */}
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Profile Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="relative group">
                                        <div className="h-24 w-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                            {profile.name.charAt(0).toUpperCase()}
                                        </div>
                                        <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-200 shadow-md text-gray-600 hover:text-blue-600 transition-colors"
                                            onClick={() => toast.info("Avatar upload coming soon")}>
                                            <Camera size={16} />
                                        </button>
                                    </div>
                                    <div className="text-center sm:text-left flex-1">
                                        <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                                        <p className="text-gray-500">{profile.email}</p>
                                        <div className="flex gap-2 mt-3 justify-center sm:justify-start">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                                                Pro Plan
                                            </span>
                                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>

                                    </div>

                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={profile.name}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={profile.email}
                                                    disabled
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-400">Contact support to change email.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Job Title</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="jobTitle"
                                                    value={profile.jobTitle}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Software Engineer"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={profile.phone}
                                                    onChange={handleChange}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={profile.location}
                                                    onChange={handleChange}
                                                    placeholder="City, Country"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                                        >
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Preferences (Settings) */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900">App Preferences</h3>
                                        <p className="text-sm text-gray-500">Customize your workspace and default settings.</p>
                                    </div>

                                    <div className="p-6 space-y-8">
                                        {/* Theme */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                <Monitor size={16} /> Theme
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { id: 'light', icon: Sun, label: 'Light' },
                                                    { id: 'dark', icon: Moon, label: 'Dark' },
                                                    { id: 'system', icon: Monitor, label: 'System' },
                                                ].map((theme) => (
                                                    <button
                                                        key={theme.id}
                                                        onClick={() => handlePreferenceChange('theme', theme.id)}
                                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${preferences.theme === theme.id
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                                                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                                            }`}
                                                    >
                                                        <theme.icon size={20} className="mb-2" />
                                                        <span className="text-sm font-medium">{theme.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100"></div>

                                        {/* Resume Builder Defaults */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                <FileText size={16} /> Resume Builder Defaults
                                            </h4>

                                            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Default Paper Size</p>
                                                    <p className="text-xs text-gray-500">Used for new resumes</p>
                                                </div>
                                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                                    {(['A4', 'Letter'] as const).map(size => (
                                                        <button
                                                            key={size}
                                                            onClick={() => handlePreferenceChange('paperSize', size)}
                                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${preferences.paperSize === size
                                                                ? 'bg-white text-gray-900 shadow-sm'
                                                                : 'text-gray-500 hover:text-gray-700'
                                                                }`}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100"></div>

                                        {/* Notifications */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                <Bell size={16} /> Notifications
                                            </h4>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                                                        <p className="text-xs text-gray-500">Receive updates and newsletters</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                    >
                                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ${preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Job Alerts</p>
                                                        <p className="text-xs text-gray-500">Get notified about tracking updates</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handlePreferenceChange('jobAlerts', !preferences.jobAlerts)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.jobAlerts ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                    >
                                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ${preferences.jobAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountProfile;
