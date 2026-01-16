import React, { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
// import { useResume } from '../context/ResumeContext';
import { resumeService } from '../services/resumeService'; // Service Layer
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
// import { TextArea } from '../components/ui/TextArea';
import { Card } from '../components/ui/Card';
import { ArrowLeft, Link as LinkIcon, FileText, Upload, Plus, Briefcase, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import { EXPERIENCE_LEVELS } from '../utils/constants';

// Unused variables for AI generation commented out to suppress lint warnings
// const loadingSteps = [
//     { label: "Analyzing Job Description...", icon: Sparkles },
//     { label: "Extracting Keywords...", icon: Wand2 },
//     { label: "Applying Template...", icon: Briefcase }
// ];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const Generator: React.FC = () => {
    const navigate = useNavigate();
    // const { setResumeData, setIsLoading } = useResume(); // Unused for Import
    // const [jd, setJd] = useState<string>('');
    // const [level, setLevel] = useState<string>('Entry-Level');
    // const [template, setTemplate] = useState<string>('detailed');
    const [loading] = useState<boolean>(false); // kept for modal logic structure
    // const [loadingStep, setLoadingStep] = useState<number>(0);
    // const [inputType, setInputType] = useState<'text' | 'url'>('text');
    const [activeTab, setActiveTab] = useState<'import' | 'generate'>('import');

    // Import Form State
    const [companyName, setCompanyName] = useState('');
    const [role, setRole] = useState('');
    const [jobLink, setJobLink] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importLoading, setImportLoading] = useState(false);

    // Experience Levels
    // const levels = EXPERIENCE_LEVELS;

    // Typing effect state
    // const [isTyping, setIsTyping] = useState(false);

    // Unused effects and handlers for AI generation commented out
    /*
    useEffect(() => {
        let interval: any;
        if (loading) {
            setLoadingStep(0);
            interval = setInterval(() => {
                setLoadingStep((prev) => {
                    if (prev < loadingSteps.length) return prev + 1;
                    return prev;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleFillExample = () => { ... };
    const handleGenerate = async () => { ... };
    */

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > MAX_FILE_SIZE) {
                toast.error("File size exceeds 2MB limit.");
                return;
            }
            if (file.type !== 'application/pdf') {
                toast.error("Please upload a PDF file.");
                return;
            }
            setSelectedFile(file);
            toast.success("Resume attached!");
        }
    };

    const handleAddToTracker = async () => {
        // Validation
        if (!companyName.trim() || !role.trim()) {
            toast.error("Please enter Company Name and Role.");
            return;
        }

        setImportLoading(true);
        try {
            let linkedResumeId: number | string | undefined = undefined;

            // 1. Handle File Upload (Import Resume)
            if (selectedFile) {
                try {
                    const response = await resumeService.importResume(selectedFile);
                    if (response && response.resume && response.resume.id) {
                        linkedResumeId = response.resume.id;
                        toast.success("Resume uploaded and linked!");
                    }
                } catch (error) {
                    console.error("Failed to upload resume:", error);
                    toast.error("Failed to upload resume, but adding job anyway.");
                }
            }

            // 2. Prepare New Job Card
            const newJob: any = { // Using any to bypass strict type checking for simpler state mgmt here
                id: Date.now().toString(),
                company: companyName,
                role: role,
                // link: jobLink, // If JobCard supports it
                date: new Date(),
                linkedResumeId: linkedResumeId,
                history: [{
                    status: 'applied',
                    date: new Date().toISOString(),
                    type: 'manual'
                }],
                description: jobLink // Storing link in description for now if no specific field
            };

            // 3. Update Board Logic (LocalStorage + Backend)
            const userEmail = authService.getUserEmail() || 'guest';
            const storageKey = `jobColumns_${userEmail}`;

            // Fetch current board
            let columns = [];
            try {
                // Try backend first if logged in
                if (authService.getToken()) {
                    const backendBoard = await authService.getBoard();
                    if (backendBoard && Array.isArray(backendBoard) && backendBoard.length > 0) {
                        columns = backendBoard;
                    }
                }
            } catch (err) {
                console.warn("Backend fetch failed, falling back to local storage");
            }

            if (columns.length === 0) {
                // Fallback to local storage or defaults
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    columns = JSON.parse(saved);
                } else {
                    // Import INITIAL_COLUMNS dynamically to avoid circular dependencies if possible, 
                    // or just assume we have imported it.
                    // Since we can't easily dynamic import here without async, we assume it's imported or we manually construct.
                    // For safety, let's assume valid structure exists or init simple one.
                    columns = [
                        { id: 'saved', title: 'Wishlist / Saved', items: [] },
                        { id: 'applied', title: 'Applied Jobs', items: [] },
                        // ... others implied
                    ];
                }
            }

            // Find 'applied' column or fallback to first
            const targetColId = 'applied';
            const colIndex = columns.findIndex((c: any) => c.id === targetColId);

            if (colIndex !== -1) {
                columns[colIndex].items = [newJob, ...columns[colIndex].items];
            } else {
                // If 'applied' missing, put in first
                if (columns.length > 0) columns[0].items = [newJob, ...columns[0].items];
            }

            // 4. Save Updates
            localStorage.setItem(storageKey, JSON.stringify(columns));
            if (authService.getToken()) {
                await authService.updateBoard(columns);
            }

            toast.success(`Tracked application for ${companyName}!`);

            // Reset form
            setCompanyName('');
            setRole('');
            setJobLink('');
            setSelectedFile(null);

            // Optional: Redirect or stay
            navigate('/dashboard');

        } catch (error) {
            console.error(error);
            toast.error("Failed to add job to tracker.");
        } finally {
            setImportLoading(false);
        }
    };

    // const jdBorderColor = jd.length === 0 ? 'border-gray-200 focus:ring-blue-500/20' : (jd.length < 50 ? 'border-orange-300 focus:ring-orange-200' : 'border-green-300 focus:ring-green-200');

    return (
        <div className="h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-4 selection:bg-blue-100 selection:text-blue-900">
            {/* Simple Header Breadcrumb */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-6 left-6 md:left-10 z-20"
            >
                <button
                    onClick={() => navigate('/')}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300"
                >
                    <div className="bg-white p-1 rounded-full text-slate-400 group-hover:text-blue-600 transition-colors">
                        <ArrowLeft size={14} />
                    </div>
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 pr-1">Home</span>
                </button>
            </motion.div>

            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/80 via-indigo-50/50 to-transparent"></div>
                <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
                <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            <div className="max-w-3xl w-full relative z-10 mx-auto">
                {/* Main Form Panel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className='w-full'
                >
                    <div className="relative group p-1">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-[2rem] blur opacity-0 group-hover:opacity-40 transition duration-1000"></div>
                        <Card className="relative border border-white/50 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05),0_0_0_1px_rgba(255,255,255,0.5)] backdrop-blur-xl bg-white/95 rounded-[1.5rem] p-6 overflow-hidden">

                            {/* Decorative header accent */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80"></div>

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                        <Briefcase className="text-blue-600" size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600 tracking-tight">Job Details</h2>
                                        <p className="text-sm font-medium text-gray-400">Manage efficiently</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            {/* Tabs - Segmented Control */}
                            <div className="bg-gray-100/50 p-1 rounded-full mb-4 relative">
                                <div className="grid grid-cols-2 relative z-10">
                                    <button
                                        onClick={() => setActiveTab('import')}
                                        className={`relative flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${activeTab === 'import' ? 'text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {activeTab === 'import' && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">Import Application</span>
                                    </button>

                                    <button
                                        onClick={() => toast.info("Upcoming Feature: AI Generation is currently under development to bring you the best experience!")}
                                        className={`relative flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${activeTab === 'generate' ? 'text-gray-900 shadow-sm' : 'text-gray-400 cursor-not-allowed'}`}
                                    >
                                        {activeTab === 'generate' && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            Generate with AI
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-transparent text-purple-600 border border-purple-200">Upcoming</span>
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {activeTab === 'import' ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    {/* External Tracker Callout */}
                                    <div className="bg-purple-50/30 border-l-2 border-purple-400/50 rounded-r-xl p-3 flex items-center gap-4 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                            <Briefcase className="text-purple-500" size={16} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-800">External Application Tracker</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">Add a job you&apos;ve applied to externally.</p>
                                        </div>
                                    </div>

                                    {/* Form Fields - Sophisticated Inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1 group">
                                            <label className="text-xs font-medium text-gray-600 ml-1">Company Name</label>
                                            <div className="relative transition-all duration-300">
                                                <input
                                                    value={companyName}
                                                    onChange={(e) => setCompanyName(e.target.value)}
                                                    placeholder="e.g. Acme Corp"
                                                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500/50 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all placeholder:text-gray-300 placeholder:italic placeholder:font-light"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1 group">
                                            <label className="text-xs font-medium text-gray-600 ml-1">Role / Position</label>
                                            <div className="relative">
                                                <input
                                                    value={role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    placeholder="e.g. Product Manager"
                                                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500/50 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all placeholder:text-gray-300 placeholder:italic placeholder:font-light"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1 group pt-1">
                                        <label className="text-xs font-medium text-gray-600 ml-1">Job Link <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                                <LinkIcon size={16} />
                                            </div>
                                            <input
                                                value={jobLink}
                                                onChange={(e) => setJobLink(e.target.value)}
                                                placeholder="https://..."
                                                className="w-full py-2.5 pl-10 pr-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500/50 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all placeholder:text-gray-300 placeholder:italic placeholder:font-light"
                                            />
                                        </div>
                                    </div>

                                    {/* PDF Upload - Drag & Drop Area */}
                                    <div className="space-y-2 pt-2 pb-2">
                                        <label className="text-xs font-medium text-gray-600 ml-1">Attach Resume <span className="text-gray-400">(PDF)</span></label>
                                        <div
                                            className={`relative overflow-hidden border border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer group hover:bg-blue-50/30 ${selectedFile ? 'border-blue-400/50 bg-blue-50/10' : 'border-gray-200 hover:border-blue-300'}`}
                                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23CACACAFF' stroke-width='1.5' stroke-dasharray='8%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`, border: 'none' }}
                                            onClick={() => document.getElementById('resume-upload')?.click()}
                                        >
                                            <input
                                                type="file"
                                                id="resume-upload"
                                                className="hidden"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                            />
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${selectedFile ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-white group-hover:scale-110 group-hover:shadow-lg'}`}>
                                                {selectedFile ? <FileText size={20} /> : <Upload size={20} className="text-blue-400/80" />}
                                            </div>
                                            <p className={`text-sm font-semibold transition-colors ${selectedFile ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-800'}`}>
                                                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                                            </p>
                                            {!selectedFile && <p className="text-[10px] text-gray-400 mt-1">PDFs only, up to 2MB</p>}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleAddToTracker}
                                        disabled={importLoading}
                                        className="w-full relative flex items-center justify-center py-3 text-sm font-bold tracking-wide shadow-xl shadow-blue-500/20 rounded-xl bg-gradient-to-t from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
                                    >
                                        {importLoading ? <Wand2 className="mr-2 animate-spin" size={16} /> : <Plus size={18} strokeWidth={3} className="mr-2" />}
                                        {importLoading ? 'Adding...' : 'Add to Job Tracker'}
                                    </Button>
                                </motion.div>
                            ) : (
                                <div className="text-center py-20 opacity-50">
                                    {/* AI CONTENT WOULD GO HERE */}
                                </div>
                            )}
                        </Card>
                    </div>
                </motion.div>
            </div>

            {/* Stepper Loading Modal -- Unchanged but styled slightly better if shown */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
                    >
                        {/* ... Existing Loading Content ... */}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};



export default Generator;
