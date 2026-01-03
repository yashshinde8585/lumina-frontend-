import React, { useState } from 'react';
import { Type, Layout, Grid, Check } from 'lucide-react';

interface DesignSidebarProps {
    fontFamily: string;
    setFontFamily: (font: string) => void;
    accentColor: string;
    setAccentColor: (color: string) => void;
    usage: 'sidebar' | 'drawer';
    isCompact: boolean;
    setIsCompact: (compact: boolean) => void;
}

export const DesignSidebar: React.FC<DesignSidebarProps> = ({
    fontFamily,
    setFontFamily,
    accentColor,
    setAccentColor,
    isCompact,
    setIsCompact
}) => {
    const [activeTab, setActiveTab] = useState<'appearance' | 'layout' | 'templates'>('appearance');

    const tabs = [
        { id: 'appearance', icon: Type, label: 'Appearance' },
        { id: 'layout', icon: Layout, label: 'Layout' },
        { id: 'templates', icon: Grid, label: 'Templates' },
    ];

    const colors = ['#2563EB', '#D97706', '#059669', '#DC2626', '#7C3AED', '#000000'];

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden shadow-xl z-30">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-800">Design Controls</h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* APPERANCE TAB */}
                {activeTab === 'appearance' && (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Typography</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setFontFamily('sans')}
                                    className={`p-3 rounded-lg border text-left transition-all ${fontFamily === 'sans' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <span className="block text-xl font-bold font-sans mb-1">Aa</span>
                                    <span className="text-xs text-gray-500">Modern Sans</span>
                                </button>
                                <button
                                    onClick={() => setFontFamily('serif')}
                                    className={`p-3 rounded-lg border text-left transition-all ${fontFamily === 'serif' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <span className="block text-xl font-bold font-serif mb-1">Aa</span>
                                    <span className="text-xs text-gray-500">Classic Serif</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Accent Color</label>
                            <div className="grid grid-cols-6 gap-2">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setAccentColor(color)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${accentColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                                        style={{ backgroundColor: color }}
                                    >
                                        {accentColor === color && <Check size={12} className="text-white" />}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="color"
                                    value={accentColor}
                                    onChange={(e) => setAccentColor(e.target.value)}
                                    className="w-full h-8 rounded cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* LAYOUT TAB */}
                {activeTab === 'layout' && (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Spacing & Density</label>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setIsCompact(false)}
                                    className={`w-full p-3 flex items-center justify-between rounded-lg border ${!isCompact ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                >
                                    <span className="text-sm font-medium">Comfortable</span>
                                    {!isCompact && <Check size={16} className="text-blue-600" />}
                                </button>
                                <button
                                    onClick={() => setIsCompact(true)}
                                    className={`w-full p-3 flex items-center justify-between rounded-lg border ${isCompact ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                >
                                    <span className="text-sm font-medium">Compact</span>
                                    {isCompact && <Check size={16} className="text-blue-600" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400">Adjusts margins and line height to fit more content.</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Photo</label>
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">Coming Soon</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-50 cursor-not-allowed">
                                <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                                </div>
                                <span className="text-sm text-gray-500">Show Photo</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* TEMPLATES TAB */}
                {activeTab === 'templates' && (
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Template</label>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`aspect-[3/4] bg-gray-100 rounded border hover:border-blue-500 cursor-pointer transition-all relative overflow-hidden group ${i === 1 ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity">
                                        <span className="bg-white text-xs px-2 py-1 rounded shadow-sm font-medium">Preview</span>
                                    </div>
                                    <div className="p-2 space-y-2">
                                        <div className="w-1/2 h-2 bg-gray-300 rounded"></div>
                                        <div className="w-full h-1 bg-gray-200 rounded"></div>
                                        <div className="w-full h-1 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
