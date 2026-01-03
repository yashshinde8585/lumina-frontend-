import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, CheckSquare, Clock, Save, Plus, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { JobCard } from '../components/dashboard/JobBoard';
import { toast } from 'sonner';

const JobDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const job = location.state?.job as JobCard | null;

    const [notes, setNotes] = React.useState(job?.notes === 'NA' ? '' : (job?.notes || ''));
    const linkedResumeId = job?.linkedResumeId || null;
    const [showPreview, setShowPreview] = React.useState(false);
    const [previewResume, setPreviewResume] = React.useState<any>(null);

    // Initial notes for dirty check
    const initialNotes = React.useMemo(() => job?.notes === 'NA' ? '' : (job?.notes || ''), [job?.notes]);
    const hasChanges = notes !== initialNotes;

    // MyResumes state
    const [allResumes, setAllResumes] = React.useState<any[]>([]);

    // Load resumes on mount
    React.useEffect(() => {
        const loadResumes = () => {
            const savedResumes = localStorage.getItem('savedResumes');
            if (savedResumes) {
                setAllResumes(JSON.parse(savedResumes));
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
                        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
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

    const handleSave = () => {
        if (!hasChanges) return;
        // In a real app, this would save to backend
        // Update local storage for immediate feedback in this mocked env
        const savedColumns = localStorage.getItem('jobColumns');
        if (savedColumns) {
            const columns = JSON.parse(savedColumns);
            for (const col of columns) {
                const foundJob = col.items.find((item: any) => item.id === job.id);
                if (foundJob) {
                    foundJob.notes = notes;
                    break;
                }
            }
            localStorage.setItem('jobColumns', JSON.stringify(columns));
        }

        toast.success('Changes saved successfully!');
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-mist via-white to-blue-50/30 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-silver shadow-sm">
                <div className="w-full px-8 py-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                        <ArrowLeft size={22} strokeWidth={2.5} className="text-gray-500 group-hover:text-gray-800 transition-colors" />
                        <span className="font-medium">Back to Dashboard</span>
                    </button>
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className={`flex items-center gap-2 ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Save size={16} /> Save Changes
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                {/* Job Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
                    <div className="flex items-start gap-5">
                        <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shrink-0 shadow-sm">
                            <img
                                src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s/g, '')}.com`}
                                alt={job.company}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${job.company}&background=random&size=64`;
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{job.role}</h1>
                                    <p className="text-xl text-blue-600 font-medium">{job.company}</p>
                                </div>
                                <div className="flex flex-col items-end gap-6">
                                    <div className="text-left bg-gray-50/80 rounded-lg p-3 border border-gray-100 min-w-[220px]">
                                        <h4 className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 uppercase tracking-wide font-sans">
                                            <Clock size={12} /> <span className="text-blue-600 normal-case">Screening</span>
                                        </h4>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-sm text-gray-400 flex items-center justify-end gap-2 mb-1 font-sans">
                                            <Calendar size={14} /> Applied Date
                                        </span>
                                        <p className="font-semibold text-gray-800 font-sans">
                                            {new Date(job.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Resume Applied Card */}
                            {linkedResumeId && (() => {
                                const linkedResume = allResumes.find(r => r.id === linkedResumeId || String(r.id) === String(linkedResumeId));

                                if (!linkedResume) return null;

                                return (
                                    <div className="mb-6 max-w-sm bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                                        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-3">
                                                <FileText size={20} className="text-blue-600 flex-shrink-0" />
                                                <div className="relative">
                                                    <button className="p-1 hover:bg-gray-100 rounded">
                                                        <MoreVertical size={16} className="text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 font-sans">
                                                {linkedResume.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-3 font-sans">
                                                Edited {new Date(linkedResume.updatedAt).toLocaleDateString()}
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(linkedResume)}
                                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setPreviewResume(linkedResume);
                                                        setShowPreview(true);
                                                    }}
                                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                                >
                                                    Preview
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}


                        </div>
                    </div>
                </div>

                {/* Single Column Layout */}
                {/* Single Column Layout */}
                <div className="mt-6">
                    {/* Notes Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 font-sans">
                            <CheckSquare size={18} className="text-gray-500" /> My Notes
                        </h3>
                        <textarea
                            className="w-full h-64 p-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none font-sans"
                            placeholder="Recruiter name, key details, interview thoughts, follow-up actions..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>

                {/* My Resumes Section (Only show if no resume is linked) */}
                {!linkedResumeId && (
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
                )}
            </main>

            {/* Resume Preview Modal */}
            {showPreview && previewResume && (
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
            )}
        </div>
    );
};

export default JobDetailsPage;
