import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import { TextArea } from '../ui/TextArea';
import { SafeHTML } from '../ui/SafeHTML';

// Shared Props - removed strict shared interface as signatures differ
interface BaseSectionProps {
    accentColor: string;
    isCompact: boolean;
}

// SectionSummary
interface SectionSummaryProps extends BaseSectionProps {
    data: string;
    update: (field: string, value: string) => void;
}

export const SectionSummary: React.FC<SectionSummaryProps> = ({ data, update }) => (
    <section className="resume-section group relative">
        <h2 className="resume-heading">
            Professional Summary
        </h2>
        <div className="text-sm text-gray-800 leading-relaxed">
            <ReactQuill
                theme="snow"
                value={data || ''}
                onChange={(value) => update('summary', value)}
                modules={{ toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]] }}
                className="print:hidden"
            />
            <SafeHTML className="hidden print:block text-justify" html={data || ''} />
        </div>
    </section>
);

// SectionSkills
interface SectionSkillsProps extends BaseSectionProps {
    skills: string[];
    update: (skills: string[]) => void;
}

export const SectionSkills: React.FC<SectionSkillsProps> = ({ skills, update, isCompact }) => {
    const [isAdding, setIsAdding] = useState(false);

    const saveSkill = (val: string) => {
        if (val && val.trim()) update([...skills, val.trim()]);
        setIsAdding(false);
    };

    const removeSkill = (index: number) => update(skills.filter((_, i) => i !== index));

    return (
        <section className="resume-section">
            <h2 className="resume-heading">
                Skills
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        aria-label="Add new skill"
                        className="text-gray-400 hover:text-green-600 print:hidden focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded p-1"
                    >
                        <Plus size={16} aria-hidden="true" />
                    </button>
                )}
            </h2>
            <div className={`flex flex-wrap gap-2 layout-compact:gap-1`}>
                {skills.length > 0 ? (
                    isCompact ? (
                        <p className="text-sm text-gray-800 leading-snug">
                            {skills.join(', ')}
                            {isAdding ? (
                                <input
                                    autoFocus
                                    className="ml-2 border-b border-gray-300 focus:border-blue-500 outline-none w-24 text-sm"
                                    onBlur={(e) => saveSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveSkill((e.target as HTMLInputElement).value)}
                                    placeholder="New Skill..."
                                />
                            ) : (
                                <button onClick={() => setIsAdding(true)} className="ml-2 text-gray-400 hover:text-green-600 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={10} /></button>
                            )}
                        </p>
                    ) : (
                        <>
                            {skills.map((skill, i) => (
                                <span key={i} className="group relative bg-gray-100 px-3 py-1 rounded text-sm text-gray-800 border border-gray-200">
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(i)}
                                        aria-label={`Remove skill: ${skill}`}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity print:hidden focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        <Trash2 size={12} aria-hidden="true" />
                                    </button>
                                </span>
                            ))}
                            {isAdding && (
                                <input
                                    autoFocus
                                    className="bg-gray-50 px-3 py-1 rounded text-sm text-gray-800 border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    onBlur={(e) => saveSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveSkill((e.target as HTMLInputElement).value)}
                                    placeholder="Type skill..."
                                />
                            )}
                        </>
                    )
                ) : (
                    isAdding ? (
                        <input
                            autoFocus
                            className="bg-gray-50 px-3 py-1 rounded text-sm text-gray-800 border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onBlur={(e) => saveSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveSkill((e.target as HTMLInputElement).value)}
                            placeholder="Type skill..."
                        />
                    ) : (
                        <span className="text-gray-400 italic cursor-pointer" onClick={() => setIsAdding(true)}>Add your top skills...</span>
                    )
                )}
            </div>
        </section>
    );
};

// SectionList
interface FieldMap {
    title: string;
    subtitle?: string;
    date?: string;
    desc?: string;
}

interface SectionListProps extends BaseSectionProps {
    title: string;
    items: any[];
    fieldMap: FieldMap;
    update: (items: any[]) => void;
}

export const SectionList: React.FC<SectionListProps> = ({ title, items, fieldMap, update }) => {
    // Generic handlers
    const handleChange = (index: number, field: string, value: string) => {
        const newArray = [...items];
        newArray[index] = { ...newArray[index], [field]: value };
        update(newArray);
    };
    const add = () => {
        // Create empty object based on keys
        const newItem: any = {};
        // Initialize all known keys to empty string to avoid uncontrolled inputs
        newItem[fieldMap.title] = '...';
        if (fieldMap.subtitle) newItem[fieldMap.subtitle] = '...';
        if (fieldMap.date) newItem[fieldMap.date] = '...';
        if (fieldMap.desc) newItem[fieldMap.desc] = '...';

        update([...items, newItem]);
    };
    const remove = (index: number) => update(items.filter((_, i) => i !== index));

    return (
        <section className="resume-section">
            <h2 className="resume-heading">
                {title}
                <button
                    onClick={add}
                    aria-label={`Add new ${title.toLowerCase()} item`}
                    className="text-gray-400 hover:text-green-600 print:hidden focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded p-1"
                >
                    <Plus size={16} aria-hidden="true" />
                </button>
            </h2>
            <div className={`space-y-4 layout-compact:space-y-2`}>
                {items.map((item, i) => (
                    <div key={i} className={`group relative hover:bg-gray-50 -mx-2 rounded transition-colors break-inside-avoid p-2 layout-compact:p-1`}>
                        <button
                            onClick={() => remove(i)}
                            aria-label={`Remove ${title.toLowerCase()} item`}
                            className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 print:hidden cursor-pointer focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded p-1"
                        >
                            <Trash2 size={16} aria-hidden="true" />
                        </button>

                        <div className={`flex justify-between items-baseline mb-1 layout-compact:mb-0`}>
                            <input
                                value={item[fieldMap.title]}
                                onChange={(e) => handleChange(i, fieldMap.title, e.target.value)}
                                className={`font-bold bg-transparent w-full focus:ring-0 border-none p-0 text-lg layout-compact:text-[11pt]`}
                                placeholder={title}
                            />
                            {fieldMap.date && (
                                <input
                                    value={item[fieldMap.date]}
                                    onChange={(e) => handleChange(i, fieldMap.date!, e.target.value)}
                                    className={`text-gray-600 text-right bg-transparent focus:ring-0 border-none p-0 whitespace-nowrap ml-2 italic text-sm layout-compact:text-[11pt]`}
                                    placeholder="Date"
                                />
                            )}
                        </div>
                        {fieldMap.subtitle && (
                            <input
                                value={item[fieldMap.subtitle]}
                                onChange={(e) => handleChange(i, fieldMap.subtitle!, e.target.value)}
                                className={`font-semibold text-gray-700 mb-1 w-full bg-transparent focus:ring-0 border-none p-0 layout-compact:text-[11pt]`}
                                placeholder="Subtitle"
                            />
                        )}
                        {fieldMap.desc && (
                            <TextArea
                                value={item[fieldMap.desc]}
                                onChange={(e) => handleChange(i, fieldMap.desc!, e.target.value)}
                                className={`w-full text-gray-800 bg-transparent border-none p-0 focus:ring-0 resize-none min-h-[40px] leading-snug text-sm layout-compact:text-[10pt]`}
                                placeholder="Description..."
                            />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
