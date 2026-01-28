import React, { useState, useMemo, useCallback } from 'react';
import { Search, Calendar, SlidersHorizontal, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { KanbanColumn } from './board/KanbanColumn';
import { TRACKING_COLUMNS, COLUMN_ORDER, INITIAL_COLUMNS } from '../../utils/constants';
import { JobCard, BoardColumn } from '../../types';
import { resumeService } from '../../services/resumeService';

// --- Main Component ---
interface JobBoardProps {
    columns: BoardColumn[];
    setColumns: React.Dispatch<React.SetStateAction<BoardColumn[]>>;
    onJobClick: (job: JobCard) => void;
    highlightColumnId?: string | null;
    children?: React.ReactNode;
    onScheduleRound?: (job: JobCard, columnId: string) => void;
}

const JobBoard: React.FC<JobBoardProps> = ({ columns, setColumns, onJobClick, highlightColumnId, children, onScheduleRound }) => {
    // Filters State
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days'>('all');
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [resumeFilter] = useState<'all' | 'linked' | 'missing'>('all');
    const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(INITIAL_COLUMNS.map(c => c.id));
    const [showColumnMenu, setShowColumnMenu] = useState(false);

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

    const handleMoveToNext = useCallback((item: JobCard, currentColumnId: string) => {
        const columnOrder = COLUMN_ORDER;
        const currentIndex = columnOrder.indexOf(currentColumnId);

        if (currentIndex === -1 || currentIndex >= columnOrder.length - 1) {
            return;
        }

        const nextColumnId = columnOrder[currentIndex + 1];

        setColumns(prev => prev.map(col => {
            if (col.id === currentColumnId) {
                return { ...col, items: col.items.filter(i => String(i.id) !== String(item.id)) };
            }
            if (col.id === nextColumnId) {
                const isTracking = TRACKING_COLUMNS.includes(nextColumnId);

                // Track History - Only add if status actually changed
                const history = item.history || [];
                const lastStatus = history.length > 0 ? history[history.length - 1].status : null;

                let updatedHistory = history;
                if (lastStatus !== nextColumnId) {
                    updatedHistory = [...history, {
                        status: nextColumnId,
                        date: new Date().toISOString(),
                        type: 'status_change' as const
                    }];
                }

                const newItem: JobCard = {
                    ...item,
                    date: isTracking ? new Date() : item.date,
                    history: updatedHistory
                };

                return { ...col, items: [newItem, ...col.items] };
            }
            return col;
        }));

        const nextColumnTitle = INITIAL_COLUMNS.find(c => c.id === nextColumnId)?.title || 'next stage';

        // Professional Toast Logic
        const getToastMessage = (statusId: string, company: string) => {
            switch (statusId) {
                case 'applied': return `Application submitted to ${company}.`;
                case 'screening': return `${company} is currently screening your profile.`;
                case 'aptitude': return `Aptitude assessment scheduled for ${company}.`;
                case 'technical': return `Technical interview scheduled with ${company}.`;
                case 'interview': return `Interview round confirmed with ${company}.`;
                case 'offer': return `Congratulations! Offer received from ${company}.`;
                case 'rejected': return `Application for ${company} has been closed.`;
                default: return `Moved ${company} to ${nextColumnTitle}`;
            }
        };

        toast.success(getToastMessage(nextColumnId, item.company));

        // Check if we should ask to schedule a round
        const roundTypes = ['aptitude', 'technical', 'interview', 'screening'];
        if (roundTypes.includes(nextColumnId) && onScheduleRound) {
            onScheduleRound(item, nextColumnId);
        }
    }, [setColumns, onScheduleRound]);

    const handleDeleteJob = useCallback((jobId: string) => {
        // Find the job to see if it has a linked resume
        let resumeIdToDelete: string | number | undefined;
        columns.forEach(col => {
            const item = col.items.find(i => String(i.id) === String(jobId));
            if (item) {
                resumeIdToDelete = item.linkedResumeId;
            }
        });

        if (resumeIdToDelete) {
            resumeService.deleteResume(resumeIdToDelete).catch(err => {
                console.error("Failed to delete linked resume from Cloudinary:", err);
            });
        }

        setColumns(prev => prev.map(col => ({
            ...col,
            items: col.items.filter(item => String(item.id) !== String(jobId))
        })));
        toast.success("Job application removed");
    }, [columns, setColumns]);

    const handleStatusChange = useCallback((item: JobCard, oldColumnId: string, newColumnId: string) => {
        if (oldColumnId === newColumnId) return;

        setColumns(prev => {
            const newCols = prev.map(col => {
                if (col.id === oldColumnId) {
                    return { ...col, items: col.items.filter(i => String(i.id) !== String(item.id)) };
                }
                if (col.id === newColumnId) {
                    const isTracking = TRACKING_COLUMNS.includes(newColumnId);

                    // Track History
                    const history = item.history || [];
                    const lastStatus = history.length > 0 ? history[history.length - 1].status : null;

                    let updatedHistory = history;
                    if (lastStatus !== newColumnId) {
                        updatedHistory = [...history, {
                            status: newColumnId,
                            date: new Date().toISOString(),
                            type: 'status_change' as const
                        }];
                    }

                    const newItem: JobCard = {
                        ...item,
                        date: isTracking ? new Date() : item.date,
                        history: updatedHistory
                    };
                    return { ...col, items: [newItem, ...col.items] };
                }
                return col;
            });
            return newCols;
        });

        const nextColumnTitle = INITIAL_COLUMNS.find(c => c.id === newColumnId)?.title || 'new stage';
        toast.success(`Moved to ${nextColumnTitle}`);
    }, [setColumns]);

    return (
        <div id="job-board" className="mt-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-1 sm:px-2 mb-6 gap-4 sm:gap-4">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Applications Board
                </h2>

                {/* Filter Bar */}
                <div
                    className="w-full sm:w-auto flex flex-row items-center justify-between sm:justify-end gap-3"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Search */}
                    <div className="relative flex-1 sm:w-60">
                        <Search size={16} className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-8 sm:pl-9 pr-2 sm:pr-3 py-1.5 sm:py-2 text-sm border-none bg-white shadow-sm ring-1 ring-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Actions Wrapper */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Date Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDateFilter(!showDateFilter)}
                                className={`p-2 text-gray-400 hover:text-blue-600 bg-white hover:bg-blue-50 ring-1 ring-gray-200 hover:ring-blue-200 rounded-xl transition-all shadow-sm ${dateFilter !== 'all' ? 'text-blue-600 bg-blue-50 ring-blue-200' : ''}`}
                                title="Filter Date"
                            >
                                <Calendar size={18} strokeWidth={2.5} />
                            </button>

                            {/* Custom Dropdown */}
                            {showDateFilter && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-1 space-y-0.5">
                                        {[
                                            { value: 'all', label: 'All Time Overview' },
                                            { value: '7days', label: 'Past 7 Days' },
                                            { value: '30days', label: 'Past 30 Days' }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setDateFilter(option.value as any);
                                                    setShowDateFilter(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors flex items-center justify-between
                                            ${dateFilter === option.value
                                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {option.label}
                                                {dateFilter === option.value && <CheckCircle size={14} className="text-blue-600" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Backdrop to close */}
                            {showDateFilter && (
                                <div className="fixed inset-0 z-40" onClick={() => setShowDateFilter(false)}></div>
                            )}
                        </div>

                        {/* Column Visibility Toggle */}
                        <div className="relative">
                            <button
                                onClick={() => setShowColumnMenu(!showColumnMenu)}
                                className={`p-2 text-gray-400 hover:text-blue-600 bg-white hover:bg-blue-50 ring-1 ring-gray-200 hover:ring-blue-200 rounded-xl transition-all shadow-sm ${showColumnMenu ? 'text-blue-600 bg-blue-50 ring-blue-200' : ''}`}
                                title="Manage Columns"
                            >
                                <SlidersHorizontal size={18} strokeWidth={2.5} />
                            </button>

                            {showColumnMenu && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-1 space-y-0.5 max-h-[400px] overflow-y-auto custom-scrollbar">
                                        <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Visible Columns
                                        </div>
                                        {INITIAL_COLUMNS.map((col: any) => (
                                            <label
                                                key={col.id}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm
                                            ${visibleColumnIds.includes(col.id) ? 'bg-blue-50/50 text-gray-900' : 'hover:bg-gray-50 text-gray-600'}
                                            `}
                                            >
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
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                                                />
                                                {col.title}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Backdrop to close */}
                            {showColumnMenu && (
                                <div className="fixed inset-0 z-40" onClick={() => setShowColumnMenu(false)}></div>
                            )}
                        </div>
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

                <div className="overflow-x-auto pb-6 px-1 pt-2 [transform:rotateX(180deg)] scrollbar-hide">
                    <div className="flex gap-4 min-w-[1000px] [transform:rotateX(180deg)] pb-4">
                        {filteredColumns.map((col) => (
                            <KanbanColumn
                                key={col.id}
                                col={col}
                                highlightColumnId={highlightColumnId || null}
                                onJobClick={onJobClick}
                                onMoveToNext={handleMoveToNext}
                                onDeleteJob={handleDeleteJob}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default JobBoard;
