import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, User, Zap, Settings } from 'lucide-react';
import ScoreCounter from './ScoreCounter';

const HomeHero = () => {
    return (
        <div className="container mx-auto px-6 pt-32 pb-12 md:pt-30 md:pb-24 relative z-10 transition-all duration-300">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                {/* LEFT COLUMN: Content */}
                <div className="flex flex-col items-start text-left max-w-2xl mx-auto lg:mx-0 w-full">
                    {/* Pill Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-6 md:mb-8"
                    >
                        ✨ AI-Powered ATS Resume Builder
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-gray-900 leading-[1.1] tracking-tight mb-4 md:mb-6"
                    >
                        Build job-ready resumes recruiters actually read
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg sm:text-[18px] text-gray-600 leading-relaxed mb-10 md:mb-14 max-w-lg"
                    >
                        Turn any job description into an ATS-optimized resume in under 60 seconds.
                    </motion.p>

                    {/* Trust Line */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 font-medium"
                    >
                        <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-blue-600" /> No credit card required</span>
                        <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-blue-600" /> Trusted by 10,000+ users</span>
                        <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-blue-600" /> ATS-tested</span>
                    </motion.div>
                </div>

                {/* RIGHT COLUMN: Product Mockup - Visible on all screens now */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative mt-8 lg:mt-0 w-full max-w-[500px] mx-auto lg:max-w-none"
                >
                    {/* Mock Window */}
                    <div className="bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden relative z-10 w-full transform lg:rotate-[-1deg] hover:rotate-0 transition-transform duration-500">

                        {/* Window Header */}
                        <div className="bg-gray-50 border-b border-gray-100 p-3 flex items-center gap-2">
                            <div className="flex gap-1.5 pl-1">
                                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                            </div>
                            <div className="text-[10px] bg-white border border-gray-200 text-gray-400 px-3 py-0.5 rounded-full mx-auto font-mono hidden sm:block">resume-ai-editor.tsx</div>
                        </div>

                        {/* UI Body - Split View - Responsive Height */}
                        <div className="flex h-[350px] sm:h-[450px]">
                            {/* Sidebar - Hidden on very small screens if needed, but keeping for now */}
                            <div className="w-12 sm:w-16 bg-gray-50 border-r border-gray-100 flex flex-col items-center py-4 gap-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><FileText size={16} className="sm:w-[18px] sm:h-[18px]" /></div>
                                <div className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 flex items-center justify-center"><User size={16} className="sm:w-[18px] sm:h-[18px]" /></div>
                                <div className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 flex items-center justify-center"><Zap size={16} className="sm:w-[18px] sm:h-[18px]" /></div>
                                <div className="mt-auto w-8 h-8 rounded-lg text-gray-400 flex items-center justify-center"><Settings size={16} className="sm:w-[18px] sm:h-[18px]" /></div>
                            </div>

                            {/* Main Editor Area */}
                            <div className="flex-1 bg-gray-100/50 p-4 sm:p-6 flex flex-col relative overflow-hidden">
                                {/* Resume Page Skeleton */}
                                <div className="bg-white shadow-sm border border-gray-200 w-full h-full rounded p-4 sm:p-6 relative">
                                    <div className="h-4 sm:h-6 w-1/3 bg-gray-900/10 rounded mb-4"></div>
                                    <div className="h-3 sm:h-4 w-full bg-gray-100 rounded mb-2"></div>
                                    <div className="h-3 sm:h-4 w-2/3 bg-gray-100 rounded mb-6 sm:mb-8"></div>

                                    <div className="h-3 sm:h-4 w-1/4 bg-gray-200 rounded mb-4"></div>
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="h-2 sm:h-3 w-full bg-gray-50 rounded"></div>
                                        <div className="h-2 sm:h-3 w-5/6 bg-gray-50 rounded"></div>
                                        <div className="h-2 sm:h-3 w-full bg-gray-50 rounded"></div>
                                    </div>

                                    {/* Highlighted section (AI Suggestion) */}
                                    <div className="absolute top-1/2 left-4 right-4 sm:left-6 sm:right-6 p-1 border-2 border-blue-400/30 rounded-lg bg-blue-50/10 z-10"></div>

                                    {/* Floating AI Tooltip - Responsive positioning */}
                                    <div className="absolute top-1/2 -right-2 sm:-right-8 bg-white shadow-xl border border-gray-100 rounded-lg p-2 sm:p-3 w-40 sm:w-48 z-20 animate-bounce-slow">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Zap size={10} className="sm:w-[12px] sm:h-[12px]" /></div>
                                            <span className="text-[10px] sm:text-xs font-bold text-gray-800">AI Suggestion</span>
                                        </div>
                                        <p className="text-[8px] sm:text-[10px] text-gray-600 leading-tight">Use stronger action verbs here like "Orchestrated" or "Spearheaded".</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Stats - Hidden on mobile to save space, visible on larger screens */}
                            <div className="hidden sm:flex w-48 lg:w-64 bg-white border-l border-gray-100 p-4 flex-col">
                                <div className="text-[10px] lg:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">ATS Analysis</div>

                                {/* Score Meter - Extracted Component */}
                                <ScoreCounter />

                                {/* Keyword List */}
                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center justify-between text-[10px] lg:text-xs">
                                        <span className="text-gray-600">Keywords</span>
                                        <span className="text-green-600 font-medium">8/10</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className="bg-green-500 h-1.5 rounded-full w-[80%]"></div>
                                    </div>
                                </div>

                                <div className="mt-auto bg-blue-50 p-2 lg:p-3 rounded-lg border border-blue-100">
                                    <p className="text-[9px] lg:text-[10px] text-blue-700 font-medium leading-tight">
                                        Resume passing ATS.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decor elements behind mockup */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                </motion.div>
            </div>
        </div>
    );
};

export default HomeHero;
