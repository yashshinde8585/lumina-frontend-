import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { ResumeData } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Linkedin } from 'lucide-react';
import LexicalEditor from './LexicalEditor';
import { SectionSummary, SectionSkills, SectionList } from '../components/editor/ResumeSections';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { DesignSidebar } from '../components/editor/DesignSidebar';
import { ResumeForm } from '../components/editor/ResumeForm';
import { usePrintResume } from '../hooks/usePrintResume';
import { resumeService } from '../services/resumeService';
import { authService } from '../services/authService';
import { FONTS, THEME_COLORS, TEMPLATES } from '../utils/constants';
// @ts-ignore
import SaveResumeWithJobModal, { JobDetails } from '../components/dashboard/SaveResumeWithJobModal';
import { ATSView } from '../components/editor/ATSView';



const Editor: React.FC = () => {
    const { resumeData, setResumeData, updateSection } = useResume();
    const location = useLocation();
    const navigate = useNavigate();

    // UI State
    const [viewMode, setViewMode] = useState<string>(location.state?.viewMode || 'split'); // 'form' | 'split' | 'preview'
    const [fontFamily, setFontFamily] = useState<string>(FONTS.SERIF);
    const [accentColor, setAccentColor] = useState<string>(THEME_COLORS.PRIMARY);
    const [isCompact, setIsCompact] = useState<boolean>(location.state?.template === TEMPLATES.COMPACT);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isATSMode, setIsATSMode] = useState<boolean>(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

    // Load resume data if resumeId is provided
    React.useEffect(() => {
        const resumeId = location.state?.resumeId;
        if (resumeId) {
            // Load resume from localStorage
            const savedResumes = localStorage.getItem('savedResumes');
            if (savedResumes) {
                const resumes = JSON.parse(savedResumes);
                const resume = resumes.find((r: any) => r.id === resumeId);
                if (resume && resume.content) {
                    setResumeData(resume.content);
                }
            }
        }
    }, [location.state?.resumeId, setResumeData]);

    // Hooks
    const { contentRef, handlePrint } = usePrintResume(
        `${resumeData?.personalInfo?.fullName || 'Resume'}_CV`
    );

    const handleSaveClick = () => {
        setIsSaveModalOpen(true);
    };

    const handleSaveWithWishlist = async (jobDetails: JobDetails) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("You must be logged in to save your resume.");
            navigate('/login');
            return;
        }

        setIsSaving(true);
        try {
            toast.loading("Saving resume...");

            // Construct title
            const userName = resumeData.personalInfo.fullName || 'User';
            const title = jobDetails.company
                ? `${userName} - ${jobDetails.company}`
                : `${userName}'s Resume`;

            const resumeToSave = {
                id: location.state?.resumeId || Date.now(), // Use existing ID if editing
                title: title,
                content: resumeData,
                updatedAt: new Date().toISOString(),
                template: isCompact ? TEMPLATES.COMPACT : TEMPLATES.DETAILED
            };

            let savedResumeData = resumeToSave;

            try {
                // Try to save to backend and get the authoritative version (with DB ID)
                const response = await resumeService.saveResume(resumeToSave);
                if (response) {
                    savedResumeData = { ...resumeToSave, ...response };
                }
            } catch (backendError) {
                console.error('Backend save failed, saving to localStorage:', backendError);
                // Fallback to local generated ID
            }

            // Always save to localStorage as backup/cache (using authoritative data)
            const savedResumes = localStorage.getItem('savedResumes');
            const resumes = savedResumes ? JSON.parse(savedResumes) : [];

            // Check if exists
            const existingIndex = resumes.findIndex((r: any) => r.id === savedResumeData.id);
            if (existingIndex >= 0) {
                resumes[existingIndex] = savedResumeData;
            } else {
                resumes.push(savedResumeData);
            }
            localStorage.setItem('savedResumes', JSON.stringify(resumes));

            // --- Wishlist Card Creation Logic ---
            if (jobDetails.company && jobDetails.role) {
                const initials = jobDetails.company.substring(0, 2).toUpperCase();
                const wishlistCard = {
                    id: `wishlist-${Date.now()}`,
                    company: jobDetails.company,
                    role: jobDetails.role,
                    initials: initials,
                    date: new Date(),
                    linkedResumeId: resumeToSave.id,
                    notes: jobDetails.notes,
                    description: jobDetails.jobUrl,
                    deadline: jobDetails.deadline,
                    history: [{
                        status: 'saved',
                        date: new Date().toISOString(),
                        type: 'status_change'
                    }]
                };

                const userEmail = authService.getUserEmail() || 'guest';
                const storageKey = `jobColumns_${userEmail}`;
                const savedColumns = localStorage.getItem(storageKey);
                let columns = savedColumns ? JSON.parse(savedColumns) : [];

                if (columns.length === 0) {
                    // Create initial columns if missing (fallback)
                    columns = [
                        { id: 'saved', title: 'Wishlist / Saved', color: 'gray', items: [] },
                        { id: 'applied', title: 'Applied', color: 'blue', items: [] },
                        { id: 'screening', title: 'Screening', color: 'orange', items: [] },
                        { id: 'aptitude', title: 'Aptitude', color: 'cyan', items: [] },
                        { id: 'technical', title: 'Technical', color: 'indigo', items: [] },
                        { id: 'interview', title: 'Interview', color: 'purple', items: [] },
                        { id: 'offer', title: 'Offer', color: 'green', items: [] },
                        { id: 'rejected', title: 'Rejected', color: 'red', items: [] }
                    ];
                }

                const wishlistColumn = columns.find((col: any) => col.id === 'saved');
                if (wishlistColumn) {
                    wishlistColumn.items.unshift(wishlistCard);
                    localStorage.setItem(storageKey, JSON.stringify(columns));
                    toast.success(`Resume saved & wishlist card created for ${jobDetails.company}!`);
                } else {
                    toast.success("Resume saved! (Could not find Wishlist column)");
                }
            } else {
                toast.success("Resume saved to Dashboard!");
            }

            toast.dismiss();
            setIsSaveModalOpen(false);
            navigate('/dashboard');
        } catch (error: any) {
            toast.dismiss();
            console.error(error);
            if (error.response && error.response.status === 401) {
                toast.error("Session expired. Please login again.");
                navigate('/login');
            } else {
                toast.error("Failed to save resume");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleInfoChange = (field: keyof ResumeData['personalInfo'], value: string) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    if (!resumeData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    // Component Props Helpers
    const commonProps = { accentColor, isCompact };

    // Config for SectionList
    const expMap = { title: 'title', subtitle: 'company', date: 'duration', desc: 'description' };
    const projMap = { title: 'name', subtitle: 'tech', date: undefined, desc: 'description' };
    const eduMap = { title: 'school', subtitle: 'degree', date: 'year', desc: undefined };
    const certMap = { title: 'name', subtitle: 'issuer', date: 'year', desc: undefined };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col overflow-hidden h-screen">
            <EditorToolbar
                viewMode={viewMode}
                setViewMode={setViewMode}
                onSave={handleSaveClick}
                onPrint={handlePrint}
                isSaving={isSaving}
                isATSMode={isATSMode}
                setIsATSMode={setIsATSMode}
            />

            <div className="flex flex-1 pt-16 h-[calc(100vh-64px)] overflow-hidden">
                {/* Left Sidebar - Hidden in Doc and Preview modes */}
                {viewMode !== 'doc' && viewMode !== 'preview' && (
                    <div className="hidden md:block h-full">
                        <DesignSidebar
                            fontFamily={fontFamily}
                            setFontFamily={setFontFamily}
                            accentColor={accentColor}
                            setAccentColor={setAccentColor}
                            usage="sidebar"
                            isCompact={isCompact}
                            setIsCompact={setIsCompact}
                        />
                    </div>
                )}

                {/* Main Workspace */}
                <div className="flex-1 flex overflow-hidden relative">

                    {/* Split View Left Pane: Form */}
                    {viewMode === 'split' && (
                        <div className="w-1/2 border-r border-gray-200 h-full overflow-y-auto bg-gray-50">
                            <ResumeForm resumeData={resumeData} updateSection={updateSection} />
                        </div>
                    )}

                    {/* Preview / Editor Pane */}
                    <div className={`flex-1 h-full overflow-y-auto bg-gray-100 p-4 md:p-8 flex justify-center ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>

                        {/* 1. Lexical Doc Mode */}
                        {viewMode === 'doc' && <div className="w-full max-w-4xl"><LexicalEditor embedded={true} isCompact={isCompact} /></div>}

                        {/* 2. ATS Mode */}
                        {viewMode !== 'doc' && viewMode !== 'preview' && isATSMode && <ATSView data={resumeData} />}

                        {/* 3. Visual Resume Preview (Form/Split View with editing) */}
                        {viewMode !== 'doc' && viewMode !== 'preview' && !isATSMode && (
                            <div className={`shadow-2xl print:shadow-none print:w-full bg-white transition-all duration-300 origin-top transform ${viewMode === 'split' ? 'scale-[0.65] md:scale-[0.85]' : 'scale-100'}`}>
                                <div
                                    ref={contentRef}
                                    className={`resume-preview w-full md:w-[210mm] min-h-[297mm] bg-white text-black page-break-fix relative ${isCompact ? 'layout-compact p-4 md:p-[12.7mm]' : 'layout-detailed p-6 md:p-[20mm]'} ${fontFamily === FONTS.SERIF ? 'font-serif-resume' : 'font-sans-resume'} transition-all`}
                                    style={{ '--resume-accent': accentColor } as React.CSSProperties}
                                >
                                    {/* Resume Header */}
                                    <header className={`resume-header mb-6 ${isCompact ? 'pb-2 mb-4 text-center' : 'pb-4'}`}>
                                        <input
                                            value={resumeData.personalInfo.fullName}
                                            onChange={(e) => handleInfoChange('fullName', e.target.value)}
                                            className={`font-bold w-full bg-transparent border-none focus:ring-0 p-0 mb-1 text-gray-900 ${isCompact ? 'text-[22pt] text-center' : 'text-4xl'}`}
                                            placeholder="Your Name"
                                        />
                                        <div className={`flex gap-3 text-gray-600 flex-wrap items-center ${isCompact ? 'text-[10pt] justify-center gap-2' : 'text-sm'}`}>
                                            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                                            {resumeData.personalInfo.phone && resumeData.personalInfo.email && <span className="text-gray-300">|</span>}
                                            {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                                            {(resumeData.personalInfo.linkedin) && (
                                                <>
                                                    <span className="text-gray-300">|</span>
                                                    <div className="flex items-center gap-1 group">
                                                        {!isCompact && <Linkedin size={14} className="text-gray-500" />}
                                                        <span>{resumeData.personalInfo.linkedin}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </header>

                                    {/* Standard Linear Layout - Components now use resume-* classes internally */}
                                    <div className={`flex flex-col ${isCompact ? 'gap-3' : 'gap-6'}`}>
                                        <SectionSummary data={resumeData.summary} update={(_, v: string) => updateSection('summary', v)} {...commonProps} />
                                        <SectionSkills skills={resumeData.skills} update={(v: string[]) => updateSection('skills', v)} {...commonProps} />
                                        <SectionList title="Experience" items={resumeData.experience} fieldMap={expMap} update={(v: any[]) => updateSection('experience', v)} {...commonProps} />
                                        <SectionList title="Projects" items={resumeData.projects} fieldMap={projMap} update={(v: any[]) => updateSection('projects', v)} {...commonProps} />
                                        <SectionList title="Education" items={resumeData.education} fieldMap={eduMap} update={(v: any[]) => updateSection('education', v)} {...commonProps} />
                                        <SectionList title="Certifications" items={resumeData.certifications || []} fieldMap={certMap} update={(v: any[]) => updateSection('certifications', v)} {...commonProps} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. Pure Preview Mode - Read-only resume display */}
                        {viewMode === 'preview' && !isATSMode && (
                            <div className="shadow-2xl print:shadow-none print:w-full bg-white">
                                <div
                                    ref={contentRef}
                                    className={`resume-preview w-full md:w-[210mm] min-h-[297mm] bg-white text-black page-break-fix relative ${isCompact ? 'layout-compact p-4 md:p-[12.7mm]' : 'layout-detailed p-6 md:p-[20mm]'} ${fontFamily === FONTS.SERIF ? 'font-serif-resume' : 'font-sans-resume'} transition-all`}
                                    style={{ '--resume-accent': accentColor } as React.CSSProperties}
                                >
                                    {/* Resume Header */}
                                    <header className={`resume-header mb-6 ${isCompact ? 'pb-2 mb-4 text-center' : 'pb-4'}`}>
                                        <h1 className={`font-bold text-gray-900 ${isCompact ? 'text-[22pt] text-center' : 'text-4xl'}`}>
                                            {resumeData.personalInfo.fullName || 'Your Name'}
                                        </h1>
                                        <div className={`flex gap-3 text-gray-600 flex-wrap items-center ${isCompact ? 'text-[10pt] justify-center gap-2' : 'text-sm'}`}>
                                            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                                            {resumeData.personalInfo.phone && resumeData.personalInfo.email && <span className="text-gray-300">|</span>}
                                            {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                                            {resumeData.personalInfo.linkedin && (
                                                <>
                                                    <span className="text-gray-300">|</span>
                                                    <span>{resumeData.personalInfo.linkedin}</span>
                                                </>
                                            )}
                                        </div>
                                    </header>

                                    {/* Summary */}
                                    {resumeData.summary && (
                                        <section className="resume-section">
                                            <h2 className="resume-heading">
                                                Professional Summary
                                            </h2>
                                            <p className={`text-gray-700 leading-relaxed ${isCompact ? 'text-[9pt]' : 'text-sm'}`}>
                                                {resumeData.summary}
                                            </p>
                                        </section>
                                    )}

                                    {/* Experience */}
                                    {resumeData.experience?.length > 0 && (
                                        <section className="resume-section">
                                            <h2 className="resume-heading">
                                                Experience
                                            </h2>
                                            {resumeData.experience.map((exp: any, idx: number) => (
                                                <div key={idx} className={isCompact ? 'mb-2' : 'mb-4'}>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className={`font-semibold ${isCompact ? 'text-[10pt]' : 'text-base'}`}>{exp.title}</h3>
                                                            <p className={`text-gray-600 ${isCompact ? 'text-[9pt]' : 'text-sm'}`}>{exp.company}</p>
                                                        </div>
                                                        <span className={`text-gray-500 ${isCompact ? 'text-[9pt]' : 'text-sm'}`}>{exp.duration}</span>
                                                    </div>
                                                    {exp.description && (
                                                        <p className={`text-gray-700 mt-1 ${isCompact ? 'text-[9pt]' : 'text-sm'}`}>{exp.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </section>
                                    )}

                                    {/* Skills */}
                                    {resumeData.skills?.length > 0 && (
                                        <section className="resume-section">
                                            <h2 className="resume-heading">
                                                Skills
                                            </h2>
                                            <p className={`text-gray-700 ${isCompact ? 'text-[9pt]' : 'text-sm'}`}>
                                                {resumeData.skills.join(' • ')}
                                            </p>
                                        </section>
                                    )}

                                    {/* Projects */}
                                    {resumeData.projects?.length > 0 && (
                                        <section className="resume-section">
                                            <h2 className="resume-heading">
                                                Projects
                                            </h2>
                                            {resumeData.projects.map((proj: any, idx: number) => (
                                                <div key={idx} className={isCompact ? 'mb-2' : 'mb-4'}>
                                                    <h3 className={`font-semibold ${isCompact ? 'text-[10pt]' : 'text-base'}`}>{proj.name}</h3>
                                                    {proj.description && (
                                                        <p className={`text-gray-700 mt-1 ${isCompact ? 'text-[9pt]' : 'text-sm'}`}>{proj.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </section>
                                    )}

                                    {/* Education */}
                                    {resumeData.education?.length > 0 && (
                                        <section className="resume-section">
                                            <h2 className="resume-heading">
                                                Education
                                            </h2>
                                            {resumeData.education.map((edu: any, idx: number) => (
                                                <div key={idx} className={isCompact ? 'mb-2' : 'mb-4'}>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className={`font-semibold ${isCompact ? 'text-[10pt]' : 'text-base'}`}>{edu.degree}</h3>
                                                            <p className={`text-gray-600 ${isCompact ? 'text-[9pt]' : 'text-sm'}`}>{edu.school}</p>
                                                        </div>
                                                        <span className={`text-gray-500 ${isCompact ? 'text-[9pt]' : 'text-sm'}`}>{edu.year}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </section>
                                    )}

                                    {/* Certifications */}
                                    {resumeData.certifications?.length > 0 && (
                                        <section className="resume-section">
                                            <h2 className="resume-heading">
                                                Certifications
                                            </h2>
                                            {resumeData.certifications.map((cert: any, idx: number) => (
                                                <div key={idx} className={isCompact ? 'mb-1' : 'mb-2'}>
                                                    <p className={`text-gray-700 ${isCompact ? 'text-[9pt]' : 'text-sm'}`}>
                                                        {cert.name} {cert.issuer && `- ${cert.issuer}`}
                                                    </p>
                                                </div>
                                            ))}
                                        </section>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <SaveResumeWithJobModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onSave={handleSaveWithWishlist}
                resumeTitle={resumeData.personalInfo.fullName || 'Untitled Resume'}
            />

            <style>{`
                /* Print & Scrollbar refinements that don't fit in Tailwind Plugin */
                @media print {
                    .print\\:hidden { display: none !important; }
                    .print\\:block { display: block !important; }
                    body { background: white; }
                    @page { margin: 0; size: auto; }
                    .shadow-2xl { shadow: none !important; box-shadow: none !important; }
                    .page-break-fix { min-height: 100vh; height: auto; overflow: visible; }
                    .break-inside-avoid { break-inside: avoid; }
                }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 3px; }
            `}</style>
        </div>
    );
};

export default Editor;
