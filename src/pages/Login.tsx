import React, { useState, FormEvent } from 'react';
import { authService, LoginCredentials } from '../services/authService';

import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { validators, validateForm } from '../utils/validation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';
import { toast } from 'sonner';
import { FeatureNarrative } from '../components/auth/FeatureNarrative';

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginCredentials>({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (field: keyof LoginCredentials, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        const validation = validateForm(formData, {
            email: validators.email,
            password: (value) => validators.required(value, 'Password')
        });

        if (!validation.isValid) {
            setErrors(validation.errors as Record<string, string>);
            return;
        }

        setIsLoading(true);
        try {
            const user = await authService.login(formData);
            toast.success(`Welcome back, ${user.name}! It's great to see you again.`);
            navigate('/dashboard');
        } catch (err: any) {
            let errorMsg = err.response?.data?.message || 'Login failed. Check your details.';
            const lowerMsg = errorMsg.toLowerCase();
            const newErrors: Record<string, string> = {};

            // Specific Field Errors
            if (lowerMsg.includes('user not found')) {
                newErrors.email = "Account not found.";
                errorMsg = "Account not found.";
            } else if (lowerMsg.includes('password') || lowerMsg.includes('credential')) {
                newErrors.password = "Incorrect password.";
                errorMsg = "Incorrect password.";
            } else {
                // Generic / Network Errors
                if (lowerMsg.includes('network') || lowerMsg.includes('connection')) {
                    errorMsg = "Connection failed.";
                }
                newErrors.form = errorMsg;
            }

            toast.error(errorMsg);
            setErrors(newErrors);
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <div className="h-screen w-full flex bg-gray-50 relative overflow-hidden font-sans">
            {/* Top Loading Bar */}
            {isLoading && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute top-0 left-0 w-full h-1 bg-blue-600 z-50 origin-left"
                />
            )}

            {/* Mobile Navigation Header - Only visible on mobile */}
            <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <Logo size={28} />
                        <span className="font-bold text-lg text-gray-900 tracking-tight">Lumina</span>
                    </Link>

                    {/* Right: Sign up link */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:inline">No account?</span>
                        <Link to="/signup" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* LEFT PANEL: Feature Wall - Full Height, Vertically Centered */}
            <div className="hidden md:flex md:w-[60%] lg:w-[60%] h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 relative flex-col justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 contrast-125 mix-blend-overlay"></div>

                {/* Logo - Absolute Top Left */}
                <div className="absolute top-10 left-10 z-20">
                    <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                        <Logo size={32} variant="white" />
                        <span className="font-bold text-xl tracking-tight">Lumina</span>
                    </Link>
                </div>

                {/* Centered Content Group */}
                <div className="relative z-10 px-16 max-w-2xl mx-auto">
                    {/* Heading */}
                    <div className="mb-20">
                        <h1 className="text-5xl font-bold text-white leading-[1.1] mb-4">
                            The Future of the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Job Search</span>.
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            One platform to build, track, and win.
                        </p>
                    </div>

                    {/* Feature Cards with Gap */}
                    <div className="space-y-4">
                        <FeatureNarrative />
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Form - Full Height, Vertically Centered */}
            <div className="w-full md:w-[40%] lg:w-[40%] h-screen flex flex-col justify-center items-center relative bg-gray-50 px-6 pt-16 md:pt-0">

                {/* Mobile Logo - Removed since we have nav bar on mobile */}

                {/* Sign Up Link - Absolute Top Right */}
                <div className="absolute top-10 right-10 flex items-center gap-3">
                    <span className="text-sm text-gray-500 hidden sm:inline">No account?</span>
                    <Link to="/signup" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                        Sign up
                    </Link>
                </div>

                {/* Form Container - Fixed Width, Centered */}
                <div className="w-full max-w-[440px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="login-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Heading Group */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                                <p className="text-slate-500 text-sm">Enter your credentials to access your dashboard.</p>
                            </div>

                            {/* Form with Proper Spacing */}
                            <form onSubmit={handleLogin} className="space-y-6">
                                {errors.form && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                                        <AlertCircle size={16} /> {errors.form}
                                    </div>
                                )}

                                {/* Email Input */}
                                <div className="relative group">
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className={`block px-4 py-4 w-full text-sm text-gray-900 bg-white rounded-xl border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'} appearance-none focus:outline-none peer transition-all shadow-sm group-hover:shadow-md`}
                                        placeholder=" "
                                        required
                                    />
                                    <label htmlFor="email" className={`absolute text-sm ${errors.email ? 'text-red-500' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3`}>
                                        Email address
                                    </label>
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>

                                {/* Password Input */}
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        className={`block px-4 py-4 w-full text-sm text-gray-900 bg-white rounded-xl border ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'} appearance-none focus:outline-none peer transition-all shadow-sm group-hover:shadow-md pr-12`}
                                        placeholder=" "
                                        required
                                    />
                                    <label htmlFor="password" className={`absolute text-sm ${errors.password ? 'text-red-500' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3`}>
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {/* Submit Button with Proper Gap */}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-8"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Signing in...</span>
                                        </div>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Continue <Sparkles size={16} className="text-blue-200" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer - Absolute Bottom */}
                <div className="absolute bottom-6 text-xs text-gray-400">
                    © 2025 Lumina. Secure by automated magic.
                </div>
            </div>
        </div>
    );
};

export default Login;
