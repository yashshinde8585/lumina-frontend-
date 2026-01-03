import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Bot, CheckCircle, ArrowRight, Star } from 'lucide-react';

const HomeHowItWorks = () => {
    return (
        <div id="how-it-works" className="py-24 bg-gray-50 relative overflow-hidden border-t border-gray-200">
            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
                    >
                        Let’s build your <br />
                        <span className="text-blue-600">dream resume</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 leading-relaxed"
                    >
                        Our AI analyzes your target job description and highlights the exact skills recruiters search for.
                    </motion.p>
                </div>

                <div className="space-y-24 md:space-y-32">

                    {/* Step 1: Text Left, Image Right */}
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative pl-8 md:pl-0"
                        >
                            <span className="absolute -left-4 md:-left-12 -top-1 font-bold text-6xl md:text-8xl text-blue-100/50 -z-10 select-none">1</span>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Paste the job description</h3>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                Drop the JD from LinkedIn, Naukri or company career pages. We extract the keywords that matter and identify the skills gaps.
                            </p>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">JD Analysis</span>
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">Keyword Extraction</span>
                            </div>
                        </motion.div>

                        {/* Visual 1: JD Analyzer */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="relative max-w-md mx-auto w-full md:mr-auto"
                        >
                            <div className="bg-white rounded-xl shadow-xl shadow-blue-500/5 border border-gray-100 p-6 relative z-10 w-full transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-3">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                        <Bot size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">INPUT</div>
                                        <div className="font-semibold text-gray-900 text-sm">Job Description</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-20 bg-gray-50 rounded-lg border border-gray-100 p-3">
                                        <p className="text-[10px] text-gray-400 font-mono leading-relaxed">
                                            We are looking for a Senior Product Engineer to join our team... <br />
                                            <span className="bg-blue-100 text-blue-700 px-1 rounded">React</span> <span className="bg-blue-100 text-blue-700 px-1 rounded">TypeScript</span> <span className="bg-blue-100 text-blue-700 px-1 rounded">Node.js</span> experience required.
                                        </p>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1">
                                            Analyzing... <span className="animate-spin inline-block w-2 h-2 border-2 border-white/30 border-t-white rounded-full ml-1"></span>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative badge */}
                                <div className="absolute -right-3 -top-3 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full border border-green-200 shadow-sm flex items-center gap-1">
                                    <CheckCircle size={10} /> 12 Skills Found
                                </div>
                            </div>
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl blur-2xl opacity-50 -z-10"></div>
                        </motion.div>
                    </div>

                    {/* Step 2: Image Left, Text Right */}
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">

                        {/* Visual 2: Template Selection (First on Desktop) */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="relative max-w-md mx-auto w-full md:ml-auto md:order-1 order-2"
                        >
                            <div className="bg-white rounded-xl shadow-xl shadow-indigo-500/5 border border-gray-100 p-6 relative z-10 w-full transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="font-bold text-gray-900 text-sm">Select Template</div>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="aspect-[3/4] bg-gray-50 border-2 border-blue-500 rounded-lg shadow-sm relative overflow-hidden group cursor-pointer">
                                        <div className="absolute top-0 w-full h-1 bg-blue-500"></div>
                                        <div className="p-2 space-y-1">
                                            <div className="w-1/2 h-1 bg-gray-200 rounded"></div>
                                            <div className="w-3/4 h-1 bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <CheckCircle size={12} className="text-blue-600" />
                                            </div>
                                        </div>
                                    </div>
                                    {[1, 2].map((i) => (
                                        <div key={i} className="aspect-[3/4] bg-gray-50 border border-gray-100 rounded-lg opacity-60 grayscale relative overflow-hidden">
                                            <div className="p-2 space-y-1">
                                                <div className="w-1/2 h-1 bg-gray-300 rounded"></div>
                                                <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
                                                <div className="w-full h-8 bg-gray-200 rounded mt-2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute -inset-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl blur-2xl opacity-50 -z-10"></div>
                        </motion.div>

                        {/* Text (Second on Desktop) */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative pl-8 md:pl-0 md:order-2 order-1"
                        >
                            <span className="absolute -left-4 md:-left-12 -top-1 font-bold text-6xl md:text-8xl text-purple-100/50 -z-10 select-none">2</span>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Choose your experience & template</h3>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                Select your projects, skills and preferred resume layout. We auto-format everything to ensure perfect margins and spacing.
                            </p>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">Auto-Formatting</span>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">Professional Designs</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Step 3: Text Left, Image Right */}
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative pl-8 md:pl-0"
                        >
                            <span className="absolute -left-4 md:-left-12 -top-1 font-bold text-6xl md:text-8xl text-green-100/50 -z-10 select-none">3</span>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Generate & polish in our AI editor</h3>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                Optimize keywords, formatting and ATS score in real time. Get instant feedback and suggestions to improve your impact.
                            </p>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">Real-time ATS Score</span>
                                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">AI Suggestions</span>
                            </div>
                        </motion.div>

                        {/* Visual 3: Editor & Score */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="relative max-w-md mx-auto w-full md:mr-auto"
                        >
                            <div className="bg-white rounded-xl shadow-xl shadow-green-500/5 border border-gray-100 p-1 relative z-10 w-full transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-gray-50 border-b border-gray-100 p-2 flex items-center justify-between rounded-t-lg">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="bg-white border border-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                        ATS Score: 95 <Star size={8} fill="currentColor" />
                                    </div>
                                </div>
                                <div className="bg-gray-100 p-4 rounded-b-lg">
                                    <div className="bg-white rounded shadow-sm p-4 w-full h-32 relative overflow-hidden">
                                        {/* Content Skeleton */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <div className="w-24 h-2 bg-gray-800 rounded"></div>
                                                <div className="w-16 h-1.5 bg-gray-400 rounded"></div>
                                            </div>
                                            <div className="w-8 h-8 bg-gray-100 rounded"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="w-full h-1.5 bg-gray-100 rounded"></div>
                                            <div className="w-5/6 h-1.5 bg-gray-100 rounded"></div>
                                            <div className="w-4/6 h-1.5 bg-gray-100 rounded"></div>
                                        </div>
                                        {/* Floating Tooltip */}
                                        <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-[9px] px-2 py-1 rounded shadow-lg animate-bounce">
                                            ✨ Optimized!
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -inset-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl blur-2xl opacity-50 -z-10"></div>
                        </motion.div>
                    </div>

                </div>

                {/* Bottom CTA */}
                <div className="mt-24 text-center">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">Ready to see your ATS score improve?</h4>
                    <Link to="/generate">
                        <Button className="text-lg px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto">
                            Get started free <ArrowRight size={20} />
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default HomeHowItWorks;
