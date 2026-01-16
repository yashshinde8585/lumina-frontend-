import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Bot, CheckCircle, Zap, Layout, AlertCircle, ArrowRight } from 'lucide-react';

const HomeFeatures = () => {
    return (
        <div id="features" className="bg-white py-24 md:py-32 border-t border-gray-200 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-20 max-w-3xl">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                        Why ResumeAI beats <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">traditional builders</span>
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Real AI. Real results. Built for modern recruiters and ATS systems.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">

                    {/* 1. AI Intelligence */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-blue-50/50 rounded-3xl p-8 md:p-10 border border-blue-100 overflow-hidden relative group hover:bg-blue-50 transition-colors"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                <Bot size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Resume Intelligence</h3>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-blue-600 mt-1 shrink-0" />
                                    <span>No generic templates. Real job-specific writing.</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-blue-600 mt-1 shrink-0" />
                                    <span>Tailors content from job descriptions</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-blue-600 mt-1 shrink-0" />
                                    <span>Use recruiter-grade action verbs</span>
                                </li>
                            </ul>
                        </div>

                        {/* Realistic UI Fragment */}
                        <div className="absolute right-0 bottom-0 top-1/2 w-full md:w-3/4 translate-y-12 translate-x-8 md:translate-y-0 md:translate-x-12 shadow-2xl rounded-tl-2xl border-t border-l border-gray-200 bg-white p-6 transform rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500">
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="h-2 w-20 bg-gray-200 rounded"></div>
                                    <div className="h-2 w-12 bg-blue-100 rounded"></div>
                                </div>
                                <div className="h-16 bg-blue-50 rounded-lg p-3 text-[10px] text-blue-900 leading-relaxed border border-blue-100">
                                    <span className="font-semibold text-blue-700">AI Suggestion:</span> Rephrase "Managed team" to "Orchestrated a cross-functional team of 15 engineers..."
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <div className="h-6 w-16 bg-gray-100 rounded"></div>
                                    <div className="h-6 w-16 bg-blue-600 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. ATS Engine */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-green-50/50 rounded-3xl p-8 md:p-10 border border-green-100 overflow-hidden relative group hover:bg-green-50 transition-colors"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">ATS Optimization Engine</h3>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-green-600 mt-1 shrink-0" />
                                    <span>Designed to beat resume filters</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-green-600 mt-1 shrink-0" />
                                    <span>Section-by-section ATS health checks</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-green-600 mt-1 shrink-0" />
                                    <span>98% real-world parse success</span>
                                </li>
                            </ul>
                        </div>

                        {/* Realistic UI Fragment */}
                        <div className="absolute right-0 bottom-0 top-1/2 w-full md:w-3/4 translate-y-12 translate-x-8 md:translate-y-8 md:translate-x-12 shadow-2xl rounded-tl-2xl border-t border-l border-gray-200 bg-white p-6 transform rotate-[2deg] group-hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-6">
                                <div className="relative w-20 h-20 shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="50%" cy="50%" r="32" stroke="#f0fdf4" strokeWidth="8" fill="transparent" />
                                        <circle cx="50%" cy="50%" r="32" stroke="#16a34a" strokeWidth="8" fill="transparent" strokeDasharray="200" strokeDashoffset="10" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-green-700 text-lg">98%</div>
                                </div>
                                <div className="space-y-2 w-full">
                                    <div className="text-xs font-semibold text-gray-500 uppercase">Parse Rate</div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[98%]"></div>
                                    </div>
                                    <div className="flex gap-2 text-[10px] text-gray-400">
                                        <span className="text-green-600 font-medium">Keywords Found: 12/12</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. Professional Formatting */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-indigo-50/50 rounded-3xl p-8 md:p-10 border border-indigo-100 overflow-hidden relative group hover:bg-indigo-50 transition-colors"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                                <Layout size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">One-Click Formatting</h3>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-indigo-600 mt-1 shrink-0" />
                                    <span>Your resume, styled in seconds</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-indigo-600 mt-1 shrink-0" />
                                    <span>No broken margins or spacing</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-indigo-600 mt-1 shrink-0" />
                                    <span>Always recruiter-ready layout</span>
                                </li>
                            </ul>
                        </div>

                        {/* Realistic UI Fragment */}
                        <div className="absolute right-0 bottom-0 top-1/2 w-full md:w-3/4 translate-y-12 translate-x-8 md:translate-y-6 md:translate-x-12 shadow-2xl rounded-tl-2xl border-t border-l border-gray-200 bg-white p-6 transform rotate-[-1deg] group-hover:rotate-0 transition-transform duration-500">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="aspect-[3/4] bg-indigo-50 border-2 border-indigo-600 rounded-md p-1">
                                    <div className="h-1 w-full bg-indigo-200 mb-1"></div>
                                    <div className="h-12 w-full bg-white rounded-sm"></div>
                                </div>
                                <div className="aspect-[3/4] bg-white border border-gray-200 rounded-md p-1 opacity-50">
                                    <div className="h-full w-1/3 bg-gray-100 float-left mr-1"></div>
                                    <div className="h-1 w-1/2 bg-gray-200"></div>
                                </div>
                                <div className="aspect-[3/4] bg-white border border-gray-200 rounded-md p-1 opacity-50">
                                    <div className="h-2 w-2 bg-gray-200 rounded-full mx-auto mb-1"></div>
                                    <div className="h-1 w-full bg-gray-100"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 4. Live Feedback */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-amber-50/50 rounded-3xl p-8 md:p-10 border border-amber-100 overflow-hidden relative group hover:bg-amber-50 transition-colors"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Resume Feedback</h3>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-amber-600 mt-1 shrink-0" />
                                    <span>Fix mistakes while you type</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-amber-600 mt-1 shrink-0" />
                                    <span>Grammar, tone & clarity alerts</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-amber-600 mt-1 shrink-0" />
                                    <span>Actionable improvement tips</span>
                                </li>
                            </ul>
                        </div>

                        {/* Realistic UI Fragment */}
                        <div className="absolute right-0 bottom-0 top-1/2 w-full md:w-3/4 translate-y-12 translate-x-8 md:translate-y-8 md:translate-x-12 shadow-2xl rounded-tl-2xl border-t border-l border-gray-200 bg-white p-6 transform rotate-[1deg] group-hover:rotate-0 transition-transform duration-500">
                            <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex gap-3 mb-2">
                                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-bold text-red-700">Passive Voice Detected</p>
                                    <p className="text-[10px] text-red-600">Change "was responsible for" to "Led" or "Managed"</p>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                            <div className="h-2 w-2/3 bg-gray-100 rounded-full mt-2"></div>
                        </div>
                    </motion.div>

                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <Link to="/generate">
                        <Button className="text-lg px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                            Get started free <ArrowRight size={20} className="ml-2 inline" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomeFeatures;
