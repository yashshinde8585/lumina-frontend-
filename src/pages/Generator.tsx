import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { resumeService } from '../services/resumeService'; // Service Layer
import { Button } from '../components/ui/Button';
import { TextArea } from '../components/ui/TextArea';
import { Card } from '../components/ui/Card';
import { ArrowLeft, Sparkles, Wand2, Briefcase, Link as LinkIcon, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXPERIENCE_LEVELS } from '../utils/constants';

const loadingSteps = [
    { label: "Analyzing Job Description...", icon: Sparkles },
    { label: "Extracting Keywords...", icon: Wand2 },
    { label: "Applying Template...", icon: Briefcase }
];

const Generator: React.FC = () => {
    const navigate = useNavigate();
    const { setResumeData, setIsLoading } = useResume();
    const [jd, setJd] = useState<string>('');
    const [level, setLevel] = useState<string>('Entry-Level');
    const [template, setTemplate] = useState<string>('detailed');
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingStep, setLoadingStep] = useState<number>(0);
    const [inputType, setInputType] = useState<'text' | 'url'>('text');

    // Experience Levels
    // Experience Levels
    const levels = EXPERIENCE_LEVELS;

    // Typing effect state
    const [isTyping, setIsTyping] = useState(false);

    // Stepper Logic
    useEffect(() => {
        let interval: any;
        if (loading) {
            setLoadingStep(0);
            interval = setInterval(() => {
                setLoadingStep((prev) => {
                    if (prev < loadingSteps.length) return prev + 1;
                    return prev;
                });
            }, 1000); // 1.5s per step
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleFillExample = () => {
        const exampleText = "We are looking for a Software Engineer with experience in React.js, Node.js, and Tailwind CSS. The candidate should be able to build scalable web applications, collaborate with cross-functional teams, and write clean, maintainable code. Experience with AWS and CI/CD pipelines is a plus. Minimum 2 years of experience required.";
        setLevel('Mid-Level');
        setInputType('text');

        // Typing animation
        setIsTyping(true);
        setJd('');
        let i = 0;
        const speed = 10; // ms per char

        const typeChar = () => {
            if (i < exampleText.length) {
                setJd(prev => prev + exampleText.charAt(i));
                i++;
                setTimeout(typeChar, speed);
            } else {
                setIsTyping(false);
                toast.info("Example JD populated!");
            }
        };
        typeChar();
    };

    const handleGenerate = async () => {
        // Validation
        if (!jd || jd.trim().length === 0) {
            toast.error("Please enter a job description");
            return;
        }

        if (jd.length < 50) {
            toast.error("Job Description must be at least 50 characters long");
            return;
        }

        setLoading(true);
        setIsLoading(true);

        try {
            console.log("Sending request to backend...");

            // Simulate waiting for all steps to visualize
            await new Promise(resolve => setTimeout(resolve, 3500));

            // Call the API with timeout
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), 30000) // 30 second timeout
            );

            const generatedData = await Promise.race([
                resumeService.generateResume({ jd, level, template }),
                timeoutPromise
            ]);

            setResumeData(generatedData);
            toast.success("Resume generated successfully!");
            navigate('/editor', { state: { template } });

        } catch (error: any) {
            console.error("Generation failed:", error);

            // Handle different error scenarios
            if (error.message === 'Request timeout') {
                toast.error("Request timed out. The server is taking too long to respond. Please try again.", {
                    duration: 5000
                });
            } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                toast.error("Cannot connect to server. Please check if the backend is running on port 5002.", {
                    duration: 6000,
                    action: {
                        label: 'Help',
                        onClick: () => toast.info("Make sure your backend server is running: npm run dev")
                    }
                });
            } else if (error.response) {
                // Server responded with error
                const status = error.response.status;
                const errorMsg = error.response.data?.error || error.response.data?.message;

                if (status === 401 || status === 403) {
                    toast.error("Session expired. Please login again.");
                    setTimeout(() => navigate('/login'), 2000);
                } else if (status === 400) {
                    toast.error(errorMsg || "Invalid request. Please check your input.");
                } else if (status === 500) {
                    toast.error("Server error. The AI service might be unavailable. Please try again later.", {
                        duration: 5000
                    });
                } else if (status === 429) {
                    toast.error("Too many requests. Please wait a moment and try again.");
                } else {
                    toast.error(errorMsg || "Failed to generate resume. Please try again.");
                }
            } else if (error.request) {
                // Request made but no response
                toast.error("No response from server. Please check your internet connection.", {
                    duration: 5000
                });
            } else {
                // Something else happened
                toast.error("An unexpected error occurred. Please try again.", {
                    duration: 4000
                });
            }
        } finally {
            setLoading(false);
            setIsLoading(false);
        }
    };

    const jdBorderColor = jd.length === 0 ? 'border-gray-200 focus:ring-blue-500/20' : (jd.length < 50 ? 'border-orange-300 focus:ring-orange-200' : 'border-green-300 focus:ring-green-200');

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden flex flex-col items-center py-10 px-4">
            {/* Simple Header Breadcrumb */}
            <div className="absolute top-6 left-6 md:left-10 z-20">
                <button onClick={() => navigate('/')} className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft size={16} /> Home
                </button>
            </div>

            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent"></div>
                <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            </div>

            <div className="max-w-3xl w-full relative z-10 mx-auto mt-10">
                {/* Main Form Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='w-full'
                >
                    <Card className="border-0 shadow-2xl shadow-blue-500/10 backdrop-blur-xl bg-white/80 ring-1 ring-white/50 p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Briefcase size={20} className="text-blue-600" /> Job Details
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleFillExample}
                                disabled={isTyping}
                                className="h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-100 transition-all whitespace-nowrap flex items-center px-3"
                            >
                                <Wand2 size={12} className={`mr-2 ${isTyping ? 'animate-spin' : ''}`} />
                                <span className="text-xs font-semibold">{isTyping ? 'Auto-Filling...' : 'Auto-Fill Example'}</span>
                            </Button>
                        </div>

                        <div className="space-y-8">

                            {/* Job Description Input - Elevated Hierarchy */}
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500">Paste your target job description. We’ll tailor your resume automatically.</p>
                                <div className='flex justify-between items-end'>
                                    <div className="flex items-center gap-1 rounded-t-lg bg-gray-100/50 p-1">
                                        <button
                                            onClick={() => setInputType('text')}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${inputType === 'text' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                                        >
                                            <FileText size={12} /> Paste Text
                                        </button>
                                        <button
                                            onClick={() => setInputType('url')}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${inputType === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                                        >
                                            <LinkIcon size={12} /> Paste URL
                                        </button>
                                    </div>

                                </div>

                                <div className="relative">
                                    {inputType === 'url' ? (
                                        <input
                                            type="text"
                                            placeholder="https://linkedin.com/jobs/view/..."
                                            value={jd}
                                            onChange={(e) => setJd(e.target.value)}
                                            className={`w-full p-3 pr-16 border rounded-xl text-sm outline-none transition-all ${jdBorderColor}`}
                                        />
                                    ) : (
                                        <TextArea
                                            rows={5}
                                            placeholder="Paste the job description here... (e.g. 'We are looking for a React Developer with 2 years of experience...')"
                                            value={jd}
                                            onChange={(e: any) => setJd(e.target.value)}
                                            className={`h-[120px] text-sm bg-white focus:bg-white transition-all shadow-sm outline-none ring-offset-0 resize-none pb-6 ${jdBorderColor}`}
                                        />
                                    )}
                                    <div className="absolute bottom-2 right-3 pointer-events-none">
                                        <span className={`text-[10px] font-medium ${jd.length < 50 ? 'text-orange-400' : 'text-green-500'}`}>
                                            {jd.length < 50 ? '50+ characters required' : `${jd.length} chars`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Experience Level — Inline Pills */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-2">
                                <span className="text-sm font-medium text-gray-500">Experience:</span>
                                <div className="flex flex-wrap gap-2">
                                    {levels.map((lvl) => (
                                        <button
                                            key={lvl.id}
                                            onClick={() => setLevel(lvl.id)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${level === lvl.id
                                                ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {lvl.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Visual Template Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Resume Template</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Detailed Template Card */}
                                    <div
                                        onClick={() => setTemplate('detailed')}
                                        className={`cursor-pointer border rounded-2xl p-4 flex flex-col items-center gap-3 transition-all relative ${template === 'detailed' ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-blue-300'}`}
                                    >
                                        {template === 'detailed' && (
                                            <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 shadow-md">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        )}
                                        <div className="w-16 h-20 bg-white border border-gray-200 shadow-sm flex flex-col p-1.5 gap-1 select-none pointer-events-none">
                                            <div className="w-full h-2 bg-gray-200 rounded-[1px]"></div>
                                            <div className='flex gap-0.5 mt-0.5 flex-1'>
                                                <div className="w-1/3 h-full bg-gray-50 rounded-[1px]"></div>
                                                <div className="w-2/3 h-full flex flex-col gap-1">
                                                    <div className="w-full h-1 bg-gray-100 rounded-[1px]"></div>
                                                    <div className="w-full h-1 bg-gray-100 rounded-[1px]"></div>
                                                    <div className="w-full h-1 bg-gray-100 rounded-[1px]"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-semibold ${template === 'detailed' ? 'text-blue-700' : 'text-gray-600'}`}>Detailed</span>
                                    </div>

                                    {/* Compact Template Card */}
                                    <div
                                        onClick={() => setTemplate('compact')}
                                        className={`cursor-pointer border rounded-2xl p-4 flex flex-col items-center gap-3 transition-all relative ${template === 'compact' ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-blue-300'}`}
                                    >
                                        {template === 'compact' && (
                                            <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 shadow-md">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        )}
                                        <div className="w-16 h-20 bg-white border border-gray-200 shadow-sm flex flex-col p-1.5 gap-1 select-none pointer-events-none">
                                            <div className="w-full h-2 bg-gray-200 rounded-[1px] mx-auto"></div>
                                            <div className="w-full flex-1 flex flex-col gap-1 items-center justify-center">
                                                <div className="w-12 h-0.5 bg-gray-100"></div>
                                                <div className="w-12 h-0.5 bg-gray-100"></div>
                                                <div className="w-12 h-0.5 bg-gray-100"></div>
                                                <div className="w-12 h-0.5 bg-gray-100"></div>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-semibold ${template === 'compact' ? 'text-blue-700' : 'text-gray-600'}`}>Compact</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={loading || jd.length < 50}
                                className={`w-full justify-center flex items-center gap-2 py-6 text-lg shadow-xl shadow-blue-500/20 transition-all rounded-xl ${loading || jd.length < 50 ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:shadow-blue-500/30'}`}
                            >
                                Generate My Resume <Sparkles size={18} className={loading || jd.length >= 50 ? "text-yellow-300" : ""} />
                            </Button>

                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Stepper Loading Modal */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
                    >
                        <div className="max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Creating Magic...</h3>

                            <div className="space-y-6">
                                {loadingSteps.map((step, index) => {
                                    const isActive = loadingStep === index;
                                    const isCompleted = loadingStep > index;
                                    const Icon = step.icon;

                                    return (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-green-100 text-green-600' : (isActive ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-gray-100 text-gray-400')}`}>
                                                {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                                            </div>
                                            <div className={`flex-1 transition-all ${isActive || isCompleted ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                                                {step.label}
                                            </div>
                                            {isActive && (
                                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="text-center text-xs text-gray-400 mt-8">Please wait while we tailor your resume.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};



export default Generator;
