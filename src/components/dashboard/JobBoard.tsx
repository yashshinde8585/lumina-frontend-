import React, { useState, useMemo, useCallback } from 'react';
import {
    Plus, DollarSign, Building,
    Briefcase, AlertCircle, CheckCircle, XCircle, Clock,
    LayoutList, ChevronDown, X, FileText, Info,
    Search, Calendar, SlidersHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Types ---
export interface JobCard {
    id: string;
    company: string;
    role: string;
    date: Date;
    salary?: string;
    linkedResumeId?: number;
    notes?: string;
    description?: string;
}

export interface BoardColumn {
    id: string;
    title: string;
    color: string;
    items: JobCard[];
}

// --- Helper: Relative Time ---
const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
};

// --- Mock Data ---
export const initialColumns: BoardColumn[] = [
    {
        id: 'saved',
        title: 'Wishlist / Saved',
        color: 'gray',
        items: [
            { id: '1', company: 'Google', role: 'UX Engineer', date: new Date(Date.now() - 172800000) },
            { id: '2', company: 'Spotify', role: 'Product Designer', date: new Date(Date.now() - 259200000) }
        ]
    },
    {
        id: 'applied',
        title: 'Applied',
        color: 'blue',
        items: [
            { id: '3', company: 'Airbnb', role: 'Frontend Dev', date: new Date(Date.now() - 604800000) }
        ]
    },
    {
        id: 'screening',
        color: 'orange',
        title: 'Screening',
        items: [
            { id: '4', company: 'Netflix', role: 'Senior Engineer', date: new Date(Date.now() - 86400000) }
        ]
    },
    {
        id: 'interview',
        title: 'Interview',
        color: 'purple',
        items: []
    },
    {
        id: 'offer',
        title: 'Offer',
        color: 'green',
        items: [
            { id: '5', company: 'Stripe', role: 'Full Stack Engineer', date: new Date(), salary: '$180k' }
        ]
    },
    {
        id: 'rejected',
        title: 'Rejected',
        color: 'red',
        items: []
    }
];

// --- Sortable Item Component ---
interface SortableJobCardProps {
    item: JobCard;
    columnId: string;
    onJobClick: (item: JobCard) => void;
}

