import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Settings, ArrowLeft, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../services/authService';
import { Button } from '../ui/Button';
import { Logo } from '../Logo';

const HomeNavbar = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Initial Auth Check
    useEffect(() => {
        if (authService.getToken()) {
            setUser({
                name: authService.getUserName(),
                email: authService.getUserEmail()
            });
        }
    }, []);

    const scrollToHowItWorks = () => {
        const element = document.getElementById('how-it-works');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const scrollToFeatures = () => {
        const element = document.getElementById('features');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const isLoggedIn = !!user;

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <Logo size={32} />
                        <span className="font-bold text-xl text-charcoal hidden sm:block">ResumeAI</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard">
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                        className="flex items-center gap-2 pl-1 pr-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                            {user?.name || 'User'}
                                        </span>
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </button>

                                    {profileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-silver py-2 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                                            </div>
                                            <button onClick={() => navigate('/dashboard')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                <User size={14} className="text-gray-500" /> Dashboard
                                            </button>
                                            <button onClick={() => toast.info('App Settings coming soon')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                <Settings size={14} className="text-gray-500" /> Settings
                                            </button>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                <ArrowLeft size={14} /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" className="text-steel hover:text-charcoal hover:bg-transparent">Log In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile: Login Icon + Hamburger */}
                    <div className="md:hidden flex items-center gap-2">
                        {!isLoggedIn && (
                            <Link to="/login">
                                <button
                                    className="p-2 text-steel hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    aria-label="Log in"
                                >
                                    <User size={20} />
                                </button>
                            </Link>
                        )}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-steel hover:text-charcoal hover:bg-mist rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer (Copied from Home.jsx) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[2000] md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-[2001] md:hidden"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-silver">
                                    <span className="font-bold text-xl text-charcoal">Menu</span>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-2 text-steel hover:text-charcoal hover:bg-mist rounded-lg transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    <nav className="space-y-2">
                                        <button
                                            onClick={scrollToHowItWorks}
                                            className="w-full text-left px-4 py-3 text-charcoal hover:bg-mist rounded-lg transition-colors font-medium"
                                        >
                                            How it Works
                                        </button>
                                        <button
                                            onClick={scrollToFeatures}
                                            className="w-full text-left px-4 py-3 text-charcoal hover:bg-mist rounded-lg transition-colors font-medium"
                                        >
                                            Features
                                        </button>
                                        {!isLoggedIn && (
                                            <Link
                                                to="/login"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block w-full text-left px-4 py-3 text-charcoal hover:bg-mist rounded-lg transition-colors font-medium"
                                            >
                                                Log In
                                            </Link>
                                        )}
                                    </nav>
                                </div>

                                {/* CTA Button */}
                                <div className="p-6 border-t border-silver">
                                    {isLoggedIn ? (
                                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg">
                                                Go to Dashboard
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link to="/generate" onClick={() => setMobileMenuOpen(false)}>
                                            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg">
                                                Create Resume
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default HomeNavbar;
