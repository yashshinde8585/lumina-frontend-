import React, { useState } from 'react';
import { User, ChevronDown, Settings, LogOut, LayoutDashboard, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../services/authService';

interface UserProfileMenuProps {
    user: { name: string; email: string } | null;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ user }) => {
    const navigate = useNavigate();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // Initial for avatar
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    const handlePreferencesClick = () => {
        setProfileMenuOpen(false);
        toast.info("Preferences are coming soon!", {
            description: "We are working hard to bring you more customization options."
        });
    };

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-200 group outline-none focus:ring-2 focus:ring-blue-500/20"
            >
                <div className="relative">
                    <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/20 ring-2 ring-white group-hover:ring-blue-50 transition-all">
                        {userInitial}
                    </div>
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="hidden md:flex flex-col items-start text-left">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors leading-none">
                        {user?.name || 'User'}
                    </span>
                </div>

                <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>

            {profileMenuOpen && (
                <>
                    {/* Desktop Dropdown - Premium Glassmorphism */}
                    <div className="hidden sm:block absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-200/60 p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-slate-900/5">

                        {/* Profile Header */}
                        <div className="px-4 py-4 mb-2">
                            <div className="flex items-center gap-4">
                                <div className="relative shrink-0">
                                    <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-500/30">
                                        {userInitial}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 border-[2.5px] border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 truncate">{user?.name || 'User'}</h4>
                                    <p className="text-xs text-slate-500 font-normal truncate mb-1">{user?.email || 'user@example.com'}</p>
                                    <button
                                        onClick={() => { setProfileMenuOpen(false); navigate('/profile'); }}
                                        className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors uppercase tracking-wide"
                                    >
                                        View Profile <ChevronRight size={10} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-0.5">
                            <button onClick={() => { setProfileMenuOpen(false); navigate('/dashboard'); }} className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl flex items-center gap-3 transition-all group">
                                <LayoutDashboard size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                <span className="flex-1">Dashboard</span>
                            </button>

                            <button onClick={() => { setProfileMenuOpen(false); navigate('/profile'); }} className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl flex items-center gap-3 transition-all group">
                                <User size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                <span className="flex-1">Account Profile</span>
                            </button>

                            <button onClick={handlePreferencesClick} className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl flex items-center gap-3 transition-all group">
                                <Settings size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                <span className="flex-1">Settings</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-100/80 my-2 mx-2"></div>

                        {/* Logout Section */}
                        <div className="px-1 pb-1">
                            <button
                                onClick={() => { authService.logout(); navigate('/login'); }}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-3 transition-all group"
                            >
                                <LogOut size={18} className="text-slate-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
                                <span className="flex-1">Log Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Full-Screen Overlay */}
                    <div className="fixed inset-0 z-[1000] bg-white h-[100dvh] w-screen flex flex-col sm:hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between p-6 pb-2">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Menu</h3>
                            <button
                                onClick={() => setProfileMenuOpen(false)}
                                className="p-2 -mr-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {/* User Profile Card */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50/80 border border-gray-100 rounded-2xl mb-8">
                                <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                                    {userInitial}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
                                    <p className="text-sm text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="space-y-2">
                                <button
                                    onClick={() => { setProfileMenuOpen(false); navigate('/dashboard'); }}
                                    className="w-full p-4 flex items-center justify-between text-left bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.99] group"
                                >
                                    <span className="flex items-center gap-4 font-semibold text-gray-700 group-hover:text-blue-600">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <LayoutDashboard size={20} />
                                        </div>
                                        Dashboard
                                    </span>
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-400" />
                                </button>

                                <button
                                    onClick={() => { setProfileMenuOpen(false); navigate('/profile'); }}
                                    className="w-full p-4 flex items-center justify-between text-left bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all active:scale-[0.99] group"
                                >
                                    <span className="flex items-center gap-4 font-medium text-gray-700">
                                        <div className="p-2 bg-gray-100 text-gray-500 rounded-lg group-hover:bg-white group-hover:shadow-sm">
                                            <User size={20} />
                                        </div>
                                        Account Profile
                                    </span>
                                    <ChevronRight size={18} className="text-gray-300" />
                                </button>

                                <button
                                    onClick={handlePreferencesClick}
                                    className="w-full p-4 flex items-center justify-between text-left bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all active:scale-[0.99] group"
                                >
                                    <span className="flex items-center gap-4 font-medium text-gray-700">
                                        <div className="p-2 bg-gray-100 text-gray-500 rounded-lg group-hover:bg-white group-hover:shadow-sm">
                                            <Settings size={20} />
                                        </div>
                                        Settings
                                    </span>
                                    <ChevronRight size={18} className="text-gray-300" />
                                </button>
                            </div>

                            <div className="my-8 border-t border-gray-100"></div>

                            {/* Logout */}
                            <button
                                onClick={() => { authService.logout(); navigate('/login'); }}
                                className="w-full p-4 flex items-center justify-center gap-2 text-red-600 font-medium bg-red-50 hover:bg-red-100 rounded-xl transition-colors active:scale-[0.99]"
                            >
                                <LogOut size={18} />
                                Log Out
                            </button>

                            <p className="text-center text-xs text-gray-300 mt-8">
                                ResumeAI v1.0.0
                            </p>
                        </div>
                    </div>
                </>
            )}

            {profileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent sm:block hidden"
                    onClick={() => setProfileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default UserProfileMenu;