export const SortableJobCard = ({ item, columnId, onJobClick }: SortableJobCardProps) => {
    // Determine status badge color/style
    const getStatusStyle = () => {
        if (item.linkedResumeId) return 'bg-white border-blue-200 shadow-blue-100 hover:shadow-blue-200';
        return 'bg-white border-silver hover:shadow-md';
    };

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: item.id,
        data: {
            type: 'JOB',
            item,
            columnId // Pass columnId to know where it came from
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-40 bg-gray-100 p-4 rounded-xl border border-dashed border-gray-400 h-[120px] mb-3"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onJobClick(item)}
            className={`
                group relative p-4 rounded-xl border transition-all duration-300 cursor-grab active:cursor-grabbing mb-3
                ${getStatusStyle()} hover:-translate-y-1
                ${columnId === 'overlay' ? 'shadow-2xl rotate-3 cursor-grabbing bg-white border-blue-400' : 'shadow-sm'}
                glass-panel
            `}
        >
            <div className="flex items-start gap-3 mb-3">
                {/* Auto-Fetched Logo */}
                <div className="w-10 h-10 rounded-lg bg-white p-1 shadow-sm flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                    <img
                        src={`https://logo.clearbit.com/${item.company.toLowerCase().replace(/\s/g, '')}.com`}
                        alt={item.company}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.company}&background=random&size=40`;
                        }}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-charcoal text-sm truncate leading-tight mb-0.5" title={item.role}>{item.role}</h4>
                    <p className="text-xs text-blue-600 truncate font-medium">{item.company}</p>
                </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
                {/* Salary Badge */}
                {item.salary && (
                    <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold border border-green-100">
                        <DollarSign size={10} /> {item.salary}
                    </span>
                )}

                {/* Linked Resume Badge */}
                {item.linkedResumeId ? (
                    <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-100">
                        <FileText size={10} /> Resume Linked
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-100">
                        <AlertCircle size={10} /> Tailor Now
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-steel border-t border-gray-100/50 pt-2 group-hover:border-gray-200 transition-colors">
                <span className="flex items-center gap-1">
                    <Clock size={10} /> {timeAgo(new Date(item.date))}
                </span>

                {/* Match Score Indicator */}
                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity" title="Resume Match Score">
                    <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div
                            className={`h-full rounded-full ${item.linkedResumeId ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gray-300'}`}
                            style={{ width: `${item.linkedResumeId ? '85%' : '20%'}` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Info Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onJobClick(item);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/80 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 shadow-sm"
                title="View Details"
            >
                <Info size={14} className="text-gray-600 hover:text-blue-600" />
            </button>
        </div>
    );
};

// --- Droppable Column ---
interface KanbanColumnProps {
    col: BoardColumn;
    highlightColumnId: string | null;
    onJobClick: (job: JobCard) => void;
    handleAddCard: (id: string) => void;
    submitQuickAdd: (id: string) => void;
    quickAddCol: string | null;
    setQuickAddCol: (id: string | null) => void;
    newJobCompany: string;
    setNewJobCompany: (val: string) => void;
}

const KanbanColumn = ({
    col, highlightColumnId, onJobClick,
    handleAddCard, submitQuickAdd, quickAddCol, setQuickAddCol,
    newJobCompany, setNewJobCompany
}: KanbanColumnProps) => {

    // IMPORTANT: Make the column droppable so we can drag resumes here
    const { setNodeRef, isOver } = useDroppable({
        id: col.id,
        data: {
            type: 'COLUMN',
            columnId: col.id
        }
    });

    const isHighlighted = highlightColumnId === col.id || isOver;

    const getColumnIcon = (id: string, color: string) => {
        const colorClass = `text-${color}-600`;
        switch (id) {
            case 'saved': return <Clock size={16} className={colorClass} />;
            case 'applied': return <Briefcase size={16} className={colorClass} />;
            case 'screening': return <LayoutList size={16} className={colorClass} />;
            case 'interview': return <AlertCircle size={16} className={colorClass} />;
            case 'offer': return <CheckCircle size={16} className={colorClass} />;
            case 'rejected': return <XCircle size={16} className={colorClass} />;
            default: return <Building size={16} className={colorClass} />;
        }
    };

    return (
        <motion.div
            id={`column-${col.id}`}
            className={`w-72 flex-shrink-0 flex flex-col rounded-xl transition-all duration-300 ${isHighlighted ? 'ring-4 ring-blue-200 bg-blue-50/30' : 'glass-panel'}`}
            animate={isHighlighted ? { scale: [1, 1.02, 1] } : {}}
            ref={setNodeRef}
        >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-3 rounded-t-lg bg-mist border-b-2 border-${col.color}-500 mb-2 group hover:bg-white transition-colors`}>
                <div className="flex items-center gap-2">
                    {getColumnIcon(col.id, col.color)}
                    <span className="font-semibold text-charcoal text-sm">{col.title}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.id === 'saved' ? 'bg-gray-100 text-gray-600' : `bg-${col.color}-100 text-${col.color}-700`}`}>
                        {col.items.length}
                    </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleAddCard(col.id)} className="p-1 hover:bg-mist rounded text-steel hover:text-charcoal"><Plus size={14} /></button>
                </div>
            </div>

            {/* Droppable Area (Visual) */}
            <div className={`flex-1 space-y-3 min-h-[150px] max-h-[600px] overflow-y-auto p-2 rounded-lg transition-colors ${isOver ? 'bg-blue-100/50 border-2 border-dashed border-blue-400' : 'bg-mist/30'}`}>
                <SortableContext
                    id={col.id}
                    items={col.items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {/* Quick Add */}
                    {quickAddCol === col.id && (
                        <div className="bg-white p-3 rounded-lg border-2 border-blue-100 shadow-sm mb-3">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Company..."
                                className="w-full text-sm border border-silver rounded px-2 py-1 mb-2"
                                value={newJobCompany}
                                onChange={(e) => setNewJobCompany(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && submitQuickAdd(col.id)}
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setQuickAddCol(null)} className="p-1 text-steel"><X size={14} /></button>
                                <button onClick={() => submitQuickAdd(col.id)} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">Add</button>
                            </div>
                        </div>
                    )}

                    {col.items.map(item => (
                        <SortableJobCard key={item.id} item={item} columnId={col.id} onJobClick={onJobClick} />
                    ))}

                    {col.items.length === 0 && !quickAddCol && !isOver && (
                        <div className="h-32 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50">
                            <p className="text-sm font-medium text-gray-500">Drag items here</p>
                            <p className="text-xs text-gray-400 mt-1">Drop zone</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </motion.div>
    );
};

// --- Main Component ---
interface JobBoardProps {
    columns: BoardColumn[];
    setColumns: React.Dispatch<React.SetStateAction<BoardColumn[]>>;
    onJobClick: (job: JobCard) => void;
    highlightColumnId?: string | null;
    children?: React.ReactNode;
}

const JobBoard: React.FC<JobBoardProps> = ({ columns, setColumns, onJobClick, highlightColumnId, children }) => {
    const [quickAddCol, setQuickAddCol] = useState<string | null>(null);
    const [newJobCompany, setNewJobCompany] = useState('');

    // Filters State
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days'>('all');
    const [resumeFilter, setResumeFilter] = useState<'all' | 'linked' | 'missing'>('all');
    const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(initialColumns.map(c => c.id));
    const [showColumnMenu, setShowColumnMenu] = useState(false);

    // Derived Filtered Columns
    // Derived Filtered Columns
    const filteredColumns = useMemo(() => columns
        .filter(col => visibleColumnIds.includes(col.id))
        .map(col => ({
            ...col,
            items: col.items.filter(item => {
                // Search Filter
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    if (!item.company.toLowerCase().includes(q) && !item.role.toLowerCase().includes(q)) return false;
                }

                // Resume Filter
                if (resumeFilter === 'linked' && !item.linkedResumeId) return false;
                if (resumeFilter === 'missing' && item.linkedResumeId) return false;

                // Date Filter
                if (dateFilter !== 'all') {
                    const now = new Date();
                    const itemDate = new Date(item.date);
                    const diffTime = Math.abs(now.getTime() - itemDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (dateFilter === '7days' && diffDays > 7) return false;
                    if (dateFilter === '30days' && diffDays > 30) return false;
                }

                return true;
            })
        })), [columns, visibleColumnIds, searchQuery, resumeFilter, dateFilter]);

    const handleAddCard = useCallback((colId: string) => {
        setQuickAddCol(colId);
        setNewJobCompany('');
    }, []);

    const submitQuickAdd = useCallback((colId: string) => {
        if (!newJobCompany.trim()) return;

        const newCard: JobCard = {
            id: Date.now().toString(),
            company: newJobCompany,
            role: 'New Role',
            date: new Date()
        };

        setColumns(prev => prev.map(col => {
            if (col.id === colId) {
                return { ...col, items: [newCard, ...col.items] };
            }
            return col;
        }));

        setQuickAddCol(null);
        setNewJobCompany('');
        toast.success(`Added ${newJobCompany} to column`);
    }, [newJobCompany, setColumns]);

    return (
        <div id="job-board" className="mt-8 mb-8 border border-silver rounded-xl bg-white overflow-hidden shadow-sm">
            <div
                className="flex items-center justify-between px-6 py-4 bg-mist/50"
            >
                <div>
                    <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
                        Job Application Tracker
                    </h2>
                    <p className="text-steel text-sm">Visualize your job search pipeline.</p>
                </div>

                {/* Filter Bar (In Header) */}
                <div
                    className="flex items-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Search */}
                    <div className="relative w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-silver rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Date Filter */}
                    <div className="relative">
                        <select
                            className="appearance-none pl-9 pr-8 py-1.5 text-sm border border-silver rounded-lg bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value as any)}
                        >
                            <option value="all">Any Time</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                        </select>
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Resume Status Filter */}
                    <div className="relative">
                        <select
                            className="appearance-none pl-9 pr-8 py-1.5 text-sm border border-silver rounded-lg bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                            value={resumeFilter}
                            onChange={(e) => setResumeFilter(e.target.value as any)}
                        >
                            <option value="all">Status</option>
                            <option value="linked">Resume Ready</option>
                            <option value="missing">Needs Tailoring</option>
                        </select>
                        <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Column Visibility Toggle */}
                    <div className="relative">
                        <button
                            onClick={() => setShowColumnMenu(!showColumnMenu)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-sm border border-silver rounded-lg hover:bg-gray-50 transition-colors ${showColumnMenu ? 'bg-gray-100 ring-2 ring-gray-100' : 'bg-white'}`}
                        >
                            <SlidersHorizontal size={16} className="text-gray-500" />
                        </button>

                        {showColumnMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowColumnMenu(false)}></div>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-silver rounded-xl shadow-xl z-20 overflow-hidden py-1">
                                    {initialColumns.map(col => (
                                        <label key={col.id} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-charcoal">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumnIds.includes(col.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setVisibleColumnIds([...visibleColumnIds, col.id]);
                                                    } else {
                                                        if (visibleColumnIds.length > 1) {
                                                            setVisibleColumnIds(visibleColumnIds.filter(id => id !== col.id));
                                                        } else {
                                                            toast.error("At least one column must be visible");
                                                        }
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            {col.title}
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>


            <div className="overflow-hidden">
                {children && (
                    <>
                        <div className="px-6 pt-6">
                            {children}
                        </div>
                        <div className="border-t border-silver mx-6 mb-6"></div>
                    </>
                )}



                <div className="overflow-x-auto pb-6 px-6 pt-2 [transform:rotateX(180deg)]">
                    <div className="flex gap-4 min-w-[1000px] [transform:rotateX(180deg)]">
                        {filteredColumns.map((col) => (
                            <KanbanColumn
                                key={col.id}
                                col={col}
                                highlightColumnId={highlightColumnId || null}
                                onJobClick={onJobClick}
                                handleAddCard={handleAddCard}
                                submitQuickAdd={submitQuickAdd}
                                quickAddCol={quickAddCol}
                                setQuickAddCol={setQuickAddCol}
                                newJobCompany={newJobCompany}
                                setNewJobCompany={setNewJobCompany}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobBoard;
