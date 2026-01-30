import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useResume } from '../context/ResumeContext';
import { resumeService } from '../services/resumeService';

import { Resume } from '../types';
import MyResumes from '../components/dashboard/MyResumes';
import { Logo } from '../components/Logo';



const MyResumesPage = () => {
    const navigate = useNavigate();
    const { setResumeData } = useResume();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const fetchedResumes = await resumeService.getAllResumes();
                setResumes(fetchedResumes);
            } catch (error) {
                console.error('Failed to fetch resumes:', error);
                // Fallback
                try {
                    const savedResumes = localStorage.getItem('savedResumes');
                    if (savedResumes) {
                        setResumes(JSON.parse(savedResumes));
                        toast.info('Loaded resumes from local storage');
                    }
                } catch {
                    toast.error('Could not load resumes');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchResumes();
    }, []);

    const handleCreateNew = () => {
        setResumeData({
            personalInfo: { fullName: '', email: '', phone: '', linkedin: '', links: [] },
            summary: '', experience: [], education: [], skills: [], projects: [], certifications: []
        });
        navigate('/generate');
    };

    const handleEdit = (resume: Resume) => {
        setResumeData(resume.content);
        navigate('/editor');
    };

    const handleDelete = async (id: string | number) => {
        if (confirm('Are you sure you want to delete this resume?')) {
            try {
                // Delete from backend/Cloudinary
                await resumeService.deleteResume(id);

                const updatedResumes = resumes.filter(r => r.id !== id);
                setResumes(updatedResumes);
                localStorage.setItem('savedResumes', JSON.stringify(updatedResumes));

                toast.success('Resume deleted successfully');
            } catch (error) {
                console.error('Failed to delete resume:', error);

                // Fallback: still delete locally if backend fails but maybe show error
                const updatedResumes = resumes.filter(r => r.id !== id);
                setResumes(updatedResumes);
                localStorage.setItem('savedResumes', JSON.stringify(updatedResumes));

                toast.success('Resume removed locally (Server delete failed)');
            }
        }
    };

    const handleRename = (_resume: Resume) => {
        toast.info("Rename feature pending UI unification in MyResumes");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-mist via-white to-blue-50/30">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-silver shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <Button variant="ghost" size="sm" className="mr-2 flex flex-row items-center gap-2">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Button>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <Logo size={40} />
                        <div className="text-left flex flex-col items-start">
                            <h1 className="text-xl font-bold text-charcoal leading-tight">My Resumes</h1>
                            <p className="text-xs text-steel">Manage your versions</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MyResumes
                    resumes={resumes}
                    loading={loading}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    onCreateNew={handleCreateNew}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRename={handleRename}

                />
            </main>
        </div>
    );
};

export default MyResumesPage;
