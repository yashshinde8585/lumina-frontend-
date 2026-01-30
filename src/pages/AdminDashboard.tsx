import { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, CreditCard, FileText, Activity, Settings,
    Search, Bell, LogOut, ArrowUpRight, ArrowDownRight, Printer, AlertTriangle, Shield,
    UserX, Eye, Download, Filter, RefreshCw, Edit2, FileEdit, Save, Globe, MoreVertical, Key, Mail, Ban, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import { authService } from '../services/authService';
import { User } from '../types';
import { MOCK_LOGS, MOCK_TEMPLATES, MOCK_CONTENT } from '../data/mocks';

// --- Types ---

interface DashboardStats {
    totalUsers: number;
    newUsersToday: number;
    proUsers: number;
    freeUsers: number;
    totalResumes: number;
    revenue: number;
    aiCost: number;
    failedExports: number;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'Overview' | 'Users' | 'Templates' | 'CMS' | 'Health' | 'Settings'>('Overview');
    const [globalSearch, setGlobalSearch] = useState('');
    const [impersonating, setImpersonating] = useState<User | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Real data state
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch data on mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [usersData, statsData] = await Promise.all([
                adminService.getAllUsers(),
                adminService.getDashboardStats()
            ]);

            if (usersData.success) {
                setUsers(usersData.users);
            }

            if (statsData.success) {
                setStats(statsData.stats);
            }
        } catch (error: any) {
            console.error('Failed to fetch dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleImpersonate = async (user: User) => {
        try {
            const adminToken = authService.getToken();
            const adminUser = authService.getUserName();
            const adminEmail = authService.getUserEmail();

            if (adminToken) {
                localStorage.setItem('admin_backup_token', adminToken);
                if (adminUser) localStorage.setItem('admin_backup_name', adminUser);
                if (adminEmail) localStorage.setItem('admin_backup_email', adminEmail);
            }

            const response = await adminService.impersonateUser(user.id);

            if (response.success) {
                authService.setToken(response.token);
                authService.setUserName(response.user.name);
                authService.setUserEmail(response.user.email);

                setImpersonating(user);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                toast.success(`Now viewing as ${user.name}`);

                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (error: any) {
            console.error('Impersonation failed:', error);
            toast.error('Failed to impersonate user');
        }
    };

    const handleStopImpersonation = () => {
        const backupToken = localStorage.getItem('admin_backup_token');
        const backupName = localStorage.getItem('admin_backup_name');
        const backupEmail = localStorage.getItem('admin_backup_email');

        if (backupToken) {
            authService.setToken(backupToken);
            if (backupName) authService.setUserName(backupName);
            if (backupEmail) authService.setUserEmail(backupEmail);

            localStorage.removeItem('admin_backup_token');
            localStorage.removeItem('admin_backup_name');
            localStorage.removeItem('admin_backup_email');

            setImpersonating(null);
            toast.success("Restored Admin Session");

            setTimeout(() => window.location.reload(), 500);
        } else {
            authService.logout();
            navigate('/login');
        }
    };

    // --- Components ---

    const StatCard = ({ title, value, subtext, trend, trendDir, icon: Icon, alert, progress }: any) => {
        let progressColor = 'bg-green-500';
        if (progress > 75) progressColor = 'bg-yellow-500';
        if (progress > 90) progressColor = 'bg-red-500';

        return (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-silver shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-lg ${alert ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        <Icon size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    {alert && <div className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold">Alert</div>}
                </div>
                <div>
                    <h3 className="text-steel text-xs sm:text-sm font-medium mb-1">{title}</h3>
                    <div className="text-xl sm:text-2xl font-bold text-charcoal mb-2">{value}</div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                        {trend && (
                            <span className={`flex items-center ${trendDir === 'up' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                {trendDir === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trend}
                            </span>
                        )}
                        <span className="text-steel">{subtext}</span>
                    </div>
                </div>
                {progress !== undefined && (
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-mist">
                        <div className={`h-full ${progressColor}`} style={{ width: `${progress}%` }}></div>
                    </div>
                )}
            </div>
        );
    };

    const SystemHealthPanel = ({ fullHeight = false }) => (
        <div className={`bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 flex flex-col ${fullHeight ? 'h-full' : 'h-[400px] sm:h-[500px]'}`}>
            <div className="p-3 sm:p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-green-400" />
                    <h3 className="font-bold text-slate-200 text-xs sm:text-sm">System Health</h3>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live
                </div>
            </div>

            <div className="p-3 sm:p-4 border-b border-slate-700 relative">
                <div className="flex justify-between items-end mb-2">
                    <div className="text-xs text-slate-400">API Latency (24h)</div>
                    <div className="text-base sm:text-lg font-bold text-green-400">24ms <span className="text-xs text-slate-500 font-normal">avg</span></div>
                </div>

                <div className="flex items-end gap-1 h-16 sm:h-20 relative">
                    <div className="absolute top-[20%] left-0 right-0 border-t border-dotted border-red-500/50 z-10 flex items-center">
                        <span className="text-[9px] text-red-400/80 -mt-3 ml-1 hidden sm:inline">Threshold (200ms)</span>
                    </div>

                    {[40, 60, 30, 80, 50, 90, 40, 20, 60, 45, 80, 30, 60, 40, 70, 50, 40, 60, 80, 40].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-500/20 rounded-sm hover:bg-blue-500 transition-colors group relative" style={{ height: `${h}%` }}>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 font-mono text-[10px] sm:text-xs custom-scrollbar">
                {MOCK_LOGS.map(log => {
                    const userIdMatch = log.msg.match(/User ID: (\d+)/);
                    const userId = userIdMatch ? userIdMatch[1] : null;

                    return (
                        <div key={log.id} className="flex gap-1 sm:gap-2">
                            <span className="text-slate-500 shrink-0">[{log.time}]</span>
                            <span className={`${log.type === 'error' ? 'text-red-400' :
                                log.type === 'warning' ? 'text-yellow-400' :
                                    log.type === 'success' ? 'text-green-400' : 'text-blue-300'
                                }`}>
                                {userId ? (
                                    <span>
                                        {log.msg.split(`User ID: ${userId}`)[0]}
                                        <button
                                            onClick={() => {
                                                setGlobalSearch(userId);
                                                setActiveTab('Users');
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="underline hover:text-white cursor-pointer decoration-dotted underline-offset-2"
                                        >
                                            User ID: {userId}
                                        </button>
                                        {log.msg.split(`User ID: ${userId}`)[1]}
                                    </span>
                                ) : log.msg}
                            </span>
                        </div>
                    );
                })}
                <div className="flex gap-2 animate-pulse">
                    <span className="text-slate-500">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                    <span className="text-slate-500 font-bold">_</span>
                </div>
            </div>
        </div>
    );

    const UserTable = ({ limit }: { limit?: number }) => {
        const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);

        const filteredUsers = users.filter((u: User) =>
            u.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
            u.id.toString().includes(globalSearch)
        );
        const displayUsers = limit ? filteredUsers.slice(0, limit) : filteredUsers;

        const handleMenuAction = async (action: string, user: User) => {
            setOpenMenuId(null);

            try {
                switch (action) {
                    case 'impersonate':
                        handleImpersonate(user);
                        break;
                    case 'view':
                        toast.info(`Viewing profile for ${user.name}`);
                        break;
                    case 'reset-password':
                        if (confirm(`Reset password for ${user.email}? This will generate a temporary password.`)) {
                            const res = await adminService.resetUserPassword(user.id);
                            if (res.success) {
                                prompt(`Password Reset Successful. Copy this temporary password:`, res.tempPassword);
                            }
                        }
                        break;
                    case 'toggle-status':
                        const newStatus = user.status === 'Active' ? 'Banned' : 'Active';
                        const actionVerb = user.status === 'Active' ? 'Ban' : 'Activate';

                        if (confirm(`Are you sure you want to ${actionVerb} ${user.name}?`)) {
                            const res = await adminService.updateUserStatus(user.id, newStatus);
                            if (res.success) {
                                toast.success(res.message);
                                setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
                            }
                        }
                        break;
                    case 'delete':
                        if (confirm(`DANGER: Permanently delete ${user.name} and all their data? This cannot be undone!`)) {
                            const res = await adminService.deleteUser(user.id);
                            if (res.success) {
                                toast.success(res.message);
                                setUsers(users.filter(u => u.id !== user.id));
                            }
                        }
                        break;
                }
            } catch (error: any) {
                console.error('Admin action failed:', error);
                toast.error(error.response?.data?.message || 'Action failed');
            }
        };

        return (
            <div className="bg-white border border-silver rounded-xl overflow-hidden shadow-sm">
                <div className="p-3 sm:p-4 border-b border-silver flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-mist/50">
                    <h3 className="font-bold text-charcoal text-sm sm:text-base">User Master List</h3>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none text-xs"><Filter size={14} /> <span className="hidden sm:inline">Filter</span></Button>
                        <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none text-xs"><Download size={14} /> <span className="hidden sm:inline">Export</span></Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-mist text-steel">
                            <tr>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium">User</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium hidden sm:table-cell">Plan</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium hidden md:table-cell">Resumes</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium hidden lg:table-cell">Spent</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium">Status</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {displayUsers.length > 0 ? displayUsers.map((user: User) => (
                                <tr key={user.id} className="hover:bg-mist/80 transition-colors">
                                    <td className="px-3 sm:px-6 py-2 sm:py-3">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px] sm:text-xs">
                                                {user.avatar}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-charcoal truncate">{user.name}</div>
                                                <div className="text-steel text-[10px] sm:text-xs truncate">{user.email} <span className="text-steel ml-1">#{user.id}</span></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-2 sm:py-3 hidden sm:table-cell">
                                        {user.plan === 'Pro' ?
                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-bold border border-yellow-200">PRO</span> :
                                            <span className="px-2 py-0.5 bg-mist text-steel rounded text-xs font-medium">Free</span>
                                        }
                                    </td>
                                    <td className="px-3 sm:px-6 py-2 sm:py-3 text-charcoal hidden md:table-cell">{user.resumes}</td>
                                    <td className="px-3 sm:px-6 py-2 sm:py-3 text-earth hidden lg:table-cell">${user.spent}</td>
                                    <td className="px-3 sm:px-6 py-2 sm:py-3">
                                        <span className={`flex items-center gap-1.5 text-xs font-medium ${user.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <span className="hidden sm:inline">{user.status}</span>
                                        </span>
                                        <div className="text-steel text-[10px] mt-0.5 hidden sm:block">Active {user.lastActive}</div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-2 sm:py-3 text-right">
                                        <div className="relative inline-block">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                className="p-1.5 sm:p-2 text-steel hover:text-charcoal hover:bg-mist rounded-lg transition-colors"
                                                title="More actions"
                                            >
                                                <MoreVertical size={16} />
                                            </button>

                                            {openMenuId === user.id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setOpenMenuId(null)}
                                                    />

                                                    <div className="absolute right-0 top-10 w-48 sm:w-56 bg-white rounded-lg shadow-2xl border border-silver z-20 py-1">
                                                        <button
                                                            onClick={() => handleMenuAction('view', user)}
                                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm text-charcoal hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 sm:gap-3 transition-colors"
                                                        >
                                                            <Eye size={14} className="text-blue-600" />
                                                            <span className="font-medium">View Profile</span>
                                                        </button>

                                                        <button
                                                            onClick={() => handleMenuAction('impersonate', user)}
                                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm text-charcoal hover:bg-orange-50 hover:text-orange-700 flex items-center gap-2 sm:gap-3 transition-colors"
                                                        >
                                                            <Key size={14} className="text-orange-600" />
                                                            <div>
                                                                <div className="font-medium">Login as {user.name.split(' ')[0]}</div>
                                                                <div className="text-[10px] text-steel">Impersonate user session</div>
                                                            </div>
                                                        </button>

                                                        <button
                                                            onClick={() => handleMenuAction('reset-password', user)}
                                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm text-charcoal hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 sm:gap-3 transition-colors"
                                                        >
                                                            <Mail size={14} className="text-purple-600" />
                                                            <span className="font-medium">Reset Password</span>
                                                        </button>

                                                        <div className="border-t border-silver my-1"></div>

                                                        <button
                                                            onClick={() => handleMenuAction('toggle-status', user)}
                                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm text-charcoal hover:bg-red-50 hover:text-red-700 flex items-center gap-2 sm:gap-3 transition-colors"
                                                        >
                                                            <Ban size={14} className={user.status === 'Active' ? "text-red-600" : "text-green-600"} />
                                                            <span className="font-medium">{user.status === 'Active' ? 'Ban User' : 'Unban User'}</span>
                                                        </button>

                                                        <button
                                                            onClick={() => handleMenuAction('delete', user)}
                                                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 sm:gap-3 transition-colors"
                                                        >
                                                            <UserX size={14} className="text-red-600" />
                                                            <div>
                                                                <div className="font-bold">Delete User</div>
                                                                <div className="text-[10px] text-red-500">⚠️ Permanent action</div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-steel">
                                        No users found matching "{globalSearch}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const menuItems = [
        { id: 'Overview', icon: LayoutDashboard, label: 'Overview' },
        { id: 'Users', icon: Users, label: 'Users' },
        { id: 'Subscriptions', icon: CreditCard, label: 'Subscriptions' },
        { id: 'Templates', icon: FileText, label: 'Templates' },
        { id: 'CMS', icon: FileEdit, label: 'Content (CMS)' },
        { id: 'Health', icon: Activity, label: 'System Health' },
        { id: 'Settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-mist flex font-sans text-charcoal">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                w-64 bg-slate-900 text-slate-300 flex flex-col fixed top-0 bottom-0 left-0 z-50 transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">A</div>
                        <span className="font-bold text-white text-lg tracking-tight">Admin<span className="text-blue-500">Panel</span></span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 py-6 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id as any);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'}`}
                        >
                            <item.icon size={18} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">AD</div>
                        <div className="flex-1 overflow-hidden">
                            <div className="font-bold text-white text-xs truncate">Admin User</div>
                            <div className="text-xs text-slate-500 truncate">admin@lumina.ai</div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut size={14} /> Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
                {/* Impersonation Banner */}
                <AnimatePresence>
                    {impersonating && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-orange-500 text-white px-4 sm:px-6 py-3 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
                        >
                            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                                <Shield size={18} />
                                ⚠️ You are viewing as <span className="font-bold underline">{impersonating.name}</span>. Any changes made will act as this user.
                            </div>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white text-orange-600 hover:bg-orange-50 border-none h-8 text-xs gap-2 w-full sm:w-auto"
                                onClick={handleStopImpersonation}
                            >
                                <LogOut size={12} /> Exit Impersonation Mode
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 bg-white border border-silver rounded-lg hover:bg-mist text-steel"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex-1 sm:flex-none">
                            <h1 className="text-xl sm:text-2xl font-bold text-charcoal">Dashboard &gt; {activeTab}</h1>
                            <p className="text-steel text-xs sm:text-sm">Welcome back! Here's what's happening today.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" size={16} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={globalSearch}
                                onChange={(e) => setGlobalSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-silver rounded-full text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 lg:w-80 shadow-sm transition-all focus:sm:w-96"
                            />
                        </div>
                        <button className="p-2 relative bg-white border border-silver rounded-full hover:bg-mist text-steel shrink-0">
                            <Bell size={18} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Overview Tab */}
                {activeTab === 'Overview' && (
                    <div className="space-y-6 sm:space-y-8">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white p-6 rounded-xl border border-silver shadow-sm h-32 animate-pulse">
                                        <div className="h-4 bg-mist rounded w-3/4 mb-4"></div>
                                        <div className="h-8 bg-mist rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                <StatCard
                                    title="Total Revenue (MRR)"
                                    value={`$${stats?.revenue || 0}`}
                                    subtext="vs last month"
                                    trend="12%"
                                    trendDir="up"
                                    icon={CreditCard}
                                />
                                <StatCard
                                    title="Active Users"
                                    value={stats?.totalUsers || 0}
                                    subtext={`${stats?.newUsersToday || 0} new today`}
                                    icon={Users}
                                />
                                <StatCard
                                    title="AI Usage Cost"
                                    value={`$${stats?.aiCost || 0}`}
                                    subtext="/ $100 Limit"
                                    icon={Activity}
                                    progress={stats?.aiCost ? (stats.aiCost / 100) * 100 : 0}
                                />
                                <StatCard
                                    title="Failed Exports"
                                    value={stats?.failedExports || 0}
                                    subtext="Requires Attention"
                                    icon={AlertTriangle}
                                    alert={stats?.failedExports && stats.failedExports > 0}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <UserTable limit={5} />
                            </div>

                            <div className="h-full">
                                <SystemHealthPanel />
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'Users' && (
                    <UserTable />
                )}

                {/* Templates Tab */}
                {activeTab === 'Templates' && (
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-charcoal">Available Templates</h2>
                                <p className="text-xs sm:text-sm text-steel">Manage visibility and pricing tiers.</p>
                            </div>
                            <Button className="gap-2 w-full sm:w-auto text-sm"><RefreshCw size={16} /> Sync Templates</Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {MOCK_TEMPLATES.map(template => (
                                <div key={template.id} className="bg-white border border-silver rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                    <div className={`h-32 sm:h-40 w-full ${template.thumbnail} flex items-center justify-center relative`}>
                                        <div className="text-gray-400 font-medium text-sm">Preview</div>
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            {template.isPro && <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">PRO</span>}
                                            {template.active ?
                                                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">active</span> :
                                                <span className="bg-gray-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">inactive</span>
                                            }
                                        </div>

                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full"><Edit2 size={14} /></Button>
                                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full"><Eye size={14} /></Button>
                                        </div>
                                    </div>
                                    <div className="p-3 sm:p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-bold text-charcoal text-sm">{template.name}</h3>
                                            <Printer size={16} className="text-steel" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between text-xs sm:text-sm cursor-pointer">
                                                <span className="text-charcoal">Active Status</span>
                                                <div className={`w-10 h-5 rounded-full p-1 transition-colors ${template.active ? 'bg-green-500' : 'bg-silver'}`}>
                                                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${template.active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                </div>
                                            </label>
                                            <label className="flex items-center justify-between text-xs sm:text-sm cursor-pointer">
                                                <span className="text-charcoal">Premium Only</span>
                                                <input type="checkbox" checked={template.isPro} readOnly className="rounded text-blue-600 focus:ring-blue-500" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CMS Tab */}
                {activeTab === 'CMS' && (
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-charcoal">Site Content</h2>
                                <p className="text-xs sm:text-sm text-steel">Edit landing page text and marketing copy.</p>
                            </div>
                            <Button className="gap-2 w-full sm:w-auto text-sm"><Save size={16} /> Publish Changes</Button>
                        </div>

                        <div className="bg-white border border-silver rounded-xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-mist text-steel">
                                        <tr>
                                            <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium">Section</th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium hidden md:table-cell">Key</th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium">Content Value</th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium text-right hidden lg:table-cell">Last Updated</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {MOCK_CONTENT.map(item => (
                                            <tr key={item.id} className="hover:bg-mist/50">
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-charcoal">{item.section}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-steel hidden md:table-cell">{item.key}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 w-full md:w-1/2">
                                                    <input
                                                        type="text"
                                                        defaultValue={item.value}
                                                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-silver rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-charcoal text-xs sm:text-sm"
                                                    />
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right text-steel text-xs hidden lg:table-cell">{item.lastUpdated}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Health Tab */}
                {activeTab === 'Health' && (
                    <div className="h-[calc(100vh-200px)] sm:h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)]">
                        <SystemHealthPanel fullHeight />
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'Settings' && (
                    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-charcoal mb-4 sm:mb-6">Admin Settings</h2>

                            <div className="bg-white border border-silver rounded-xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                                <h3 className="font-semibold text-charcoal flex items-center gap-2 text-sm sm:text-base">
                                    <Shield size={18} className="text-blue-500" /> Security
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-charcoal mb-1">Admin Email</label>
                                        <input type="email" value="admin@lumina.ai" className="w-full p-2 border border-silver rounded-lg text-xs sm:text-sm bg-mist" readOnly />
                                    </div>
                                    <div className="flex items-center justify-between p-3 sm:p-4 bg-mist rounded-lg border border-silver">
                                        <div>
                                            <div className="font-medium text-charcoal text-xs sm:text-sm">Maintenance Mode</div>
                                            <div className="text-[10px] sm:text-xs text-steel">Disable access for all users</div>
                                        </div>
                                        <div className="w-10 h-5 bg-silver rounded-full p-1 cursor-pointer">
                                            <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-silver rounded-xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                                <h3 className="font-semibold text-charcoal flex items-center gap-2 text-sm sm:text-base">
                                    <Globe size={18} className="text-purple-500" /> Global Variables
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-charcoal mb-1">Default Model</label>
                                        <select className="w-full p-2 border border-silver rounded-lg text-xs sm:text-sm text-charcoal">
                                            <option>GPT-4o (Current)</option>
                                            <option>GPT-3.5 Turbo</option>
                                            <option>Claude 3.5 Sonnet</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-charcoal mb-1">Max Resumes / Free User</label>
                                        <input type="number" defaultValue={1} className="w-full p-2 border border-silver rounded-lg text-xs sm:text-sm text-charcoal" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
