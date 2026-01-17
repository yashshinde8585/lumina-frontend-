import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft, FileText, CheckSquare, Send, Calculator, Code, Users, Briefcase, XCircle, Download, Trash2, X,
    Clock, Search, MoreVertical, Plus, CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import AppHeader from '../components/layout/AppHeader';
import { JobCard } from '../types';
import { toast } from 'sonner';
import { resumeService } from '../services/resumeService';
import { authService } from '../services/authService';
import { TRACKING_COLUMNS, INITIAL_COLUMNS } from '../utils/constants';

const getStatusButtonClass = (color: string, hasChanges: boolean) => {
    const base = "px-4 py-1.5 rounded-lg text-xs font-medium transition-colors border";
    const statusColorMap: { [key: string]: string } = {
        gray: hasChanges ? 'bg-gray-600 text-white hover:bg-gray-700 border-transparent shadow-sm cursor-pointer' : 'bg-gray-50 text-gray-700 border-gray-200 cursor-default',
        blue: hasChanges ? 'bg-blue-600 text-white hover:bg-blue-700 border-transparent shadow-sm cursor-pointer' : 'bg-blue-50 text-blue-700 border-blue-200 cursor-default',
        orange: hasChanges ? 'bg-orange-600 text-white hover:bg-orange-700 border-transparent shadow-sm cursor-pointer' : 'bg-orange-50 text-orange-700 border-orange-200 cursor-default',
        cyan: hasChanges ? 'bg-cyan-600 text-white hover:bg-cyan-700 border-transparent shadow-sm cursor-pointer' : 'bg-cyan-50 text-cyan-700 border-cyan-200 cursor-default',
        indigo: hasChanges ? 'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent shadow-sm cursor-pointer' : 'bg-indigo-50 text-indigo-700 border-indigo-200 cursor-default',
        purple: hasChanges ? 'bg-purple-600 text-white hover:bg-purple-700 border-transparent shadow-sm cursor-pointer' : 'bg-purple-50 text-purple-700 border-purple-200 cursor-default',
        green: hasChanges ? 'bg-green-600 text-white hover:bg-green-700 border-transparent shadow-sm cursor-pointer' : 'bg-green-50 text-green-700 border-green-200 cursor-default',
        red: hasChanges ? 'bg-red-600 text-white hover:bg-red-700 border-transparent shadow-sm cursor-pointer' : 'bg-red-50 text-red-700 border-red-200 cursor-default',
    };
    return `${base} ${statusColorMap[color] || statusColorMap['blue']}`;
};

const JobDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialJob = location.state?.job as JobCard | null;
    const [job, setJob] = React.useState<JobCard | null>(initialJob || null);

    const [notes, setNotes] = React.useState(job?.notes === 'NA' ? '' : (job?.notes || ''));
    const [reflection, setReflection] = React.useState(job?.reflection || '');
    const [rejectionRound, setRejectionRound] = React.useState(job?.rejectionRound || '');
    const [rejectionReason, setRejectionReason] = React.useState(job?.rejectionReason || '');
    const linkedResumeId = React.useMemo(() => job?.linkedResumeId || null, [job?.linkedResumeId]);
    const externalResume = React.useMemo(() => job?.externalResume || null, [job?.externalResume]);
    const [showPreview, setShowPreview] = React.useState(false);
    const [previewResume, setPreviewResume] = React.useState<any>(null);
    const [status, setStatus] = React.useState({ title: 'Applied', color: 'blue', id: 'applied' });
    const [showResumeModal, setShowResumeModal] = React.useState(false);
    const [showDownloadConfirm, setShowDownloadConfirm] = React.useState(false);
    const [resumeToDownload, setResumeToDownload] = React.useState<{ url: string, filename: string } | null>(null);
    const [showStatusConfirm, setShowStatusConfirm] = React.useState(false);
    const [pendingStatusId, setPendingStatusId] = React.useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

    const [user, setUser] = React.useState<{ name: string, email: string } | null>(null);

    React.useEffect(() => {
        const userName = authService.getUserName();
        const userEmail = authService.getUserEmail();
        if (userName) {
            setUser({
                name: userName,
                email: userEmail || 'user@example.com'
            });
        }
    }, []);

    React.useEffect(() => {
        document.title = 'Job Application Details';
        setTimeout(() => window.scrollTo(0, 0), 0);
    }, []);

    React.useEffect(() => {
        if (!initialJob) return;
        const userEmail = authService.getUserEmail() || 'guest';
        const storageKey = `jobColumns_${userEmail}`;
        const savedColumns = localStorage.getItem(storageKey);

        if (savedColumns) {
            const columns = JSON.parse(savedColumns);
            for (const col of columns) {
                const found = col.items.find((i: any) => String(i.id) === String(initialJob.id));
                if (found) {
                    setStatus({ title: col.title, color: col.color, id: col.id });
                    setJob(found);
                    break;
                }
            }
        }
    }, [initialJob]);

    // Initial notes for dirty check
    const initialNotes = React.useMemo(() => job?.notes === 'NA' ? '' : (job?.notes || ''), [job?.notes]);
    const initialReflection = React.useMemo(() => job?.reflection || '', [job?.reflection]);
    const initialRejectionRound = React.useMemo(() => job?.rejectionRound || '', [job?.rejectionRound]);
    const initialRejectionReason = React.useMemo(() => job?.rejectionReason || '', [job?.rejectionReason]);

    const hasChanges = notes !== initialNotes || reflection !== initialReflection || rejectionRound !== initialRejectionRound || rejectionReason !== initialRejectionReason;

    // MyResumes state
    const [allResumes, setAllResumes] = React.useState<any[]>([]);

    // Load resumes on mount
    React.useEffect(() => {
        const loadResumes = async () => {
            try {
                const fetched = await resumeService.getAllResumes();
                setAllResumes(fetched);
                localStorage.setItem('savedResumes', JSON.stringify(fetched));
            } catch (err) {
                console.error("Failed to fetch resumes", err);
                const savedResumes = localStorage.getItem('savedResumes');
                if (savedResumes) {
                    setAllResumes(JSON.parse(savedResumes));
                }
            }
        };
        loadResumes();
    }, []);

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
                    <p className="text-gray-600 mb-4">The job details you're looking for don't exist.</p>
                    <Button onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={16} className="mr-2" /> Back to My Jobs
                    </Button>
                </div>
            </div>
        );
    }

    const handleCreateNew = () => {
        navigate('/generate');
    };

    const handleEdit = (resume: any) => {
        navigate('/editor', { state: { resumeId: resume.id } });
    };

    const handleSave = async () => {
        if (!hasChanges) return;

        const userEmail = authService.getUserEmail() || 'guest';
        const storageKey = `jobColumns_${userEmail}`;
        const savedColumns = localStorage.getItem(storageKey);

        if (savedColumns) {
            const columns = JSON.parse(savedColumns);
            for (const col of columns) {
                const foundJob = col.items.find((item: any) => String(item.id) === String(job.id));
                if (foundJob) {
                    foundJob.notes = notes;
                    foundJob.reflection = reflection;
                    foundJob.rejectionRound = rejectionRound;
                    foundJob.rejectionReason = rejectionReason;
                    break;
                }
            }
            localStorage.setItem(storageKey, JSON.stringify(columns));

            // Sync to backend if logged in
            if (authService.getToken()) {
                try {
                    await authService.updateBoard(columns);
                } catch (err) {
                    console.error('Failed to sync board to backend:', err);
                }
            }
        }

        // Update local state to reflect changes immediately
        if (job) {
            setJob({
                ...job,
                notes,
                reflection,
                rejectionRound,
                rejectionReason
            });
        }
    };



    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        // Delete linked resume from Cloudinary if it exists
        if (job.linkedResumeId) {
            resumeService.deleteResume(job.linkedResumeId).catch(err => {
                console.error("Failed to delete linked resume from Cloudinary:", err);
            });
        }

        const userEmail = authService.getUserEmail() || 'guest';
        const storageKey = `jobColumns_${userEmail}`;
        const savedColumns = localStorage.getItem(storageKey);
        if (!savedColumns) return;

        const columns = JSON.parse(savedColumns);
        const updatedColumns = columns.map((col: any) => ({
            ...col,
            items: col.items.filter((item: any) => String(item.id) !== String(job.id))
        }));

        localStorage.setItem(storageKey, JSON.stringify(updatedColumns));

        // Sync to backend if logged in
        if (authService.getToken()) {
            try {
                await authService.updateBoard(updatedColumns);
            } catch (err) {
                console.error('Failed to sync board to backend:', err);
            }
        }

        toast.success("Application removed from your board.");
        navigate('/dashboard');
    };

    const handleStatusUpdate = async (newStatusId: string) => {
        if (newStatusId === status.id) {
            return;
        }

        const userEmail = authService.getUserEmail() || 'guest';
        const storageKey = `jobColumns_${userEmail}`;
        const savedColumns = localStorage.getItem(storageKey);
        if (!savedColumns) return;

        let columns = JSON.parse(savedColumns);
        let foundJob: any = null;

        // 1. Find and remove
        columns = columns.map((col: any) => {
            const item = col.items.find((i: any) => String(i.id) === String(job.id));
            if (item) {
                foundJob = { ...item };
                return { ...col, items: col.items.filter((i: any) => String(i.id) !== String(job.id)) };
            }
            return col;
        });

        if (!foundJob) {
            toast.error("We couldn't update the status. Please try again.");
            return;
        }

        // 2. Add to new column and track history
        const isTracking = TRACKING_COLUMNS.includes(newStatusId);
        const history = foundJob.history || [];
        const lastStatus = history.length > 0 ? history[history.length - 1].status : null;

        let updatedHistory = history;
        if (lastStatus !== newStatusId) {
            updatedHistory = [...history, {
                status: newStatusId,
                date: new Date().toISOString(),
                type: 'status_change'
            }];
        }

        const updatedJob = {
            ...foundJob,
            date: isTracking ? new Date() : foundJob.date,
            history: updatedHistory
        };

        columns = columns.map((col: any) => {
            if (col.id === newStatusId) {
                return { ...col, items: [updatedJob, ...col.items] };
            }
            return col;
        });

        localStorage.setItem(storageKey, JSON.stringify(columns));

        // Sync to backend if logged in
        if (authService.getToken()) {
            try {
                await authService.updateBoard(columns);
            } catch (err) {
                console.error('Failed to sync board to backend:', err);
            }
        }

        const newColTitle = INITIAL_COLUMNS.find((c: any) => c.id === newStatusId)?.title || newStatusId;

        // Update local state immediately
        setJob(updatedJob);

        // Update URL state so reload preserves new data
        navigate(location.pathname, { state: { job: updatedJob }, replace: true });

        toast.success(`Moved to **${newColTitle}** stage.`);
    };

    const confirmStatusUpdate = () => {
        if (pendingStatusId) {
            handleStatusUpdate(pendingStatusId);
        }
        setShowStatusConfirm(false);
    };

    const handleViewResume = () => {
        if (externalResume) {
            setResumeToDownload({ url: externalResume.data, filename: externalResume.name || 'resume.pdf' });
            setShowDownloadConfirm(true);
            return;
        }

        if (linkedResumeId) {
            const linkedResume = allResumes.find(r => r.id === linkedResumeId || String(r.id) === String(linkedResumeId));
            if (linkedResume && linkedResume.fileUrl) {
                setResumeToDownload({ url: linkedResume.fileUrl, filename: `${linkedResume.title || 'resume'}.pdf` });
                setShowDownloadConfirm(true);
                return;
            }
        }

        // Fallback to list if no direct file found
        setShowResumeModal(true);
    };

    const confirmDownload = async () => {
        if (!resumeToDownload) return;

        // Check if we can use the backend proxy (if it is a linked resume from our DB)
        let blob: Blob | null = null;

        try {
            // Check if this URL belongs to one of our DB resumes
            const matchedResume = allResumes.find(r => r.fileUrl === resumeToDownload.url);

            if (linkedResumeId && matchedResume) {
                // It's a linked resume, use proxy
                blob = await resumeService.downloadResume(matchedResume.id);
            } else if (matchedResume) {
                // Cloudinary URL but found in our list
                blob = await resumeService.downloadResume(matchedResume.id);
            }

            if (!blob) {
                // External: Try fetch
                const response = await fetch(resumeToDownload.url).catch(() => null);
                if (response && response.ok) {
                    blob = await response.blob();
                }
            }

            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = resumeToDownload.filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success('Downloading your resume...');
            } else {
                // Fallback
                let downloadUrl = resumeToDownload.url;
                // Only add fl_attachment for non-raw cloudinary files (images/auto)
                // Raw files do not support transformations and will 400/401 with fl_attachment
                if (downloadUrl.includes('cloudinary.com') &&
                    downloadUrl.includes('/upload/') &&
                    !downloadUrl.includes('fl_attachment') &&
                    !downloadUrl.includes('/raw/')) {
                    downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
                }
                window.open(downloadUrl, '_blank');
            }
        } catch (error) {
            console.error("Download error", error);
            window.open(resumeToDownload.url, '_blank');
        }

        setShowDownloadConfirm(false);
    };


    return (
        <div
            className="min-h-screen bg-gradient-to-br from-mist via-white to-blue-50/30 font-sans relative"
        >
            {/* Status Change Confirmation Modal */}
            {showStatusConfirm && pendingStatusId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                {(() => {
                                    const col = INITIAL_COLUMNS.find(c => c.id === pendingStatusId);
                                    let Icon = CheckSquare;
                                    switch (pendingStatusId) {
                                        case 'applied': Icon = Send; break;
                                        case 'screening': Icon = Search; break;
                                        case 'aptitude': Icon = Calculator; break;
                                        case 'technical': Icon = Code; break;
                                        case 'interview': Icon = Users; break;
                                        case 'offer': Icon = Briefcase; break;
                                        case 'rejected': Icon = XCircle; break;
                                    }
                                    return <Icon size={24} className={`text-${col?.color || 'blue'}-600`} />;
                                })()}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Change Stage?</h3>
                            <p className="text-gray-600 text-sm">
                                Are you sure you want to move <strong>{job.company}</strong> to the <strong>{INITIAL_COLUMNS.find(c => c.id === pendingStatusId)?.title}</strong> stage?
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setShowStatusConfirm(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmStatusUpdate}
                                variant={INITIAL_COLUMNS.find(c => c.id === pendingStatusId)?.color === 'red' ? 'danger' : 'primary'}
                                className="flex-1"
                            >
                                Yes, Move
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={24} className="text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Application?</h3>
                            <p className="text-gray-600 text-sm">
                                Are you sure you want to delete the application for <strong>{job.company}</strong>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                variant="danger"
                                className="flex-1"
                            >
                                Yes, Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Download Confirmation Modal */}
            {showDownloadConfirm && resumeToDownload && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Download size={24} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Download Resume?</h3>
                            <p className="text-gray-600 text-sm">
                                Do you want to download <strong>{resumeToDownload.filename}</strong>?
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setShowDownloadConfirm(false)} className="flex-1">
                                No
                            </Button>
                            <Button onClick={confirmDownload} className="flex-1">
                                Yes, Download
                            </Button>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Resume Modal */}
            {
                showResumeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
                            <button
                                onClick={() => setShowResumeModal(false)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText size={24} className="text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Application Resume</h3>
                                <p className="text-gray-600 text-sm">
                                    Preparing for your interview? Reviewing the specific resume you used for this application is a great starting point!
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                {(linkedResumeId || externalResume) ? (
                                    <>
                                        {linkedResumeId ? (() => {
                                            const linkedResume = allResumes.find(r => r.id === linkedResumeId || String(r.id) === String(linkedResumeId));
                                            if (!linkedResume) return <div className="text-center text-gray-500 text-sm">Resume not found</div>;
                                            return (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (linkedResume.fileUrl) {
                                                            window.open(linkedResume.fileUrl, '_blank');
                                                        } else {
                                                            handleEdit(linkedResume);
                                                        }
                                                    }}
                                                    className="w-full flex items-center gap-4 p-3 bg-white hover:bg-blue-50/50 rounded-lg transition-all border border-gray-200 hover:border-blue-200 group shadow-sm"
                                                >
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                                        <FileText size={20} className="text-blue-600" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <span className="block font-bold text-gray-900 truncate">{linkedResume.title}</span>
                                                        <span className="text-xs text-blue-600 font-medium">
                                                            {linkedResume.fileUrl ? 'Click to View PDF' : 'Click to View & Edit'}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })() : externalResume ? (
                                            <a
                                                href={externalResume.data}
                                                download={externalResume.name}
                                                className="w-full flex items-center gap-4 p-3 bg-white hover:bg-purple-50/50 rounded-lg transition-all border border-gray-200 hover:border-purple-200 group shadow-sm"
                                            >
                                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                                                    <FileText size={20} className="text-purple-600" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <span className="block font-bold text-gray-900 truncate">PDF Resume</span>
                                                    <span className="text-xs text-purple-600 font-medium">Click to Download</span>
                                                </div>
                                                <Download size={18} className="text-gray-400 group-hover:text-purple-600" />
                                            </a>
                                        ) : null}
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500 text-sm italic">No resume linked to this application.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <Button variant="outline" onClick={() => setShowResumeModal(false)} className="w-full">
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Header */}
            <AppHeader user={user} />

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                {/* Job Header Card - Premium Design */}
                <div className={`rounded-xl shadow-sm border mb-6 bg-${status.color}-50 border-${status.color}-200 relative`}>
                    <button
                        onClick={handleDelete}
                        className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors z-10"
                        title="Delete Application"
                    >
                        <Trash2 size={18} />
                    </button>
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
                        {/* Logo and Job Identity Group (Horizontal on Mobile) */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Company Logo - Large & Soft */}
                            <div className={`w-20 h-20 rounded-[1.25rem] bg-${status.color || 'blue'}-50/50 flex items-center justify-center border border-${status.color || 'blue'}-100/50 overflow-hidden shrink-0 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] p-4`}>
                                {job.company && job.company.toLowerCase().replace(/\s/g, '') !== 'companyname' ? (
                                    <img
                                        src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s/g, '')}.com`}
                                        alt={job.company}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            // Fallback to initial
                                            const parent = (e.target as HTMLImageElement).parentElement;
                                            if (parent) {
                                                parent.innerHTML = `<span class="text-2xl font-bold text-${status.color || 'blue'}-300">${job.company.charAt(0)}</span>`;
                                            }
                                        }}
                                    />
                                ) : (
                                    <span className={`text-2xl font-bold text-${status.color || 'blue'}-300`}>
                                        {job.company.charAt(0)}
                                    </span>
                                )}
                            </div>

                            {/* Job Identity */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 tracking-tight truncate">{job.company}</h1>
                                <p className="text-base text-blue-600 font-medium">{job.role}</p>
                            </div>
                        </div>

                        {/* Resume & Date Section (Responsive Row/Col) */}
                        {/* Resume & Date Section (Responsive Row/Col) */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shrink-0 w-full sm:w-auto">
                            {/* Linked Resume Card */}
                            <div className="w-full sm:w-auto">
                                {(linkedResumeId || externalResume) && (
                                    <div className="flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-md rounded-xl border border-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:bg-white/80 w-full sm:w-auto group cursor-pointer" onClick={handleViewResume}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${externalResume ? 'bg-purple-100/50 text-purple-600' : 'bg-blue-100/50 text-blue-600'} group-hover:scale-110 transition-transform`}>
                                            <FileText size={16} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Resume</p>
                                            <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600 truncate max-w-[150px] block">
                                                {externalResume ? 'External PDF' : (allResumes.find(r => r.id === linkedResumeId)?.title || 'My Resume')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Applied Date */}
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6">
                                <div className="flex flex-col items-start sm:items-end px-4 py-2 bg-white/50 backdrop-blur-md rounded-xl border border-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Applied on</p>
                                    <span className="text-sm font-bold text-gray-900 font-mono">
                                        {new Date(job.date).toLocaleDateString('en-GB')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Only: Status Badge at Bottom Right */}

                </div>

                {/* Progress Tracker - Interactive Milestone */}
                <div className="mb-8 relative px-4">
                    <div className="relative z-10 flex items-center justify-start md:justify-between gap-4 md:gap-0 overflow-x-auto py-4 scrollbar-hide px-2">
                        {(() => {
                            const linearStages = ['applied', 'screening', 'aptitude', 'technical', 'interview', 'offer', 'rejected'];

                            const checkVisited = (sid: string) => {
                                const isHistoryAvailable = job.history && job.history.length > 0;
                                return isHistoryAvailable
                                    ? job.history?.some((h: any) => h.status === sid) || sid === status.id
                                    : linearStages.indexOf(status.id) >= linearStages.indexOf(sid);
                            };

                            return linearStages.map((cid, index) => {
                                const col = INITIAL_COLUMNS.find(c => c.id === cid);
                                if (!col) return null;
                                const isActive = cid === status.id;
                                const isVisited = checkVisited(cid);



                                return (
                                    <React.Fragment key={cid}>
                                        <button
                                            onClick={() => {
                                                if (!isActive) {
                                                    setPendingStatusId(cid);
                                                    setShowStatusConfirm(true);
                                                }
                                            }}
                                            className={`flex flex-col items-center gap-3 group min-w-[80px] cursor-pointer transition-all duration-300 relative flex-shrink-0`}
                                        >
                                            <div className={`
                                            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm z-10 border-[3px]
                                            ${isActive
                                                    ? `bg-white border-${col.color}-500 text-${col.color}-600 scale-110 shadow-[0_0_0_4px_rgba(59,130,246,0.1)] animate-pulse` // Glow effect
                                                    : isVisited
                                                        ? 'bg-blue-500 border-blue-500 text-white' // Completed state
                                                        : 'bg-white border-gray-200 text-gray-300 hover:border-gray-300' // Future state
                                                }
                                        `}>
                                                {(() => {
                                                    switch (cid) {
                                                        case 'saved': return <Clock size={isActive ? 20 : 18} />;
                                                        case 'applied': return <Send size={isActive ? 20 : 18} />;
                                                        case 'screening': return <Search size={isActive ? 20 : 18} />;
                                                        case 'aptitude': return <Calculator size={isActive ? 20 : 18} />;
                                                        case 'technical': return <Code size={isActive ? 20 : 18} />;
                                                        case 'interview': return <Users size={isActive ? 20 : 18} />;
                                                        case 'offer': return <Briefcase size={isActive ? 20 : 18} />;
                                                        case 'rejected': return <XCircle size={isActive ? 20 : 18} />;
                                                        default: return <FileText size={isActive ? 20 : 18} />;
                                                    }
                                                })()}
                                            </div>
                                            <span className={`
                                            text-[11px] font-bold uppercase tracking-wider text-center whitespace-nowrap px-2 py-1 rounded-lg transition-colors
                                            ${isActive ? `text-${col.color}-700 bg-${col.color}-50` : isVisited ? 'text-gray-900 font-semibold' : 'text-gray-400 font-medium'}
                                        `}>
                                                {col.id === 'saved' ? 'Wishlist' : col.title}
                                            </span>
                                        </button>


                                    </React.Fragment>
                                );
                            });
                        })()}
                    </div>
                </div>





                {/* Main Content Grid - The Two-Column Balance */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Notes & Input (70%) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Personal Notes - The Workspace */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-0 overflow-hidden relative group">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <CheckSquare size={16} className="text-gray-500" /> Personal Notes
                                </h3>
                                <div className="flex items-center gap-2">
                                    {!hasChanges && <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> All changes saved</span>}
                                    {hasChanges && (
                                        <button
                                            onClick={handleSave}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full transition-colors"
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="relative">
                                <textarea
                                    className="w-full h-[500px] p-6 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none resize-none bg-white font-sans leading-relaxed selection:bg-blue-100 selection:text-blue-900"
                                    placeholder="Start typing your notes here..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    spellCheck={false}
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>

                        {/* Reflection Section - Conditional */}
                        {status.title === 'Rejected' && (
                            <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6">
                                <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2 font-sans">
                                    <span className="p-1.5 bg-red-100 rounded-lg"><MoreVertical size={16} className="text-red-600" /></span>
                                    Reflection & Improvements
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-red-700 mb-1">REJECTED ROUND</label>
                                        <select
                                            value={rejectionRound}
                                            onChange={(e) => setRejectionRound(e.target.value)}
                                            className="w-full text-sm border border-red-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 text-gray-700"
                                        >
                                            <option value="">Select Round...</option>
                                            <option value="Resume Screening">Resume Screening</option>
                                            <option value="Online Assessment">Online Assessment</option>
                                            <option value="Technical Interview">Technical Interview</option>
                                            <option value="System Design">System Design</option>
                                            <option value="Managerial/Behavioral">Managerial</option>
                                            <option value="HR Round">HR Round</option>
                                            <option value="Offer Negotiation">Offer Negotiation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-red-700 mb-1">REASON</label>
                                        <select
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            className="w-full text-sm border border-red-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 text-gray-700"
                                        >
                                            <option value="">Select Reason...</option>
                                            <option value="Technical Skills">Technical Skills</option>
                                            <option value="Experience">Experience</option>
                                            <option value="Culture Fit">Culture Fit</option>
                                            <option value="Salary">Salary</option>
                                            <option value="Position Closed">Position Closed</option>
                                            <option value="No Feedback">No Feedback</option>
                                        </select>
                                    </div>
                                </div>

                                <p className="text-sm text-red-600 mb-2 font-medium">Reflection Notes:</p>
                                <textarea
                                    className="w-full h-32 p-4 border border-red-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none font-sans bg-white"
                                    placeholder="What can I improve for next time?"
                                    value={reflection}
                                    onChange={(e) => setReflection(e.target.value)}
                                />
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={!hasChanges}
                                        className={getStatusButtonClass(status.color, hasChanges)}
                                    >
                                        {hasChanges ? 'Save Reflection' : 'Saved'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: History */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className={`bg-white rounded-xl shadow-sm border border-${status.color}-200 p-6`}>
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 font-sans">
                                <Clock size={18} className={`text-${status.color}-600`} /> Activity History
                            </h3>
                            <div className="relative pl-2">
                                {/* Vertical Line */}
                                <div className="absolute left-[21px] top-2 bottom-4 border-l-2 border-dotted border-gray-300"></div>

                                <div className="space-y-8">
                                    {(() => {
                                        let historyEvents: any[] = [];
                                        // 1. Use actual stored history
                                        if (job.history && job.history.length > 0) {
                                            historyEvents = [...job.history].map((entry) => {
                                                const step = entry.status;
                                                const date = new Date(entry.date);
                                                let color = 'blue';
                                                if (step === 'applied' || step === 'saved') color = 'gray';
                                                else if (step === 'rejected') color = 'red';
                                                else if (step === 'offer') color = 'green';

                                                const colTitle = INITIAL_COLUMNS.find(c => c.id === step)?.title || step;

                                                let displayTitle = `Moved to ${colTitle}`;
                                                if (step === 'applied') displayTitle = 'Application Submitted';
                                                if (step === 'saved') displayTitle = 'Job Saved';

                                                return {
                                                    step,
                                                    title: displayTitle,
                                                    dateObject: date,
                                                    date: date.toLocaleDateString('en-GB'),
                                                    color
                                                };
                                            });
                                        } else {
                                            // Fallback legacy logic
                                            historyEvents = [
                                                { step: 'Applied', title: `Application Submitted`, dateObject: new Date(job.date), date: new Date(job.date).toLocaleDateString('en-GB'), color: 'gray' },
                                                { step: status.title, title: `Current: ${status.title}`, dateObject: new Date(), date: new Date().toLocaleDateString('en-GB'), color: 'blue' }
                                            ];
                                        }

                                        return [...historyEvents].reverse().map((event, i) => {
                                            let bgClass = 'bg-blue-50'; let textClass = 'text-blue-600'; let borderClass = 'border-blue-200';

                                            if (event.color === 'gray') { bgClass = 'bg-gray-50'; textClass = 'text-gray-500'; borderClass = 'border-gray-200'; }
                                            if (event.color === 'red') { bgClass = 'bg-red-50'; textClass = 'text-red-600'; borderClass = 'border-red-200'; }
                                            if (event.color === 'green') { bgClass = 'bg-green-50'; textClass = 'text-green-600'; borderClass = 'border-green-200'; }

                                            let Icon = CheckCircle;
                                            const s = event.step.toLowerCase();
                                            if (s === 'applied') Icon = Send;
                                            else if (s === 'rejected') Icon = XCircle;
                                            else if (s === 'offer') Icon = Briefcase;

                                            return (
                                                <div key={i} className="relative flex gap-4 items-start group">
                                                    <div className={`
                                                            w-7 h-7 rounded-full ${bgClass} ${textClass} border ${borderClass} 
                                                            flex items-center justify-center shrink-0 z-10 ring-4 ring-white
                                                        `}>
                                                        <Icon size={12} />
                                                    </div>
                                                    <div className="pt-0.5">
                                                        <p className="text-xs font-bold text-gray-900 leading-tight">{event.title}</p>
                                                        <p className="text-[10px] text-gray-400 mt-1 font-mono">{event.date}</p>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Resumes Section (Only show if no resume is linked OR attached) */}
                {
                    !linkedResumeId && !externalResume && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Resumes</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {allResumes.length === 0 ? (
                                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500 mb-4">No resumes yet</p>
                                        <Button onClick={handleCreateNew}>
                                            <Plus size={16} className="mr-2" /> Create Your First Resume
                                        </Button>
                                    </div>
                                ) : (
                                    allResumes.map((resume) => (
                                        <div
                                            key={resume.id}
                                            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <FileText size={20} className="text-blue-600 flex-shrink-0" />
                                                <div className="relative">
                                                    <button className="p-1 hover:bg-gray-100 rounded">
                                                        <MoreVertical size={16} className="text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                {resume.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-3">
                                                Edited {new Date(resume.updatedAt).toLocaleDateString()}
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(resume)}
                                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setPreviewResume(resume);
                                                        setShowPreview(true);
                                                    }}
                                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                                >
                                                    Preview
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )
                }
            </main >

            {/* Resume Preview Modal */}
            {
                showPreview && previewResume && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
                        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{previewResume.title}</h2>
                                    <p className="text-sm text-gray-500 mt-1">Resume Preview</p>
                                </div>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body - Resume Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-gray-50">
                                <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto">
                                    {/* Personal Info */}
                                    {previewResume.content?.personalInfo && (
                                        <div className="mb-6 pb-4 border-b-2 border-blue-600">
                                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                                {previewResume.content.personalInfo.fullName || 'Your Name'}
                                            </h1>
                                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                                {previewResume.content.personalInfo.email && <span>{previewResume.content.personalInfo.email}</span>}
                                                {previewResume.content.personalInfo.phone && <span>• {previewResume.content.personalInfo.phone}</span>}
                                                {previewResume.content.personalInfo.linkedin && <span>• {previewResume.content.personalInfo.linkedin}</span>}
                                            </div>
                                        </div>
                                    )}

                                    {/* Summary */}
                                    {previewResume.content?.summary && (
                                        <div className="mb-6">
                                            <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-2">Professional Summary</h2>
                                            <p className="text-gray-700 leading-relaxed">{previewResume.content.summary}</p>
                                        </div>
                                    )}

                                    {/* Experience */}
                                    {previewResume.content?.experience?.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3">Experience</h2>
                                            {previewResume.content.experience.map((exp: any, idx: number) => (
                                                <div key={idx} className="mb-4">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                                                            <p className="text-gray-600 text-sm">{exp.company}</p>
                                                        </div>
                                                        <span className="text-gray-500 text-sm">{exp.duration}</span>
                                                    </div>
                                                    {exp.description && <p className="text-gray-700 text-sm mt-1">{exp.description}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {previewResume.content?.skills?.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-2">Skills</h2>
                                            <p className="text-gray-700">{previewResume.content.skills.join(' • ')}</p>
                                        </div>
                                    )}

                                    {/* Projects */}
                                    {previewResume.content?.projects?.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3">Projects</h2>
                                            {previewResume.content.projects.map((proj: any, idx: number) => (
                                                <div key={idx} className="mb-3">
                                                    <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                                                    {proj.description && <p className="text-gray-700 text-sm mt-1">{proj.description}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Education */}
                                    {previewResume.content?.education?.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3">Education</h2>
                                            {previewResume.content.education.map((edu: any, idx: number) => (
                                                <div key={idx} className="mb-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                                                            <p className="text-gray-600 text-sm">{edu.school}</p>
                                                        </div>
                                                        <span className="text-gray-500 text-sm">{edu.year}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Certifications */}
                                    {previewResume.content?.certifications?.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-2">Certifications</h2>
                                            {previewResume.content.certifications.map((cert: any, idx: number) => (
                                                <p key={idx} className="text-gray-700 text-sm mb-1">
                                                    {cert.name} {cert.issuer && `- ${cert.issuer}`}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default JobDetailsPage;
