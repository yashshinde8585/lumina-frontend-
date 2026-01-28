import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../Logo';
import { ChevronRight, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import UserProfileMenu from '../ui/UserProfileMenu';
import { startTour } from '../../utils/tourGuide';

interface AppHeaderProps {
    user: { name: string; email: string } | null;
}

const AppHeader: React.FC<AppHeaderProps> = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Breadcrumbs logic
    const getBreadcrumbs = () => {
        const path = location.pathname;
        if (path === '/dashboard') return [{ label: 'Dashboard', path: '/dashboard', active: true }];
        if (path === '/job-details') return [
            { label: 'Dashboard', path: '/dashboard', active: false },
            { label: 'Job Details', path: '/job-details', active: true }
        ];
        if (path === '/profile') return [
            { label: 'Dashboard', path: '/dashboard', active: false },
            { label: 'Account Profile', path: '/profile', active: true }
        ];
        if (path.startsWith('/editor')) return [
            { label: 'Dashboard', path: '/dashboard', active: false },
            { label: 'Editor', path: path, active: true }
        ];
        if (path === '/generate') return [
            { label: 'Dashboard', path: '/dashboard', active: false },
            { label: 'Generate Resume', path: '/generate', active: true }
        ];
        return [];
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Left: Logo & Breadcrumbs */}
                <div className="flex items-center gap-4">
                    <Link id="app-logo" to="/" className="flex items-center gap-2 group">
                        <Logo size={28} />
                        <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors hidden sm:block">Lumina</span>
                    </Link>

                    {/* Divider */}
                    <div className="h-5 w-[1px] bg-gray-200 rotate-12 hidden sm:block"></div>

                    {/* Breadcrumbs */}
                    <nav className="hidden sm:flex items-center gap-2 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.path}>
                                {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
                                <Link
                                    to={crumb.path}
                                    className={`font-medium transition-colors ${crumb.active
                                        ? 'text-gray-900 cursor-default'
                                        : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                    onClick={e => crumb.active && e.preventDefault()}
                                >
                                    {crumb.label}
                                </Link>
                            </React.Fragment>
                        ))}
                    </nav>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-3 sm:gap-4">

                    {/* New Application Button - Global Action */}
                    {location.pathname !== '/job-details' && (
                        <Button
                            id="create-new-resume-btn"
                            onClick={() => navigate('/generate')}
                            className="relative flex items-center justify-center px-3 md:px-4 py-2 text-xs font-bold tracking-wide shadow-lg shadow-blue-500/25 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-300 text-white"
                        >
                            <Plus className="h-3.5 w-3.5 md:mr-1.5 stroke-[3]" />
                            <span className="hidden md:inline">New Resume</span>
                        </Button>
                    )}

                    <div id="user-profile-menu">
                        <UserProfileMenu user={user} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
export { startTour };
