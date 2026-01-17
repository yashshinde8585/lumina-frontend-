import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, LayoutDashboard, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeFeatureShowcase = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[40%] h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Two powerful tools. <br />
                        <span className="text-blue-600">One complete workflow.</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Stop switching between AI tools and spreadsheets. Build your resume and track its success in the same place.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* Left Feature: Resume Builder (Dark Mode Luxe) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="group relative rounded-2xl bg-white p-8 sm:p-10 overflow-hidden border border-gray-100 shadow-xl"
                    >
                        {/* Abstract Background */}
                        {/* Abstract Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-6">
                                    <Wand2 size={12} /> Resume Builder
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Target every application.</h3>
                                <p className="text-gray-500 leading-relaxed mb-8 text-sm sm:text-base">
                                    Our AI analyzes job descriptions in real-time, rewriting your bullets to match keywords and pass ATS filters.
                                </p>
                            </div>

                            {/* Visual Representation */}
                            {/* Visual Representation */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm group-hover:shadow-md transition-shadow mt-4">
                                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-xs font-mono text-gray-500">ATS_SCORE</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-600">92/100</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <div className="w-4 h-4 rounded border border-gray-200 flex items-center justify-center text-green-600 bg-green-50">✓</div>
                                        <span>Matches "Project Management"</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <div className="w-4 h-4 rounded border border-gray-200 flex items-center justify-center text-green-600 bg-green-50">✓</div>
                                        <span>Action Verb "Orchestrated" included</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <div className="w-4 h-4 rounded border border-gray-200 bg-gray-50"></div>
                                        <span>Skill "React.js" missing</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Feature: Tracker (Modern Minimalist) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="group relative rounded-2xl bg-white p-8 sm:p-10 overflow-hidden border border-gray-100 shadow-xl"
                    >
                        {/* Abstract Background */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium mb-6">
                                    <LayoutDashboard size={12} /> Job Tracker
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">No more spreadsheets.</h3>
                                <p className="text-gray-500 leading-relaxed mb-8 text-sm sm:text-base">
                                    Visualize your pipeline. Move applications from "Applied" to "Interview" with a simple drag-and-drop board.
                                </p>
                            </div>

                            {/* Visual Representation */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm group-hover:shadow-md transition-shadow mt-4">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">APPLIED</div>
                                        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">REVIEW</div>
                                        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700">APTITUDE</div>
                                        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700">TECHNICAL</div>
                                        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700">INTERVIEW</div>
                                        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700">OFFER</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-6 gap-2">
                                    <div className="bg-blue-50/50 rounded-lg p-1 border border-dashed border-blue-200 h-16">
                                        <div className="w-full h-1.5 bg-blue-200 rounded mb-1"></div>
                                        <div className="w-2/3 h-1.5 bg-blue-100 rounded"></div>
                                    </div>
                                    <div className="bg-indigo-50/50 rounded-lg p-1 border border-dashed border-indigo-200 h-16"></div>
                                    <div className="bg-cyan-50/50 rounded-lg p-1 border border-dashed border-cyan-200 h-16"></div>
                                    <div className="bg-orange-50/50 rounded-lg p-1 border border-dashed border-orange-200 h-16"></div>
                                    <div className="bg-purple-50 rounded-lg p-1 border border-purple-100 h-16 shadow-sm">
                                        <div className="w-full h-full bg-white rounded border border-purple-200 flex items-center justify-center">
                                            <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                                <Target size={8} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-green-50/50 rounded-lg p-1 border border-dashed border-green-200 h-16"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom CTA */}


            </div>
        </section>
    );
};

export default HomeFeatureShowcase;
