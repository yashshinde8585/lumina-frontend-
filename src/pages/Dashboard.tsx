import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button';
import { Logo } from '../components/Logo';
import {
    CheckCircle, FileText,
    User, AlertCircle, ArrowLeft, Settings, Loader2, Edit2
} from 'lucide-react';
import { toast } from 'sonner';
import { useResume } from '../context/ResumeContext';
import { Resume } from '../types';

import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { resumeService } from '../services/resumeService';

// Components
import JobBoard, { initialColumns, JobCard, BoardColumn, SortableJobCard } from '../components/dashboard/JobBoard';
import AnalyticsSection from '../components/dashboard/AnalyticsSection';
import JobDetailsDrawer from '../components/dashboard/JobDetailsDrawer';
// import MyResumes from '../components/dashboard/MyResumes';

// DnD Kit Config (Parent Context)
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    closestCorners,
    defaultDropAnimationSideEffects,
    DropAnimation
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import confetti from 'canvas-confetti';





const Dashboard = () => {
    const navigate = useNavigate();
    const { } = useResume();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);

    // Job Board State (Lifted & Shared) - Load from localStorage
    const [columns, setColumns] = useState<BoardColumn[]>(() => {
        const savedColumns = localStorage.getItem('jobColumns');
        if (savedColumns) {
            try {
                return JSON.parse(savedColumns);
            } catch (error) {
                console.error('Failed to parse saved columns:', error);
                return initialColumns;
            }
        }
        return initialColumns;
    });
    const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [highlightColumnId, setHighlightColumnId] = useState<string | null>(null);

    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // DnD State
    const [activeDragItem, setActiveDragItem] = useState<any>(null);
    const [activeDragType, setActiveDragType] = useState<'JOB' | 'RESUME' | null>(null);

    // Smart Drop State
    const [dropModalOpen, setDropModalOpen] = useState(false);
    const [dropData, setDropData] = useState<{ resumeId: number, columnId: string, resumeTitle: string } | null>(null);
    const [newJobCompany, setNewJobCompany] = useState('');
    const [newJobRole, setNewJobRole] = useState('');

    // Tailor Resume State
    const [tailorModalOpen, setTailorModalOpen] = useState(false);
    const [tailorJobData, setTailorJobData] = useState<{ resumeId: number, job: JobCard } | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    // ... (UseEffect) ...
    // ... (Fetch logic) ...

    // ... (Actions) ...

    // Save columns to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('jobColumns', JSON.stringify(columns));
    }, [columns]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setDropModalOpen(false);
                setTailorModalOpen(false);
                setProfileMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                // Try to fetch from backend first
                const fetchedResumes = await resumeService.getAllResumes();
                setResumes(fetchedResumes);
            } catch (error) {
                console.error('Failed to fetch resumes from backend:', error);

                // Fallback: Load from localStorage
                try {
                    const savedResumes = localStorage.getItem('savedResumes');
                    if (savedResumes) {
                        const parsedResumes = JSON.parse(savedResumes);
                        setResumes(parsedResumes);
                        toast.info('Loaded resumes from local storage');
                    } else {
                        // No resumes found anywhere
                        setResumes([]);
                    }
                } catch (localError) {
                    console.error('Failed to load from localStorage:', localError);
                    toast.error('Could not load resumes');
                    setResumes([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchResumes();

        const userName = authService.getUserName();
        const userEmail = authService.getUserEmail();
        if (userName) {
            setUser({
                name: userName,
                email: userEmail || 'user@example.com'
            });
        }
    }, []);




    // --- Job Board Handlers ---
    const handleJobClick = (job: JobCard) => {
        navigate('/job-details', {
            state: {
                job,
                resumes: resumes.map(r => ({ id: r.id, title: r.title }))
            }
        });
    };

    const handleFunnelClick = (colId: string) => {
        setHighlightColumnId(colId);
        setTimeout(() => {
            document.getElementById(`column - ${colId} `)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }, 100);
        setTimeout(() => setHighlightColumnId(null), 2500);
    };

    // --- DnD Logic ---
    const findColumn = (id: string) => {
        if (columns.find(col => col.id === id)) return id;
        return columns.find(col => col.items.some(item => item.id === id))?.id;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const type = active.data.current?.type;
        const item = active.data.current?.item;

        if (type === 'JOB') {
            setActiveDragType('JOB');
            setActiveDragItem(item);
        } else if (type === 'RESUME') {
            setActiveDragType('RESUME');
            setActiveDragItem(item);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        // Only handle Job-to-Job dragging logic here (Sortable)
        // Resume dragging logic is handled in DragEnd because it's an "Insert" operation, not a reorder.
        if (active.data.current?.type !== 'JOB') return;

        const activeId = active.id as string;
        const overId = over.id as string;
        const activeColumnId = findColumn(activeId);
        const overColumnId = findColumn(overId);

        if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return;

        setColumns((prev) => {
            const activeColIndex = prev.findIndex(col => col.id === activeColumnId);
            const overColIndex = prev.findIndex(col => col.id === overColumnId);
            const activeItems = prev[activeColIndex].items;
            const overItems = prev[overColIndex].items;
            const activeIndex = activeItems.findIndex(i => i.id === activeId);
            const overIndex = overItems.findIndex(i => i.id === overId);

            let newIndex;
            if (overItems.some(i => i.id === overId)) {
                newIndex = overIndex >= 0 ? overIndex + (active.rect.current.translated?.top || 0 > over.rect.top ? 1 : 0) : overItems.length + 1;
            } else {
                newIndex = overItems.length + 1;
            }

            return prev.map((col) => {
                if (col.id === activeColumnId) {
                    return { ...col, items: activeItems.filter(i => i.id !== activeId) };
                }
                if (col.id === overColumnId) {
                    const newItems = [...overItems];
                    const itemToMove = activeItems[activeIndex];
                    if (itemToMove) {
                        // User Request: Update date to NOW if moving to 'applied' (e.g. from Saved)
                        if (overColumnId === 'applied') {
                            newItems.splice(newIndex, 0, { ...itemToMove, date: new Date() });
                        } else {
                            newItems.splice(newIndex, 0, itemToMove);
                        }
                    }
                    return { ...col, items: newItems };
                }
                return col;
            });
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // Reset state
        setActiveDragItem(null);
        setActiveDragType(null);

        if (!over) return;

        // 1. Handle RESUME Drop
        if (active.data.current?.type === 'RESUME') {
            const resumeId = active.data.current.item.id;
            const resumeTitle = active.data.current.item.title;

            // Check if dropped ON A JOB CARD directly (Tailoring Intent)
            if (over.data.current?.type === 'JOB') {
                // Get the actual Job Card data
                const jobId = over.id;
                const targetColumnId = findColumn(jobId as string);
                if (targetColumnId) {
                    const column = columns.find(c => c.id === targetColumnId);
                    const jobItem = column?.items.find(i => i.id === jobId);

                    if (jobItem) {
                        // TRIGGER TAILORING
                        setTailorJobData({ resumeId, job: jobItem });
                        setTailorModalOpen(true);
                        return;
                    }
                }
            }

            let targetColumnId = null;
            if (over.data.current?.type === 'COLUMN' || over.data.current?.type === 'JOB') {
                targetColumnId = over.data.current?.columnId || over.id;
                if (over.data.current?.type === 'JOB') {
                    targetColumnId = findColumn(over.id as string);
                }
            }
            if (!targetColumnId) {
                targetColumnId = findColumn(over.id as string);
            }

            if (targetColumnId) {
                // OPEN THE SMART DROP MODAL
                setDropData({ resumeId, columnId: targetColumnId, resumeTitle });
                setNewJobRole('Software Engineer'); // Smart Default
                setNewJobCompany(''); // Reset
                setDropModalOpen(true);
            }
            return;
        }

        // 2. Handle JOB Drop (Reordering)
        if (active.data.current?.type === 'JOB') {
            const activeId = active.id as string;
            const overId = over.id as string;
            const activeColumnId = findColumn(activeId);
            const overColumnId = findColumn(overId);

            if (activeColumnId && overColumnId && activeColumnId === overColumnId) {
                const columnIndex = columns.findIndex(col => col.id === activeColumnId);
                const oldIndex = columns[columnIndex].items.findIndex(i => i.id === activeId);
                const newIndex = columns[columnIndex].items.findIndex(i => i.id === overId);

                if (oldIndex !== newIndex) {
                    setColumns((prev) => {
                        const newCols = [...prev];
                        newCols[columnIndex].items = arrayMove(newCols[columnIndex].items, oldIndex, newIndex);
                        return newCols;
                    });
                }
            } else if (overColumnId === 'offer') {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#22c55e', '#ffffff', '#fbbf24'] });
            }
        }
    };

    // confirm Smart Drop Data
    const handleConfirmDrop = () => {
        if (!dropData || !newJobCompany) return;

        const newCard: JobCard = {
            id: Date.now().toString(),
            company: newJobCompany,
            role: newJobRole || 'Role',
            date: new Date(),
            linkedResumeId: dropData.resumeId
        };

        setColumns(prev => prev.map(col => {
            if (col.id === dropData.columnId) {
                return { ...col, items: [newCard, ...col.items] };
            }
            return col;
        }));

        toast.success(`Applied to ${newJobCompany} using "${dropData.resumeTitle}"!`);
        setDropModalOpen(false);
        setDropData(null);
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.4' } },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="min-h-screen bg-gradient-to-br from-mist via-white to-blue-50/30">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-silver shadow-sm">
                    <div className="w-full px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                            <Logo size={40} />
                            <div className="text-left flex flex-col items-start">
                                <h1 className="text-xl font-bold text-charcoal leading-tight">Resume Builder</h1>
                                <p className="text-xs text-steel">AI-Powered Career Tools</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => navigate('/resumes')} className="text-charcoal hover:bg-mist flex flex-row items-center gap-2">
                                <FileText size={18} />
                                My Resumes
                            </Button>
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-2 px-3 py-2 bg-mist hover:bg-white rounded-lg transition-colors border border-silver">
                                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{user?.name.charAt(0).toUpperCase() || 'U'}</div>
                                    <span className="text-sm font-medium text-charcoal">{user?.name || 'User'}</span>
                                </button>
                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-silver py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                                        </div>
                                        <button onClick={() => toast.info('Profile Settings coming soon')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                            <User size={14} className="text-gray-500" /> Account Profile
                                        </button>
                                        <button onClick={() => toast.info('App Settings coming soon')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                            <Settings size={14} className="text-gray-500" /> Settings
                                        </button>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button onClick={() => { authService.logout(); navigate('/login'); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                            <ArrowLeft size={14} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-8xl mx-auto px-6 py-8">

                    {/* Top Section - Analytics */}
                    <AnalyticsSection columns={columns} onFunnelClick={handleFunnelClick} />

                    {/* Bottom Section - Job Tracker (Droppable Targets) */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                            <p className="text-gray-500 font-medium">Loading your resumes...</p>
                        </div>
                    ) : (
                        <JobBoard
                            columns={columns}
                            setColumns={setColumns}
                            onJobClick={handleJobClick}
                            highlightColumnId={highlightColumnId}
                        >
                            {/* <MyResumes /> Removed and moved to separate page */}
                        </JobBoard>
                    )}
                </main>

                {/* Smart Drop Modal */}
                <AnimatePresence>
                    {dropModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                            onClick={() => setDropModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
                                    <FileText className="text-blue-600" />
                                    Apply with Resume
                                </h3>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4 text-sm text-blue-800">
                                    You are applying to <strong>{dropData?.columnId.toUpperCase()}</strong> with <strong>{dropData?.resumeTitle}</strong>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-steel mb-1">COMPANY NAME</label>
                                        <input
                                            autoFocus
                                            value={newJobCompany}
                                            onChange={(e) => setNewJobCompany(e.target.value)}
                                            placeholder="e.g. Acme Corp"
                                            className="w-full border border-silver rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            onKeyDown={(e) => e.key === 'Enter' && handleConfirmDrop()}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-steel mb-1">ROLE (Optional)</label>
                                        <input
                                            value={newJobRole}
                                            onChange={(e) => setNewJobRole(e.target.value)}
                                            placeholder="e.g. Senior Developer"
                                            className="w-full border border-silver rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            onKeyDown={(e) => e.key === 'Enter' && handleConfirmDrop()}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button variant="outline" onClick={() => setDropModalOpen(false)}>Cancel</Button>
                                    <Button onClick={handleConfirmDrop}>Create Job Application</Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tailor Resume Modal */}
                <AnimatePresence>
                    {tailorModalOpen && tailorJobData && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                            onClick={() => setTailorModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Edit2 size={16} />
                                    </div>
                                    Tailor Resume
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-600 mb-1">Target Job:</p>
                                        <div className="font-semibold text-gray-900">{tailorJobData.job.role} at {tailorJobData.job.company}</div>
                                    </div>

                                    {!tailorJobData.job.description ? (
                                        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2">
                                            <AlertCircle size={16} className="mt-0.5" />
                                            <div>
                                                <p className="font-semibold">Missing Job Description</p>
                                                <p>Please add a job description to this card before tailoring.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                                            <CheckCircle size={16} className="mt-0.5" />
                                            <div>
                                                <p className="font-semibold">Ready to Tailor</p>
                                                <p>We will create a specific version of your resume optimized for this role.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setTailorModalOpen(false)}>Cancel</Button>
                                    <Button
                                        disabled={!tailorJobData.job.description}
                                        onClick={() => {
                                            toast.success("Navigating to AI Editor...");
                                            // Mock navigation - in real app pass state
                                            navigate('/editor', {
                                                state: {
                                                    resumeId: tailorJobData.resumeId,
                                                    targetJob: tailorJobData.job
                                                }
                                            });
                                        }}
                                    >
                                        Start Tailoring
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Drag Overlay - Shows preview following cursor */}
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeDragType === 'JOB' && activeDragItem ? (
                        <SortableJobCard item={activeDragItem} columnId="overlay" onJobClick={() => { }} />
                    ) : activeDragType === 'RESUME' && activeDragItem ? (
                        <div className="bg-white border border-blue-400 rounded-xl p-4 shadow-2xl w-80 rotate-6 cursor-grabbing">
                            <h3 className="font-bold text-charcoal">{activeDragItem.title}</h3>
                            <p className="text-xs text-blue-600 mt-1">Drop on a column to track...</p>
                        </div>
                    ) : null}
                </DragOverlay>

                <JobDetailsDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    job={selectedJob}
                    resumes={resumes.map(r => ({ id: r.id, title: r.title }))}
                    onLinkResume={(jobId, resumeId) => {
                        setColumns(cols => cols.map(col => ({
                            ...col,
                            items: col.items.map(item => item.id === jobId ? { ...item, linkedResumeId: resumeId } : item)
                        })));
                        setSelectedJob(prev => prev ? { ...prev, linkedResumeId: resumeId } : null);
                    }}
                    onUpdateNotes={(jobId, notes) => {
                        setColumns(cols => cols.map(col => ({
                            ...col,
                            items: col.items.map(item => item.id === jobId ? { ...item, notes } : item)
                        })));
                        setSelectedJob(prev => prev ? { ...prev, notes } : null);
                    }}
                    onUpdateDescription={(jobId, description) => {
                        setColumns(cols => cols.map(col => ({
                            ...col,
                            items: col.items.map(item => item.id === jobId ? { ...item, description } : item)
                        })));
                        setSelectedJob(prev => prev ? { ...prev, description } : null);
                    }}
                />

            </div>
        </DndContext>
    );
};

export default Dashboard;
