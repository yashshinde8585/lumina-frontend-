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

            {/* LEFT PANEL: The "100X" Feature Wall */}
            <div className="hidden md:flex w-[45%] lg:w-[50%] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 relative flex-col overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-125 mix-blend-overlay"></div>

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

            {/* RIGHT PANEL: Signup Form */}
            <div className="w-full md:w-[55%] lg:w-[55%] flex flex-col items-center justify-center p-6 md:p-8 relative z-10 h-full">
                {/* Mobile Header */}
                <div className="absolute top-6 left-6 md:hidden">
                    <Link to="/" className="flex items-center gap-2">
                        <Logo size={32} />
                        <span className="font-bold text-xl tracking-tight text-gray-900">Lumina</span>
                    </Link>
                </div>

                <div className="absolute top-6 right-6 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Already a member?</span>
                    <Link to="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                        Sign in
                    </Link>
                </div>

                <div className="w-full max-w-sm">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full"
                    >
                        <div className="mb-4 text-left w-full">
                            <h2 className="text-3xl font-bold text-slate-900 mb-1">Create your account</h2>
                        </div>



                        <form onSubmit={handleSignup} className="space-y-4">
                            {errors.form && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100 mb-4">
                                    <AlertCircle size={16} /> {errors.form}
                                </div>
                            )}

                            {/* Floating Label: Name */}
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-xl border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'} appearance-none focus:outline-none peer transition-all shadow-sm group-hover:shadow-md`}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="name" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                                    Full Name
                                </label>
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            {/* Floating Label: Email */}
                            <div className="relative group">
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-xl border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'} appearance-none focus:outline-none peer transition-all shadow-sm group-hover:shadow-md`}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
                                    Email address
                                </label>
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>

                            {/* Floating Label: Password */}
                            <div>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-xl border ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'} appearance-none focus:outline-none peer transition-all shadow-sm group-hover:shadow-md pr-10`}
                                        placeholder=" "
                                        required
                                    />
                                    <label htmlFor="password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
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

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-4 flex justify-center items-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Get Started <ArrowRight size={16} /></>
                                )}
                            </Button>
                        </form>
                    </motion.div>

                    <div className="text-center mt-8 text-xs text-gray-400">
                        By signing up, you agree to our Terms and Privacy Policy.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
