import React from 'react';
import { ResumeData } from '../../types';
import { GripVertical, Plus, Trash2, Lightbulb, ChevronDown, ChevronRight, Wand2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ResumeFormProps {
    resumeData: ResumeData;
    updateSection: (section: keyof ResumeData, data: any) => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, updateSection }) => {

    // Helper to update personal info
    const updatePersonalInfo = (field: string, value: string) => {
        updateSection('personalInfo', { ...resumeData.personalInfo, [field]: value });
    };

    // AI Highlight Interaction (Mock)
    const handleAIAssist = () => {
        toast.message("AI Analysis: 'Worked on code'", {
            description: "Weak verb detected. Try 'Engineered' or 'Architected' instead.",
            action: {
                label: "Apply 'Engineered'",
                onClick: () => console.log("Applied")
            }
        });
    };

    return (
        <div className="flex-1 bg-gray-50 h-full overflow-y-auto p-6 space-y-8 pb-32">

            {/* Personal Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                        <input
                            value={resumeData.personalInfo.fullName}
                            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                        <input
                            value={resumeData.personalInfo.email}
                            onChange={(e) => updatePersonalInfo('email', e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. john@example.com"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                        <input
                            value={resumeData.personalInfo.phone}
                            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. +1 555-0123"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">LinkedIn</label>
                        <input
                            value={resumeData.personalInfo.linkedin || ''}
                            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="linkedin.com/in/johndoe"
                        />
                    </div>
                </div>
            </div>

            {/* Summary with AI */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Professional Summary</h3>
                    <button onClick={handleAIAssist} className="text-blue-600 bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition-colors" title="AI Assist">
                        <Lightbulb size={20} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">2</span>
                    </button>
                </div>
                <div className="relative">
                    <textarea
                        value={resumeData.summary}
                        onChange={(e) => updateSection('summary', e.target.value)}
                        className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm leading-relaxed"
                        placeholder="Briefly describe your professional background..."
                    />
                    {!resumeData.summary && (
                        <div className="absolute top-3 left-3 text-gray-400 pointer-events-none text-sm leading-relaxed">
                            Passionate Software Engineer with 5+ years of experience in building scalable web applications...
                        </div>
                    )}
                </div>
                <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
                    <Wand2 size={12} />
                    <span>Pro Tip: Type <strong>//</strong> to generate content with AI</span>
                </div>
            </div>

            {/* Experience Section */}
            <SectionForm
                title="Experience"
                items={resumeData.experience}
                onUpdate={(items) => updateSection('experience', items)}
                itemTemplate={{ title: '', company: '', duration: '', description: '' }}
                fields={[
                    { key: 'title', label: 'Job Title', placeholder: 'Senior Developer' },
                    { key: 'company', label: 'Company', placeholder: 'Tech Corp' },
                    { key: 'duration', label: 'Duration', placeholder: '2020 - Present' },
                    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Led a team of...' }
                ]}
            />

            {/* Education Section */}
            <SectionForm
                title="Education"
                items={resumeData.education}
                onUpdate={(items) => updateSection('education', items)}
                itemTemplate={{ school: '', degree: '', year: '' }}
                fields={[
                    { key: 'school', label: 'School / University', placeholder: 'Stanford University' },
                    { key: 'degree', label: 'Degree', placeholder: 'B.S. Computer Science' },
                    { key: 'year', label: 'Year', placeholder: '2016 - 2020' },
                ]}
            />

            {/* Skills Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Skills</h3>
                <textarea
                    value={resumeData.skills.join(', ')}
                    onChange={(e) => updateSection('skills', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="React, TypeScript, Node.js (comma separated)"
                />
            </div>
        </div>
    );
};

interface SectionFormProps {
    title: string;
    items: any[];
    onUpdate: (items: any[]) => void;
    itemTemplate: any;
    fields: { key: string; label: string; placeholder?: string; type?: string }[];
}

// Generic Section Form Component
const SectionForm: React.FC<SectionFormProps> = ({ title, items, onUpdate, itemTemplate, fields }) => {
    const [expanded, setExpanded] = React.useState<number | null>(0);

    const addItem = () => {
        onUpdate([...items, { ...itemTemplate }]);
        setExpanded(items.length);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        onUpdate(newItems);
        setExpanded(null);
    };

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onUpdate(newItems);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <GripVertical size={20} className="text-gray-400 cursor-grab" />
                    {title}
                </h3>
                <Button onClick={addItem} size="sm" variant="outline" className="text-xs gap-1 h-8">
                    <Plus size={14} /> Add
                </Button>
            </div>

            <div className="divide-y divide-gray-100">
                {items.map((item: any, index: number) => (
                    <div key={index} className="group">
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setExpanded(expanded === index ? null : index)}
                        >
                            <div className="font-medium text-sm text-gray-700">
                                {item[fields[0].key] || `New ${title}`}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 opacity-0 group-hover:opacity-100 p-1 h-auto"
                                    onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                                >
                                    <Trash2 size={14} />
                                </Button>
                                {expanded === index ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                            </div>
                        </div>

                        <AnimatePresence>
                            {expanded === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 pt-0 grid grid-cols-1 gap-4 bg-gray-50/50 pb-6 border-t border-gray-100">
                                        {fields.map((field: any) => (
                                            <div key={field.key} className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500 uppercase">{field.label}</label>
                                                {field.type === 'textarea' ? (
                                                    <textarea
                                                        value={item[field.key] || ''}
                                                        onChange={(e) => updateItem(index, field.key, e.target.value)}
                                                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                        rows={3}
                                                        placeholder={field.placeholder}
                                                    />
                                                ) : (
                                                    <input
                                                        value={item[field.key] || ''}
                                                        onChange={(e) => updateItem(index, field.key, e.target.value)}
                                                        placeholder={field.placeholder}
                                                        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm italic">
                        No {title.toLowerCase()} added yet. Click "Add" to start.
                    </div>
                )}
            </div>
        </div>
    );
};
