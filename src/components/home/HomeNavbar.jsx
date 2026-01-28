
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { authService } from '../../services/authService';
import { Button } from '../ui/Button';
import { Logo } from '../Logo';
import UserProfileMenu from '../ui/UserProfileMenu';

const HomeNavbar = () => {
    const [user, setUser] = useState(null);

    // Initial Auth Check
    useEffect(() => {
        if (authService.getToken()) {
            setUser({
                name: authService.getUserName() || '',
                email: authService.getUserEmail() || ''
            });
        }
    }, []);



    const isLoggedIn = !!user;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-2">
                    <Logo size={28} />
                    <span className="font-bold text-lg text-gray-900 tracking-tight">Lumina</span>
                </Link>



                {/* Right Area: Auth Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </Link>
                            <UserProfileMenu user={user} />
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 hover:bg-transparent">
                                    Log In
                                </Button>
                            </Link>
                            <div className="h-4 w-[1px] bg-gray-200"></div>
                            <Link to="/signup">
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all hover:shadow-md hover:translate-y-[-1px]">
                                    Get Started <ArrowRight size={14} className="opacity-70" />
                                </Button>
                            </Link>
                        </>
                    )}
                </div>


                {/* Mobile Menu Toggle - REMOVED (kept profile for mobile) */}
                <div className="md:hidden flex items-center gap-3">
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <LayoutDashboard size={20} />
                            </Link>
                            <UserProfileMenu user={user} />
                        </>
                    ) : (
                        <Link to="/login">
                            <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm rounded-lg px-4 py-2 text-sm font-medium transition-all">
                                Log In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>


        </nav>
    );
};

export default HomeNavbar;
