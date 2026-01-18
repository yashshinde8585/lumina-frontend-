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
            const errorMsg = err.response?.data?.message || 'We couldn\'t log you in. Please check your email and password.';
            toast.error(errorMsg);
            setErrors({ form: errorMsg });
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

            {/* LEFT PANEL: The "100X" Feature Wall */}
            <div className="hidden md:flex w-[45%] lg:w-[50%] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 relative flex-col overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 contrast-125 mix-blend-overlay"></div>

                {/* Branding on Left Panel */}
                <div className="relative z-10 p-12 pb-0">
                    <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                        <Logo size={32} variant="white" />
                        <span className="font-bold text-xl tracking-tight">Lumina</span>
                    </Link>
                    <div className="mt-8 max-w-md">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                            The Future of the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Job Search</span>.
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed mb-8">
                            One platform to build, track, and win.
                        </p>
                    </div>
                </div>

                {/* Feature Cards Feature */}
                <div className="flex-1 relative mt-4 w-full max-w-xl mx-auto px-12">
                    <FeatureNarrative />
                </div>
            </div>

            {/* RIGHT PANEL: The "Luxe" Form */}
            <div className="w-full md:w-[55%] lg:w-[50%] flex flex-col items-center justify-center p-6 md:p-8 relative z-10 h-full">
                {/* Mobile Header (Only visible on small screens) */}
                <div className="absolute top-6 left-6 md:hidden">
                    <Link to="/">
                        <Logo size={32} />
                    </Link>
                </div>

                <div className="absolute top-6 right-6 flex items-center gap-2">
                    <span className="text-sm text-gray-500">No account?</span>
                    <Link to="/signup" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                        Sign up
                    </Link>
                </div>

                <div className="w-full max-w-sm">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="login-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-4">
                                <h2 className="text-3xl font-bold text-slate-900 mb-1">Welcome Back</h2>
                                <p className="text-slate-500 text-sm">Enter your credentials to access your dashboard.</p>
                            </div>

                            {/* Social First Approach */}


                            <form onSubmit={handleLogin} className="space-y-4">
                                {errors.form && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                                        <AlertCircle size={16} /> {errors.form}
                                    </div>
                                )}

                                {/* Floating Label Input: Email */}
                                <div className="relative group">
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-xl border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'} appearance-none focus:outline-none peer transition-all shadow-sm group-hover:shadow-md`}
                                        placeholder=" "
                                        required
                                    />
                                    <label htmlFor="email" className={`absolute text-sm ${errors.email ? 'text-red-500' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3`}>
                                        Email address
                                    </label>
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>

                                {/* Floating Label Input: Password */}
                                <div>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={formData.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-xl border ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'} appearance-none focus:outline-none peer transition-all shadow-sm group-hover:shadow-md pr-10`}
                                            placeholder=" "
                                            required
                                        />
                                        <label htmlFor="password" className={`absolute text-sm ${errors.password ? 'text-red-500' : 'text-gray-500'} duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3`}>
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-2"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
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

                <div className="absolute bottom-6 text-xs text-gray-400">
                    © 2025 Lumina. Secure by automated magic.
                </div>
            </div>
        </div>
    );
};

export default Login;
