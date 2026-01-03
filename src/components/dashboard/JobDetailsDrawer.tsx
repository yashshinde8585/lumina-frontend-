import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, FileText, CheckSquare, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { JobCard } from './JobBoard';

interface JobDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    job: JobCard | null;
    resumes?: { id: number; title: string }[];
    onLinkResume?: (jobId: string, resumeId: number) => void;
    onUpdateNotes?: (jobId: string, notes: string) => void;
    onUpdateDescription?: (jobId: string, description: string) => void;
}

const JobDetailsDrawer: React.FC<JobDetailsDrawerProps> = ({
    isOpen,
    onClose,
    job,
    resumes = [],
    onLinkResume,
    onUpdateNotes,
    onUpdateDescription
}) => {
    if (!job) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                                        <img
                                            src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s/g, '')}.com`}
                                            alt={job.company}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${job.company}&background=random&size=48`;
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{job.role}</h2>
                                        <p className="text-blue-600 font-medium">{job.company}</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-8">

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Calendar size={12} /> Applied Date</span>
                                    <p className="font-semibold text-gray-800">{new Date(job.date).toLocaleDateString()}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><DollarSign size={12} /> Salary Range</span>
                                    <p className="font-semibold text-gray-800">{job.salary || 'Not specified'}</p>
                                </div>
                            </div>

                            {/* Resume Linking */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <FileText size={16} className="text-blue-500" /> Linked Resume
                                </h3>
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                    {job.linkedResumeId ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-white p-2 rounded shadow-sm">
                                                    <FileText size={20} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-blue-900">
                                                        {resumes.find(r => r.id === job.linkedResumeId)?.title || "Linked Resume"}
                                                    </p>
                                                    <p className="text-xs text-blue-600">Click to open PDF</p>
                                                </div>
                                            </div>
                                            <Button variant="secondary" size="sm" onClick={() => onLinkResume?.(job.id, 0)}>Unlink</Button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-sm text-blue-800 mb-3">Tailor your application! Link the specific resume you used.</p>
                                            <select
                                                className="w-full p-2 border border-blue-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onChange={(e) => {
                                                    if (e.target.value) onLinkResume?.(job.id, Number(e.target.value));
                                                }}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Select a resume...</option>
                                                {resumes.map(r => (
                                                    <option key={r.id} value={r.id}>{r.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Job Description Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <FileText size={16} className="text-gray-500" /> Job Description
                                </h3>
                                <textarea
                                    className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none font-mono text-gray-700"
                                    placeholder="Paste the job description here to enable AI tailoring..."
                                    value={job.description || ''}
                                    onChange={(e) => onUpdateDescription?.(job.id, e.target.value)}
                                />
                            </div>

                            {/* Notes Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckSquare size={16} className="text-gray-500" /> My Notes
                                </h3>
                                <textarea
                                    className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                    placeholder="Recruiter name, key details, or interview thoughts..."
                                    value={job.notes || ''}
                                    onChange={(e) => onUpdateNotes?.(job.id, e.target.value)}
                                />
                            </div>

                            {/* Timeline / History (Mock for now) */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Clock size={16} className="text-gray-500" /> Activity Log
                                </h3>
                                <div className="space-y-4 relative pl-4 border-l-2 border-gray-100 ml-2">
                                    <div className="relative">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full absolute -left-[21px] top-1.5 border-2 border-white box-content"></div>
                                        <p className="text-sm text-gray-800">Moved to <span className="font-semibold">Screening</span></p>
                                        <p className="text-xs text-gray-400">Just now</p>
                                    </div>
                                    <div className="relative">
                                        <div className="w-3 h-3 bg-gray-300 rounded-full absolute -left-[21px] top-1.5 border-2 border-white box-content"></div>
                                        <p className="text-sm text-gray-800">Job Added to Tracker</p>
                                        <p className="text-xs text-gray-400">{new Date(job.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer actions */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0">
                            <div className="flex gap-3">
                                <Button className="w-full flex justify-center items-center gap-2">
                                    Save Changes
                                </Button>
                            </div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default JobDetailsDrawer;
