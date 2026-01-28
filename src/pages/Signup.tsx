import React, { useState, FormEvent } from 'react';

import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { validators, validateForm } from '../utils/validation';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { toast } from 'sonner';
import { FeatureNarrative } from '../components/auth/FeatureNarrative';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    // Enhanced Password Strength Logic
    const getPasswordScore = (pwd: string) => {
        if (!pwd) return 0;
        let score = 0;
        if (pwd.length > 6) score += 1;
        if (pwd.length > 10) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
        return score; // Max 5
    };

    const passwordScore = getPasswordScore(formData.password);

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
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
            setIsSuccess(true); // Trigger Success State

            // Clear tour flag for new users to ensure they see the tour
            localStorage.removeItem('lumina_tour_completed');

            // Wait for animation before redirect
            setTimeout(() => {
                toast.success(`Welcome aboard, ${user.name}! Your journey begins now.`);
                navigate('/dashboard');
            }, 2000);

        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'We couldn\'t create your account. Please try again.';
            toast.error(errorMsg);
            setErrors({ form: errorMsg });
            setIsLoading(false);
        }
    };



    if (isSuccess) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center z-20"
                >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                        >
                            <CheckCircle2 size={48} className="text-green-600" />
                        </motion.div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Account Created!</h2>
                    <p className="text-gray-500 text-lg">Let's build your first 100-score resume.</p>
                </motion.div>
                {/* Confetti-like bits */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            background: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'][i % 4],
                            top: '50%',
                            left: '50%',
                        }}
                        animate={{
                            x: (Math.random() - 0.5) * 800,
                            y: (Math.random() - 0.5) * 800,
                            opacity: [1, 0],
                            scale: [0, 1.5]
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex bg-gray-50 relative overflow-hidden font-sans">
            {/* Simple Top Loading Bar */}
            {isLoading && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute top-0 left-0 w-full h-1 bg-green-500 z-50 origin-left"
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

                    {/* Right: Sign in link */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:inline">Already a member?</span>
                        <Link to="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </nav>

            {/* LEFT PANEL: Feature Wall - Full Height, Vertically Centered */}
            <div className="hidden md:flex md:w-[60%] lg:w-[60%] h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 relative flex-col justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-125 mix-blend-overlay"></div>

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

                {/* Sign In Link - Absolute Top Right */}
                <div className="absolute top-10 right-10 flex items-center gap-3">
                    <span className="text-sm text-gray-500 hidden sm:inline">Already a member?</span>
                    <Link to="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                        Sign in
                    </Link>
                </div>

                {/* Form Container - Fixed Width, Centered */}
                <div className="w-full max-w-[440px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full"
                    >
                        {/* Heading Group */}
                        <div className="mb-8 text-left w-full">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
                            <p className="text-slate-500 text-sm">Join Lumina and start tracking your job search journey.</p>
                        </div>

                        {/* Form with Proper Spacing */}
                        <form onSubmit={handleSignup} className="space-y-6">
                            {errors.form && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                                    <AlertCircle size={16} /> {errors.form}
                                </div>
                            )}

                            {/* Full Name Input */}
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={`block px-4 py-4 w-full text-sm text-gray-900 bg-white rounded-xl border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'} appearance-none focus:outline-none peer transition-all shadow-sm group-hover:shadow-md`}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="name" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                                    Full Name
                                </label>
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            {/* Email Input */}
                            <div className="relative group">
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={`block px-4 py-4 w-full text-sm text-gray-900 bg-white rounded-xl border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'} appearance-none focus:outline-none peer transition-all shadow-sm group-hover:shadow-md`}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                                    Email address
                                </label>
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>

                            {/* Password Input with Strength Meter */}
                            <div>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        className={`block px-4 py-4 w-full text-sm text-gray-900 bg-white rounded-xl border ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'} appearance-none focus:outline-none peer transition-all shadow-sm group-hover:shadow-md pr-12`}
                                        placeholder=" "
                                        required
                                    />
                                    <label htmlFor="password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
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
                                <div className="flex gap-1 mt-2 h-1 px-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`flex-1 rounded-full transition-all duration-300 ${passwordScore >= level
                                                ? (passwordScore <= 2 ? 'bg-red-400' : passwordScore === 3 ? 'bg-yellow-400' : 'bg-green-500')
                                                : 'bg-gray-100'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button with Proper Gap */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-8 flex justify-center items-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Get Started <ArrowRight size={16} /></>
                                )}
                            </Button>
                        </form>
                    </motion.div>
                </div>

                {/* Footer - Absolute Bottom */}
                <div className="absolute bottom-6 text-xs text-gray-400">
                    © 2025 Lumina. Secure by automated magic.
                </div>
            </div>
        </div>
    );
};

export default Signup;
