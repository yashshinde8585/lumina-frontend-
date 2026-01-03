import React from 'react';
import { Button } from '../ui/Button';
import { ArrowLeft, LayoutDashboard, SplitSquareHorizontal, FileText, Save, Download, Link as LinkIcon, Undo, Redo, Eye, EyeOff, FileJson } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface EditorToolbarProps {
    viewMode: string;
    setViewMode: (mode: string) => void;
    onSave: () => void;
    onPrint: () => void;
    isSaving: boolean;
    isATSMode: boolean;
    setIsATSMode: (mode: boolean) => void;
    // Undo/Redo could be passed here if we had global state history
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    viewMode,
    setViewMode,
    onSave,
    onPrint,
    isSaving,
    isATSMode,
    setIsATSMode
}) => {
    const navigate = useNavigate();

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-6 z-50 print:hidden border-b border-gray-200">
            {/* Left: Navigation and Undo/Redo */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={18} />
                </Button>

                <div className="w-px h-6 bg-gray-200 mx-2"></div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900 p-2" title="Undo (Coming Soon)">
                        <Undo size={18} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900 p-2" title="Redo (Coming Soon)">
                        <Redo size={18} />
                    </Button>
                </div>
            </div>

            {/* Center: View Toggles */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setViewMode('form')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'form' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <LayoutDashboard size={14} /> Editor
                </button>
                <button
                    onClick={() => setViewMode('split')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'split' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <SplitSquareHorizontal size={14} /> Split
                </button>
                <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <FileText size={14} /> Preview
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* ATS Toggle */}
                <button
                    onClick={() => setIsATSMode(!isATSMode)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${isATSMode ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                    {isATSMode ? <Eye size={14} /> : <EyeOff size={14} />}
                    ATS Mode
                </button>

                <div className="w-px h-6 bg-gray-200 mx-2"></div>

                <Button onClick={onSave} variant="ghost" disabled={isSaving} className="flex items-center gap-2 text-gray-600 hover:bg-gray-50">
                    {isSaving ? <span className="flex items-center gap-2">Saving...</span> : <span className="flex items-center gap-2"><Save size={16} /> Save</span>}
                </Button>

                {/* Export Dropdown Group */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(window.localStorage.getItem('resumeData') || '{}'))}`;
                        const link = document.createElement("a");
                        link.href = jsonString;
                        link.download = "resume.json";
                        link.click();
                        toast.success("JSON Exported!");
                    }} title="Export JSON" className="p-2">
                        <FileJson size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopyLink} title="Copy Link" className="p-2">
                        <LinkIcon size={16} />
                    </Button>
                    <Button onClick={onPrint} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                        <Download size={16} /> Export PDF
                    </Button>
                </div>
            </div>
        </nav>
    );
};
