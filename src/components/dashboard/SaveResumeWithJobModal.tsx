import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building, Briefcase, FileText, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface SaveResumeWithJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (jobDetails: JobDetails) => void;
    resumeTitle: string;
}

export interface JobDetails {
    company: string;
    role: string;
    description?: string;
    jobUrl?: string;
    deadline?: string;
    notes?: string;
}

const SaveResumeWithJobModal: React.FC<SaveResumeWithJobModalProps> = ({
    isOpen,
    onClose,
    onSave,
    resumeTitle
}) => {
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [jobUrl, setJobUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!company.trim() || !role.trim()) {
            return; // Validation
        }

        onSave({
            company: company.trim(),
            role: role.trim(),
            jobUrl: jobUrl.trim() || undefined
        });

        // Reset form
        setCompany('');
        setRole('');
        setJobUrl('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FileText className="text-blue-600" size={24} />
                                    Save Resume & Track Job
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Resume: <span className="font-medium text-gray-700">{resumeTitle}</span>
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Info Banner */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    💡 <strong>Tip:</strong> Add target company and role to create a tracking card in your "Wishlist / Saved" column!
                                </p>
                            </div>

                            {/* Required Fields */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    Target Job Details <span className="text-red-500">*</span>
                                </h3>

                                {/* Company Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Building size={16} className="inline mr-2 text-gray-500" />
                                        Target Company <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        placeholder="e.g., Google, Microsoft, Startup Inc."
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Job Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Briefcase size={16} className="inline mr-2 text-gray-500" />
                                        Target Role <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="e.g., UX Engineer, Product Designer, Senior Developer"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Optional Fields */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    Additional Information (Optional)
                                </h3>

                                {/* Job URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <LinkIcon size={16} className="inline mr-2 text-gray-500" />
                                        Job Posting URL
                                    </label>
                                    <input
                                        type="url"
                                        value={jobUrl}
                                        onChange={(e) => setJobUrl(e.target.value)}
                                        placeholder="https://company.com/careers/job-id"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!company.trim() || !role.trim()}
                                >
                                    Save Resume
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SaveResumeWithJobModal;
