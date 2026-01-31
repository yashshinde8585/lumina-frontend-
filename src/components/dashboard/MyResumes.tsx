import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Search, FileText, MoreVertical, Edit, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Resume } from '../../types';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface DraggableResumeCardProps {
    resume: Resume;
    onEdit: (resume: Resume) => void;
    onDelete: (id: number) => void;
    onRename: (resume: Resume) => void;

}

const DraggableResumeCard = ({ resume, onEdit, onDelete, onRename }: DraggableResumeCardProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: resume.id.toString(),
        data: {
            type: 'RESUME',
            item: resume
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    const [menuOpen, setMenuOpen] = useState(false);

    // Helper function to determine icon color based on resume title
    const getIconColor = (title: string): { bg: string; text: string } => {
        const lowerTitle = title.toLowerCase();

        // Frontend roles - Blue
        if (lowerTitle.includes('frontend') || lowerTitle.includes('react') || lowerTitle.includes('ui') || lowerTitle.includes('ux')) {
            return { bg: 'bg-blue-50', text: 'text-blue-600' };
        }
        // Backend roles - Green
        if (lowerTitle.includes('backend') || lowerTitle.includes('api') || lowerTitle.includes('server') || lowerTitle.includes('node')) {
            return { bg: 'bg-green-50', text: 'text-green-600' };
        }
        // Full Stack - Purple
        if (lowerTitle.includes('full') || lowerTitle.includes('fullstack') || lowerTitle.includes('full-stack')) {
            return { bg: 'bg-purple-50', text: 'text-purple-600' };
        }
        // DevOps/Cloud - Orange
        if (lowerTitle.includes('devops') || lowerTitle.includes('cloud') || lowerTitle.includes('aws') || lowerTitle.includes('kubernetes')) {
            return { bg: 'bg-orange-50', text: 'text-orange-600' };
        }
        // Data/ML - Indigo
        if (lowerTitle.includes('data') || lowerTitle.includes('ml') || lowerTitle.includes('machine learning') || lowerTitle.includes('ai')) {
            return { bg: 'bg-indigo-50', text: 'text-indigo-600' };
        }
        // Mobile - Pink
        if (lowerTitle.includes('mobile') || lowerTitle.includes('ios') || lowerTitle.includes('android') || lowerTitle.includes('react native')) {
            return { bg: 'bg-pink-50', text: 'text-pink-600' };
        }
        // Default - Blue
        return { bg: 'bg-blue-50', text: 'text-blue-600' };
    };

    const iconColors = getIconColor(resume.title);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative bg-white rounded-xl p-4 border transition-all duration-300 hover:shadow-lg border-silver
                } ${isDragging ? 'shadow-2xl scale-105 z-50 cursor-grabbing' : ''}`}
        >
            {/* Status Badge */}


            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    {/* Drag Handle */}
                    <div
                        {...listeners}
                        {...attributes}
                        className="mt-1 text-steel/50 hover:text-blue-500 cursor-grab active:cursor-grabbing p-1 -ml-2 rounded hover:bg-mist transition-colors"
                    >
                        <GripVertical size={16} />
                    </div>

                    {/* Icon & Details */}
                    <div>
                        <div
                            className={`${iconColors.bg} w-10 h-10 rounded-lg flex items-center justify-center ${iconColors.text} mb-3 cursor-pointer hover:scale-105 transition-transform`}
                            onClick={() => onEdit(resume)}
                        >
                            <FileText size={20} />
                        </div>

                        <h3
                            className="font-bold text-charcoal group-hover:text-blue-600 transition-colors cursor-pointer truncate max-w-[160px]"
                            onClick={() => onEdit(resume)}
                            title={resume.title}
                        >
                            {resume.title}
                        </h3>
                        <p className="text-xs text-steel mt-0.5">
                            Edited {new Date(resume.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Actions Menu */}
                <div className="relative">
                    <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                        className="p-1.5 text-steel hover:text-charcoal hover:bg-mist rounded-lg transition-colors"
                    >
                        <MoreVertical size={16} />
                    </button>

                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-silver py-1 z-10"
                                onClick={(e) => e.stopPropagation()}
                                onMouseLeave={() => setMenuOpen(false)}
                            >
                                <button onClick={() => { onEdit(resume); setMenuOpen(false); }} className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 text-charcoal flex items-center gap-2">
                                    <Edit size={12} /> Edit
                                </button>
                                <button onClick={() => { onRename(resume); setMenuOpen(false); }} className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 text-charcoal flex items-center gap-2">
                                    <FileText size={12} /> Rename
                                </button>
                                <div className="h-px bg-mist my-1" />
                                <button onClick={() => { onDelete(resume.id); setMenuOpen(false); }} className="w-full px-3 py-2 text-left text-xs hover:bg-red-50 text-red-600 flex items-center gap-2">
                                    <Trash2 size={12} /> Delete
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

interface MyResumesProps {
    resumes: Resume[];
    loading: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortBy: 'date' | 'name';
    setSortBy: (sort: 'date' | 'name') => void;
    onCreateNew: () => void;
    onEdit: (resume: Resume) => void;
    onDelete: (id: number) => void;
    onRename: (resume: Resume) => void;

}

const MyResumes = ({
    resumes,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    onCreateNew,
    onEdit,
    onDelete,
    onRename,

}: MyResumesProps) => {

    const filteredResumes = resumes
        .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'date') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            return a.title.localeCompare(b.title);
        });

    return (
        <section className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-charcoal">My Resumes</h2>
                    <p className="text-steel text-sm mt-1">Manage and track your different resume versions</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-steel group-focus-within:text-blue-600 transition-colors" size={16} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search resumes..."
                            className="pl-9 pr-4 py-2 bg-white border border-silver rounded-lg text-sm text-charcoal focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-full md:w-64 transition-all"
                        />
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                        className="px-3 py-2 bg-white border border-silver rounded-lg text-sm text-charcoal outline-none focus:border-blue-500 cursor-pointer hover:bg-mist transition-colors"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="name">Sort by Name</option>
                    </select>

                    <Button onClick={onCreateNew} className="shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow flex items-center">
                        <Plus size={18} className="mr-2" /> New Resume
                    </Button>
                </div>
            </div>

            {/* Resume Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-12 bg-white/50 rounded-2xl border border-dashed border-silver">
                    <div className="flex flex-col items-center gap-3 text-steel">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                        <span className="text-sm font-medium">Loading your resumes...</span>
                    </div>
                </div>
            ) : filteredResumes.length === 0 ? (
                <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-silver flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-400 mb-4">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-charcoal mb-1">No resumes found</h3>
                    <p className="text-steel mb-6 max-w-xs mx-auto">
                        {searchQuery ? "Try adjusting your search terms." : "Create your first resume to get started building your career."}
                    </p>
                    {searchQuery ? (
                        <Button variant="outline" onClick={() => setSearchQuery('')}>Clear Search</Button>
                    ) : (
                        <Button onClick={onCreateNew}>
                            <Plus size={18} className="mr-2" /> Create Resume
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResumes.map(resume => (
                        <DraggableResumeCard
                            key={resume.id}
                            resume={resume}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onRename={onRename}

                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default MyResumes;
