
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor,
    DragStartEvent, DragOverEvent, DragEndEvent, closestCorners,
    defaultDropAnimationSideEffects, DropAnimation
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import confetti from 'canvas-confetti';
import {
    AlertCircle, Loader2, Edit2, CheckCircle, FileText, Calendar
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../components/ui/Button';

import AppHeader, { startTour } from '../components/layout/AppHeader';
import JobBoard from '../components/dashboard/JobBoard';
import AnalyticsSection from '../components/dashboard/AnalyticsSection';
import JobDetailsDrawer from '../components/dashboard/JobDetailsDrawer';
import { SortableJobCard } from '../components/dashboard/board/SortableJobCard';


import { authService } from '../services/authService';
import { resumeService } from '../services/resumeService';
import { TRACKING_COLUMNS, INITIAL_COLUMNS, COLUMN_ORDER } from '../utils/constants';
import { Resume, JobCard, BoardColumn } from '../types';

const Dashboard = () => {
    const navigate = useNavigate();
    // const { } = useResume(); // Context available if needed
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);

    // Job Board State (Lifted & Shared) - Load from localStorage with safe merge
    const [columns, setColumns] = useState<BoardColumn[]>(() => {
        const userEmail = authService.getUserEmail() || 'guest';
        const storageKey = `jobColumns_${userEmail}`;
        const savedColumns = localStorage.getItem(storageKey);

        if (savedColumns) {
            try {
                const parsed = JSON.parse(savedColumns);
                // 1. Map INITIAL_COLUMNS structure
                const result = INITIAL_COLUMNS.map(initCol => {
                    let savedCol = parsed.find((p: any) => p.id === initCol.id);
                    // Handle legacy ID migration
                    if (!savedCol && initCol.id === 'interview') {
                        savedCol = parsed.find((p: any) => p.id === 'interviewing');
                    }
                    return { ...initCol, items: savedCol ? savedCol.items : [] };
                });

                // 2. Data Loss Prevention: Ensure all cards from storage are preserved
                const resultItemIds = new Set(result.flatMap(c => c.items.map((i: any) => i.id)));
                const orphanedItems = parsed.flatMap((c: any) => c.items).filter((i: any) => !resultItemIds.has(i.id));

                if (orphanedItems.length > 0) {
                    const savedIdx = result.findIndex(c => c.id === 'saved');
                    if (savedIdx !== -1) {
                        result[savedIdx].items = [...result[savedIdx].items, ...orphanedItems];
                    }
                }
                return result;
            } catch (error) {
                console.error('Failed to parse saved columns:', error);
                return INITIAL_COLUMNS.map(c => ({ ...c, items: [] }));
            }
        }
        return INITIAL_COLUMNS.map(c => ({ ...c, items: [] }));
    });
    const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [highlightColumnId, setHighlightColumnId] = useState<string | null>(null);

    // DnD State
    const [activeDragItem, setActiveDragItem] = useState<JobCard | Resume | null>(null);
    const [activeDragType, setActiveDragType] = useState<'JOB' | 'RESUME' | null>(null);
    const [activeDragColumnId, setActiveDragColumnId] = useState<string | null>(null);

    // Smart Drop State
    const [dropModalOpen, setDropModalOpen] = useState(false);
    const [dropData, setDropData] = useState<{ resumeId: number, columnId: string, resumeTitle: string } | null>(null);
    const [newJobCompany, setNewJobCompany] = useState('');
    const [newJobRole, setNewJobRole] = useState('');

    // Tailor Resume State
    const [tailorModalOpen, setTailorModalOpen] = useState(false);
    const [tailorJobData, setTailorJobData] = useState<{ resumeId: number, job: JobCard } | null>(null);

    // Schedule Round State
    const [scheduleRoundModalOpen, setScheduleRoundModalOpen] = useState(false);
    const [scheduleRoundData, setScheduleRoundData] = useState<{ job: JobCard, columnId: string } | null>(null);
    const [newRound, setNewRound] = useState({ type: 'interview' as const, scheduledDate: '', notes: '' });

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    // ... (UseEffect) ...
    // ... (Fetch logic) ...

    // ... (Actions) ...

    // Save columns to localStorage and backend whenever they change
    useEffect(() => {
        const userEmail = user?.email || authService.getUserEmail() || 'guest';
        const storageKey = `jobColumns_${userEmail}`;
        const timeoutId = setTimeout(async () => {
            localStorage.setItem(storageKey, JSON.stringify(columns));

            // Also sync to backend if logged in
            if (authService.getToken()) {
                try {
                    await authService.updateBoard(columns);
                } catch (err) {
                    console.error('Failed to sync board to backend:', err);
                }
            }
        }, 1000); // 1-second debounce to prevent lag on rapid changes
        return () => clearTimeout(timeoutId);
    }, [columns, user]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setDropModalOpen(false);
                setTailorModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Create promises for both requests immediately
                const resumesPromise = resumeService.getAllResumes()
                    .catch(error => {
                        console.error('Failed to fetch resumes from backend:', error);
                        // Fallback: Load from localStorage
                        const savedResumes = localStorage.getItem('savedResumes');
                        if (savedResumes) {
                            toast.info('Resumes loaded from offline storage.');
                            return JSON.parse(savedResumes);
                        }
                        return [];
                    });

                const boardPromise = authService.getToken()
                    ? authService.getBoard().catch(err => {
                        console.error('Board fetch failed', err);
                        return null;
                    })
                    : Promise.resolve(null);

                // Await both in parallel
                const [fetchedResumes, backendBoard] = await Promise.all([resumesPromise, boardPromise]);

                // 1. Process Resumes
                setResumes(fetchedResumes);

                // 2. Process Board Data (if available)
                if (backendBoard && Array.isArray(backendBoard) && backendBoard.length > 0) {
                    // Map and validate backend data
                    const result = INITIAL_COLUMNS.map(initCol => {
                        let savedCol = backendBoard.find((p: any) => p.id === initCol.id);
                        if (!savedCol && initCol.id === 'interview') {
                            savedCol = backendBoard.find((p: any) => p.id === 'interviewing');
                        }
                        return { ...initCol, items: savedCol ? savedCol.items : [] };
                    });

                    // Ensure all items are preserved
                    const resultItemIds = new Set(result.flatMap(c => c.items.map((i: any) => i.id)));
                    const orphanedItems = backendBoard.flatMap((c: any) => c.items).filter((i: any) => !resultItemIds.has(i.id));

                    if (orphanedItems.length > 0) {
                        const savedIdx = result.findIndex(c => c.id === 'saved');
                        if (savedIdx !== -1) {
                            result[savedIdx].items = [...result[savedIdx].items, ...orphanedItems];
                        }
                    }
                    setColumns(result);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const userName = authService.getUserName();
        const userEmail = authService.getUserEmail();
        if (userName) {
            setUser({
                name: userName,
                email: userEmail || 'user@example.com'
            });
        }
    }, []);

    // Auto-start tour for first-time users
    useEffect(() => {
        // Only run on dashboard and after loading is complete
        if (!loading && user) {
            const hasSeenTour = localStorage.getItem('lumina_tour_completed');

            if (!hasSeenTour) {
                // Delay tour start to ensure all elements are rendered
                const timer = setTimeout(() => {
                    startTour();
                    localStorage.setItem('lumina_tour_completed', 'true');
                }, 1500); // Increased delay for better reliability

                return () => clearTimeout(timer);
            }
        }
    }, [loading, user]);



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
            setActiveDragColumnId(active.data.current?.columnId);
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

        // Block reverse status changes
        const activeIdx = COLUMN_ORDER.indexOf(activeColumnId);
        const overIdx = COLUMN_ORDER.indexOf(overColumnId);

        if (overIdx < activeIdx) {
            return;
        }

        setColumns((prev) => {
            const activeColIndex = prev.findIndex(col => col.id === activeColumnId);
            const overColIndex = prev.findIndex(col => col.id === overColumnId);
            const activeItems = prev[activeColIndex].items;
            const overItems = prev[overColIndex].items;
            const activeIndex = activeItems.findIndex(i => i.id === activeId);
            const overIndex = overItems.findIndex(i => i.id === overId);

            let newIndex;
            if (overItems.some(i => i.id === overId)) {
                newIndex = overIndex >= 0 ? overIndex + ((active.rect.current.translated?.top || 0) > over.rect.top ? 1 : 0) : overItems.length + 1;
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
                        const isTracking = TRACKING_COLUMNS.includes(overColumnId);

                        // Track History - Only add if status actually changed from the last one in history
                        const history = itemToMove.history || [];
                        const lastStatus = history.length > 0 ? history[history.length - 1].status : null;

                        let updatedHistory = history;
                        if (lastStatus !== overColumnId) {
                            updatedHistory = [...history, {
                                status: overColumnId,
                                date: new Date().toISOString(),
                                type: 'status_change' as const
                            }];
                        }

                        const updatedItem = {
                            ...itemToMove,
                            date: isTracking ? new Date() : itemToMove.date,
                            history: updatedHistory
                        };

                        newItems.splice(newIndex, 0, updatedItem);
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
        setActiveDragColumnId(null);

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
            const initialColumnId = activeDragColumnId;

            // Toast for Drag & Drop Move
            if (activeColumnId && initialColumnId && activeColumnId !== initialColumnId) {
                const companyName = active.data.current.item.company;
                const getToastMessage = (statusId: string, company: string) => {
                    switch (statusId) {
                        case 'applied': return `Application submitted to ${company}.`;
                        case 'screening': return `${company} is currently screening your profile.`;
                        case 'aptitude': return `Aptitude assessment scheduled for ${company}.`;
                        case 'technical': return `Technical interview scheduled with ${company}.`;
                        case 'interview': return `Interview round confirmed with ${company}.`;
                        case 'offer': return `Congratulations! Offer received from ${company}.`;
                        case 'rejected': return `Application for ${company} has been closed.`;
                        default: return `**${company}** moved to **${activeColumnId}** stage.`;
                    }
                };
                toast.success(getToastMessage(activeColumnId, companyName));

                // Check if we should ask to schedule a round
                const roundTypes = ['aptitude', 'technical', 'interview', 'screening'];
                if (roundTypes.includes(activeColumnId)) {
                    const movedJob = active.data.current.item;
                    setScheduleRoundData({ job: movedJob, columnId: activeColumnId });
                    setNewRound({
                        type: activeColumnId as any,
                        scheduledDate: '',
                        notes: ''
                    });
                    setScheduleRoundModalOpen(true);
                }

                if (activeColumnId === 'offer') {
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#22c55e', '#ffffff', '#fbbf24'] });
                }
            }

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
            }
        }
    };

    // confirm Smart Drop Data
    const handleConfirmDrop = () => {
        if (!dropData || !newJobCompany.trim()) return;

        const newCard: JobCard = {
            id: Date.now().toString(),
            company: newJobCompany,
            role: newJobRole || 'Role',
            date: new Date(),
            linkedResumeId: dropData.resumeId,
            history: [{
                status: dropData.columnId,
                date: new Date().toISOString(),
                type: 'status_change'
            }]
        };

        setColumns(prev => prev.map(col => {
            if (col.id === dropData.columnId) {
                return { ...col, items: [newCard, ...col.items] };
            }
            return col;
        }));

        toast.success(`Application created for **${newJobCompany}**!`);
        setDropModalOpen(false);
        setDropData(null);
    };

    const handleScheduleRound = () => {
        if (!scheduleRoundData || !newRound.scheduledDate) {
            toast.error('Please select a date for the round');
            return;
        }

        const round = {
            id: Date.now().toString(),
            type: newRound.type,
            scheduledDate: newRound.scheduledDate,
            notes: newRound.notes
        };

        // Update the job card with the new round
        setColumns(prev => prev.map(col => ({
            ...col,
            items: col.items.map(item => {
                if (item.id === scheduleRoundData.job.id) {
                    const existingRounds = item.upcomingRounds || [];
                    return {
                        ...item,
                        upcomingRounds: [...existingRounds, round]
                    };
                }
                return item;
            })
        })));

        toast.success('Round scheduled successfully!');
        setScheduleRoundModalOpen(false);
        setScheduleRoundData(null);
        setNewRound({ type: 'interview', scheduledDate: '', notes: '' });
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
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 pb-20">
                {/* Header */}
                <AppHeader user={user} />

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Header Actions */}
                    <div className="mb-8 pt-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                            <p className="text-gray-400 text-xs mt-1.5 font-medium">Track your applications and analyze your performance.</p>
                        </div>
                    </div>

                    {/* Top Section - Analytics */}
                    <div id="dashboard-analytics">
                        <AnalyticsSection columns={columns} onFunnelClick={handleFunnelClick} />
                    </div>

                    {/* Bottom Section - Job Tracker (Droppable Targets) */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                            <p className="text-gray-500 font-medium">Loading your resumes...</p>
                        </div>
                    ) : (
                        <div id="dashboard-job-board">
                            <JobBoard
                                columns={columns}
                                setColumns={setColumns}
                                onJobClick={handleJobClick}
                                highlightColumnId={highlightColumnId}
                                onScheduleRound={(job, columnId) => {
                                    setScheduleRoundData({ job, columnId });
                                    setNewRound({
                                        type: columnId as any,
                                        scheduledDate: '',
                                        notes: ''
                                    });
                                    setScheduleRoundModalOpen(true);
                                }}
                            >
                                {/* <MyResumes /> Removed and moved to separate page */}
                            </JobBoard>
                        </div>
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
                                            toast.success("Opening the AI Editor...");
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

                {/* Schedule Round Modal */}
                <AnimatePresence>
                    {scheduleRoundModalOpen && scheduleRoundData && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                            onClick={() => setScheduleRoundModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="text-center mb-6">
                                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar size={24} className="text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule This Round?</h3>
                                    <p className="text-gray-600 text-sm">
                                        Would you like to schedule a date for this{' '}
                                        <span className="font-bold text-purple-600 capitalize">{newRound.type}</span> round
                                        {' '}at <span className="font-bold">{scheduleRoundData.job.company}</span>?
                                    </p>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {/* Scheduled Date */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2">Scheduled Date</label>
                                        <input
                                            type="date"
                                            value={newRound.scheduledDate}
                                            onChange={(e) => setNewRound({ ...newRound, scheduledDate: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2">Notes (Optional)</label>
                                        <textarea
                                            value={newRound.notes}
                                            onChange={(e) => setNewRound({ ...newRound, notes: e.target.value })}
                                            placeholder="Add any additional details..."
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setScheduleRoundModalOpen(false);
                                            setScheduleRoundData(null);
                                            setNewRound({ type: 'interview', scheduledDate: '', notes: '' });
                                        }}
                                        className="flex-1"
                                    >
                                        Skip
                                    </Button>
                                    <Button
                                        onClick={handleScheduleRound}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                                    >
                                        Schedule
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Drag Overlay - Shows preview following cursor */}
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeDragType === 'JOB' && activeDragItem ? (
                        <SortableJobCard item={activeDragItem as JobCard} columnId="overlay" onJobClick={() => { }} />
                    ) : activeDragType === 'RESUME' && activeDragItem ? (
                        <div className="bg-white border border-blue-400 rounded-xl p-4 shadow-2xl w-80 rotate-6 cursor-grabbing">
                            <h3 className="font-bold text-charcoal">{(activeDragItem as Resume).title}</h3>
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
                    onUpdateRejectionReason={(jobId, rejectionReason) => {
                        setColumns(cols => cols.map(col => ({
                            ...col,
                            items: col.items.map(item => item.id === jobId ? { ...item, rejectionReason } : item)
                        })));
                        setSelectedJob(prev => prev ? { ...prev, rejectionReason } : null);
                    }}
                />

            </div>
        </DndContext>
    );
};

export default Dashboard;
