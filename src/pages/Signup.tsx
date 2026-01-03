import React, { useState, FormEvent } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TextField } from '@mui/material';
import { validators, validateForm } from '../utils/validation';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { toast } from 'sonner';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Password strength indicator
    const getPasswordStrength = (password: string) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const levels = [
            { strength: 0, label: '', color: '' },
            { strength: 1, label: 'Weak', color: 'bg-red-500' },
            { strength: 2, label: 'Fair', color: 'bg-orange-500' },
            { strength: 3, label: 'Good', color: 'bg-yellow-500' },
            { strength: 4, label: 'Strong', color: 'bg-green-500' },
            { strength: 5, label: 'Very Strong', color: 'bg-green-600' },
        ];

        return levels[strength];
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();

        // Validate form
        const validation = validateForm(formData, {
            name: (value: string) => validators.required(value, 'Name'),
            email: validators.email,
            password: validators.password
        });

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsLoading(true);
        try {
            const user = await authService.signup(formData);
            toast.success(`Welcome aboard, ${user.name}! 🎉`);
            navigate('/dashboard');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Signup failed. Please try again.';
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
                toast.success(`Welcome aboard, ${user.name}! 🎉`);
                navigate('/dashboard');
            } catch (err) {
                console.error(err);
                toast.error('Google signup failed');
            } finally {
                setIsLoading(false);
            }
        }
    };



    return (
        <div className="min-h-screen w-full flex bg-white relative overflow-hidden">
            {/* Background Decor - Right Side Only (Subtle) */}
            <div className="absolute top-0 right-0 w-1/2 h-full z-0 hidden md:block">
                <div className="absolute top-0 right-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-50 to-white opacity-50"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            </div>

            {/* LEFT PANEL: Artistic / Thematic (Hidden on Mobile) */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-700 relative items-center justify-center p-12 overflow-hidden text-white">
                {/* Abstract Shapes */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 max-w-lg text-center">
                    {/* Growth Illustration (SVG) */}
                    <motion.svg
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewBox="0 0 400 300"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-auto mb-10 drop-shadow-2xl"
                    >
                        {/* Rocket/Growth Scene */}
                        <path d="M200 250 L100 250 L100 280 L300 280 L300 250 L200 250" fill="white" fillOpacity="0.2" />

                        {/* Rocket Body */}
                        <path d="M200 50 C 230 50, 250 100, 250 180 L 150 180 C 150 100, 170 50, 200 50" fill="white" />
                        <path d="M200 50 C 170 50, 150 100, 150 180" fill="#E0E7FF" fillOpacity="0.5" />

                        {/* Fins */}
                        <path d="M150 180 L 130 220 L 150 200" fill="white" />
                        <path d="M250 180 L 270 220 L 250 200" fill="white" />

                        {/* Window */}
                        <circle cx="200" cy="120" r="20" fill="#4F46E5" />
                        <circle cx="200" cy="120" r="15" fill="#818CF8" />

                        {/* Flames */}
                        <path d="M180 220 Q 200 280, 220 220" fill="#FBBF24" />
                        <path d="M190 220 Q 200 260, 210 220" fill="#F59E0B" />

                        {/* Stars */}
                        <circle cx="50" cy="50" r="2" fill="white" />
                        <circle cx="350" cy="80" r="3" fill="white" opacity="0.8" />
                        <circle cx="80" cy="200" r="2" fill="white" opacity="0.6" />
                    </motion.svg>

                    <h2 className="text-4xl font-bold mb-6 leading-tight">Start Your Journey</h2>
                    <p className="text-lg text-indigo-100 leading-relaxed">
                        Create your account today and get instant access to premium templates,
                        AI writing assistance, and job tracking tools.
                    </p>

                    {/* Slider Dots */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                        <div className="w-8 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Signup Form */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative z-10 min-h-screen">
                {/* Back / Logo Navigation (Absolute Top Left) */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6">
                    <Link to="/" className="flex items-center gap-2 group" title="Back to Home">
                        <Logo size={40} />
                    </Link>
                </div>

                {/* Top Right Navigation - Sign In Link */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-3">
                    <span className="text-sm text-gray-500 hidden sm:inline">Have an account?</span>
                    <Link to="/login">
                        <Button
                            variant="outline"
                            size="sm"
                            className="font-bold border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                        >
                            Sign in
                        </Button>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-sm md:max-w-lg bg-white/50 md:bg-transparent p-0 rounded-2xl"
                >
                    {/* Header */}
                    <div className="text-center mb-6 flex flex-col items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-2 font-sans md:whitespace-nowrap">Build job-ready resumes in minutes</h1>
                        <p className="text-sm md:text-base text-steel font-sans">AI-powered. ATS-optimized. Recruiter approved.</p>
                    </div>

                    {errors.form && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                            <AlertCircle size={16} /> {errors.form}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-6" noValidate>
                        <TextField
                            label="Name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                            fullWidth
                            variant="outlined"
                            placeholder="Your full name"
                            autoComplete="name"
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 0,
                                    backgroundColor: '#f9fafb',
                                    '& fieldset': { borderColor: '#e5e7eb' },
                                    '&:hover fieldset': { borderColor: '#9ca3af' },
                                    '&.Mui-focused fieldset': { borderColor: '#4f46e5' }, // indigo for signup
                                    '&.Mui-focused': { backgroundColor: '#ffffff' }
                                },
                                '& .MuiInputLabel-root': { fontSize: '0.875rem', color: '#4b5563' }
                            }}
                        />

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
                            placeholder="you@domain.com"
                            autoComplete="email"
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 0,
                                    backgroundColor: '#f9fafb',
                                    '& fieldset': { borderColor: '#e5e7eb' },
                                    '&:hover fieldset': { borderColor: '#9ca3af' },
                                    '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
                                    '&.Mui-focused': { backgroundColor: '#ffffff' }
                                },
                                '& .MuiInputLabel-root': { fontSize: '0.875rem', color: '#4b5563' }
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
                            autoComplete="new-password"
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 0,
                                    backgroundColor: '#f9fafb',
                                    '& fieldset': { borderColor: '#e5e7eb' },
                                    '&:hover fieldset': { borderColor: '#9ca3af' },
                                    '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
                                    '&.Mui-focused': { backgroundColor: '#ffffff' }
                                },
                                '& .MuiInputLabel-root': { fontSize: '0.875rem', color: '#4b5563' }
                            }}
                        />


                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="pt-1 space-y-1"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                        />
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-600 min-w-[60px]">
                                        {passwordStrength.label}
                                    </span>
                                </div>
                            </motion.div>
                        )}



                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 !mt-8"
                        >
                            {isLoading ? 'Creating account...' : 'Get my resume started'}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200"></span>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                            <span className="bg-white px-2 text-gray-400 font-medium">or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <div className="flex justify-center w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google Sign-Up Failed')}
                            theme="outline"
                            size="large"
                            width="100%"
                            text="continue_with"
                            shape="circle"
                        />
                    </div>


                </motion.div>

                {/* Copyright/Footer */}
                <div className="absolute bottom-4 text-center text-[10px] text-gray-400">
                    © 2025 ResumeAI. All rights reserved.
                </div>
            </div>
        </div >
    );
};

export default Signup;

