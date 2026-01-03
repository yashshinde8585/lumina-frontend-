import React, { useState, FormEvent } from 'react';
import { authService, LoginCredentials } from '../services/authService';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TextField } from '@mui/material';
import { validators, validateForm } from '../utils/validation';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { toast } from 'sonner';

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginCredentials>({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (field: keyof LoginCredentials, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        // Validate form
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
            toast.success(`Welcome back, ${user.name}!`);
            navigate('/dashboard');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
            toast.error(errorMsg);
            setErrors({ form: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        if (credentialResponse.credential) {
            setIsLoading(true);
            try {
                const user = await authService.loginWithGoogle(credentialResponse.credential);
                toast.success(`Welcome back, ${user.name}!`);
                navigate('/dashboard');
            } catch (err) {
                console.error(err);
                toast.error('Google login failed');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white relative overflow-hidden">
            {/* Background Decor - Right Side Only (Subtle) */}
            <div className="absolute top-0 right-0 w-1/2 h-full z-0 hidden md:block">
                <div className="absolute top-0 right-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50 to-white opacity-50"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            </div>

            {/* LEFT PANEL: Artistic / Thematic (Hidden on Mobile) */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative items-center justify-center p-12 overflow-hidden text-white">
                {/* Abstract Shapes/Illustration */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 max-w-lg text-center">
                    {/* Career Illustration (SVG) */}
                    <motion.svg
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewBox="0 0 400 300"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-auto mb-10 drop-shadow-2xl"
                    >
                        {/* Resume/Career Scene */}
                        <rect x="100" y="50" width="200" height="260" rx="4" fill="white" fillOpacity="0.9" />
                        <rect x="120" y="80" width="80" height="8" rx="4" fill="#E2E8F0" />
                        <rect x="120" y="100" width="160" height="4" rx="2" fill="#E2E8F0" />
                        <rect x="120" y="115" width="140" height="4" rx="2" fill="#E2E8F0" />
                        <rect x="120" y="130" width="160" height="4" rx="2" fill="#E2E8F0" />

                        {/* The "Dream Job" Target */}
                        <circle cx="300" cy="80" r="30" fill="#FBBF24" />
                        <path d="M290 85L300 95L320 65" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Connecting Line */}
                        <path d="M200 150 C 200 200, 250 200, 280 120" stroke="#60A5FA" strokeWidth="4" strokeDasharray="8 8" />

                        {/* User Avatar */}
                        <circle cx="150" cy="220" r="25" fill="#4F46E5" />
                        <path d="M150 220 L170 200 L190 220" stroke="white" strokeWidth="2" />
                    </motion.svg>

                    <h2 className="text-4xl font-bold mb-6 leading-tight">Land Your Dream Job</h2>
                    <p className="text-lg text-blue-100 leading-relaxed">
                        Join thousands of professionals who tracked their way to success.
                        Our AI-powered tools help you build, optimize, and organize your job search.
                    </p>

                    {/* Slider Dots/indicators */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <div className="w-8 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Login Form */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative z-10 min-h-screen">
                {/* Back / Logo Navigation (Absolute Top Left) */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6">
                    <Link to="/" className="flex items-center gap-2 group" title="Back to Home">
                        <Logo size={40} />
                    </Link>
                </div>

                {/* Top Right Navigation - Sign Up Link */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-3">
                    <span className="text-sm text-gray-500 hidden sm:inline">New here?</span>
                    <Link to="/signup">
                        <Button
                            variant="outline"
                            size="sm"
                            className="font-bold border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                        >
                            Create account
                        </Button>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-sm bg-white/50 md:bg-transparent p-0 rounded-2xl"
                >
                    {/* Header */}
                    <div className="text-center mb-6 flex flex-col items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-2 font-sans md:whitespace-nowrap">Access your resumes instantly</h1>
                        <p className="text-sm md:text-base text-steel font-sans">AI-powered · ATS-optimized · Secure by default</p>
                    </div>

                    {/* Form Error */}
                    {errors.form && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2"
                        >
                            <AlertCircle size={16} />
                            {errors.form}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6" noValidate>
                        <div className="space-y-6">
                            <TextField
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                                fullWidth
                                variant="outlined"
                                placeholder="you@example.com"
                                autoComplete="email"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 0,
                                        backgroundColor: '#f9fafb', // bg-gray-50
                                        '& fieldset': {
                                            borderColor: '#e5e7eb', // border-gray-200
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#9ca3af', // hover:border-gray-400
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#3b82f6', // focus:ring-blue-500
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: '#ffffff',
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: '0.875rem', // text-sm
                                        color: '#4b5563', // text-gray-600
                                    }
                                }}
                            />

                            <TextField
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password}
                                required
                                fullWidth
                                variant="outlined"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 0,
                                        backgroundColor: '#f9fafb',
                                        '& fieldset': {
                                            borderColor: '#e5e7eb',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#9ca3af',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#3b82f6',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: '#ffffff',
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: '0.875rem',
                                        color: '#4b5563',
                                    }
                                }}
                            />
                        </div>



                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 rounded-xl !mt-8"
                        >
                            {isLoading ? 'Continuing...' : 'Continue'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200"></span>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                            <span className="bg-white px-2 text-gray-400 font-medium">or continue with</span>
                        </div>
                    </div>

                    {/* Google Login - Outline Style */}
                    <div className="flex justify-center w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.log('Login Failed');
                                toast.error('Google Sign-In failed');
                            }}
                            theme="outline"
                            size="large"
                            width="100%"
                            text="continue_with"
                            shape="circle"
                        />
                        {/* Note: Standard Google Button is hard to style perfectly to match custom UI without custom wrapper, but using standard is safer/easier */}
                    </div>


                </motion.div>

                {/* Copyright/Footer */}
                <div className="absolute bottom-6 text-center text-xs text-gray-400">
                    © 2025 ResumeAI. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;
