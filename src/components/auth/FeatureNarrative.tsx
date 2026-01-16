import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Layout } from 'lucide-react';

const FEATURES = [
    {
        title: "AI-Powered Tailoring",
        description: "Match your skills to any JD with surgical precision. Our AI identifies gaps and bridges them instantly.",
        icon: Wand2,
        status: "UPCOMING",
        statusColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        iconBg: "bg-blue-600/20 text-blue-400"
    },
    {
        title: "Smart Job Tracker",
        description: "A dedicated CRM for your career. Manage every lead, follow-up, and offer in one central pipeline.",
        icon: Layout,
        status: "LIVE",
        statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        iconBg: "bg-purple-600/20 text-purple-400"
    }
];

export const FeatureNarrative = () => {
    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            {FEATURES.map((feature, i) => (
                <FeatureCard key={i} data={feature} index={i} />
            ))}
        </div>
    );
};

const FeatureCard = ({ data, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 + (index * 0.15), duration: 0.5 }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:bg-white/10 transition-colors duration-300"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${data.iconBg}`}>
                <data.icon size={20} />
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${data.statusColor}`}>
                {data.status}
                {data.status === 'LIVE' && (
                    <span className="relative flex h-2 w-2 inline-flex ml-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                )}
            </span>
        </div>
        <h3 className="text-lg font-semibold text-white tracking-tight">{data.title}</h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            {data.description}
        </p>
    </motion.div>
);
