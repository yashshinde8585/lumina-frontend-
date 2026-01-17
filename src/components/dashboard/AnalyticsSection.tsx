import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, CheckCircle, Award, Target, Plus, XCircle, Calculator, Code, Filter, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { BoardColumn } from '../../types';
import { calculateVelocityData } from '../../utils/analyticsUtils';

interface AnalyticsSectionProps {
    columns: BoardColumn[];
    onFunnelClick?: (columnId: string) => void;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ columns, onFunnelClick }) => {
    const [timeFilter, setTimeFilter] = useState<'7days' | '30days' | '3months' | 'all'>('7days');
    const [showTimeFilter, setShowTimeFilter] = useState(false);
    const navigate = useNavigate();

    // --- Trend Helper ---
    const getTrend = (colId: string) => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // Flatten all current items to check their history
        const allItems = columns.flatMap(c => c.items);

        // Count items that entered this status in [1weekAgo, Now]
        const currentCount = allItems.filter(item => {
            // Check if item has a history entry for this status within range
            if (colId === 'applied') {
                // For applied, we usually check creation date if no history, or the first history entry
                const date = new Date(item.date);
                return date >= oneWeekAgo && date <= now;
            }
            return item.history?.some(h => h.status === colId && new Date(h.date) >= oneWeekAgo && new Date(h.date) <= now);
        }).length;

        // Count items that entered this status in [2weeksAgo, 1weekAgo]
        const previousCount = allItems.filter(item => {
            if (colId === 'applied') {
                const date = new Date(item.date);
                return date >= twoWeeksAgo && date < oneWeekAgo;
            }
            return item.history?.some(h => h.status === colId && new Date(h.date) >= twoWeeksAgo && new Date(h.date) < oneWeekAgo);
        }).length;

        if (previousCount === 0) return currentCount > 0 ? { value: 100, direction: 'up' } : { value: 0, direction: 'neutral' };

        const diff = currentCount - previousCount;
        const percentage = Math.round((diff / previousCount) * 100);

        return {
            value: Math.abs(percentage),
            direction: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral'
        };
    };

    // --- Metrics Calculations ---
    const totalJobs = columns.reduce((sum, col) => sum + (col.items?.length || 0), 0);
    const appliedJobs = columns.find(col => col.id === 'applied')?.items?.length || 0;
    const screeningJobs = columns.find(col => col.id === 'screening')?.items?.length || 0;
    const aptitudeJobs = columns.find(col => col.id === 'aptitude')?.items?.length || 0;
    const technicalJobs = columns.find(col => col.id === 'technical')?.items?.length || 0;
    const interviewJobs = columns.find(col => col.id === 'interview')?.items?.length || 0;
    const offerJobs = columns.find(col => col.id === 'offer')?.items?.length || 0;
    const rejectedJobs = columns.find(col => col.id === 'rejected')?.items?.length || 0;

    const rejectionStats = useMemo(() => {
        const rejectedCol = columns.find(col => col.id === 'rejected');
        if (!rejectedCol || !rejectedCol.items) return [];

        const counts: Record<string, number> = {};
        rejectedCol.items.forEach((job) => {
            const reason = job.rejectionReason || 'Other';
            counts[reason] = (counts[reason] || 0) + 1;
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1]) // Sort desc
            .slice(0, 3); // Top 3
    }, [columns]);

    const velocityData = useMemo(() => {
        return calculateVelocityData(columns, timeFilter);
    }, [columns, timeFilter]);

    const metrics = [
        { id: 'applied', label: 'Applied', value: appliedJobs, icon: Users, color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700', iconColor: 'text-blue-600', trend: getTrend('applied') },
        { id: 'screening', label: 'Review', value: screeningJobs, icon: Target, color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-700', iconColor: 'text-orange-600', trend: getTrend('screening') },
        { id: 'aptitude', label: 'Aptitude', value: aptitudeJobs, icon: Calculator, color: 'cyan', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', textColor: 'text-cyan-700', iconColor: 'text-cyan-600', trend: getTrend('aptitude') },
        { id: 'technical', label: 'Technical', value: technicalJobs, icon: Code, color: 'indigo', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', textColor: 'text-indigo-700', iconColor: 'text-indigo-600', trend: getTrend('technical') },
        { id: 'interview', label: 'Interview', value: interviewJobs, icon: CheckCircle, color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700', iconColor: 'text-purple-600', trend: getTrend('interview') },
        { id: 'offer', label: 'Offers', value: offerJobs, icon: Award, color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700', iconColor: 'text-green-600', trend: getTrend('offer') }
    ];

    const filterOptions = [
        { value: '7days', label: 'Last 7 Days Overview' },
        { value: '30days', label: 'Last 30 Days' },
        { value: '3months', label: 'Last 3 Months' },
        { value: 'all', label: 'All Time' }
    ];

    const isEmpty = totalJobs === 0;

    return (
        <div className="mb-8">
            {/* 1. The 'At-a-Glance' Layer (Top) */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {metrics.map((metric) => {
                        const Icon = metric.icon;
                        return (
                            <div
                                key={metric.id}
                                onClick={() => {
                                    onFunnelClick?.(metric.id);
                                    const jobBoardElement = document.getElementById('job-board');
                                    if (jobBoardElement) {
                                        jobBoardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                                className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between mb-3 relative z-10">
                                    <div className={`p-2.5 rounded-lg ${metric.bgColor} bg-opacity-50 group-hover:bg-opacity-100 transition-all`}>
                                        <Icon size={18} className={metric.iconColor} strokeWidth={2.5} />
                                    </div>
                                    {metric.trend.value > 0 && (
                                        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${metric.trend.direction === 'up' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>
                                            {metric.trend.direction === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                            {metric.trend.value}%
                                        </div>
                                    )}
                                </div>

                                <div className="relative z-10">
                                    <p className="text-3xl font-bold text-gray-900 tracking-tight mb-1">{metric.value}</p>
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{metric.label}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. The 'Current Focus' Layer (Middle) - Charts & Rejections */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Performance</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Search Momentum Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <div className="mb-6 flex flex-row items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-blue-600" />
                                    Job Search Activity
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 pl-7">Applications sent over time.</p>
                            </div>

                            {/* Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowTimeFilter(!showTimeFilter)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    title="Filter Time Range"
                                >
                                    <Filter size={20} />
                                </button>

                                {/* Custom Dropdown */}
                                {showTimeFilter && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-1">
                                            {filterOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setTimeFilter(option.value as any);
                                                        setShowTimeFilter(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors flex items-center justify-between
                                                ${timeFilter === option.value
                                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                >
                                                    {option.label}
                                                    {timeFilter === option.value && <CheckCircle size={14} className="text-blue-600" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Backdrop to close */}
                                {showTimeFilter && (
                                    <div className="fixed inset-0 z-40" onClick={() => setShowTimeFilter(false)}></div>
                                )}
                            </div>
                        </div>

                        {isEmpty ? (
                            <div className="h-[250px] flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <TrendingUp size={48} className="text-gray-300 mb-4" />
                                <p className="text-gray-500 font-medium mb-2">No applications yet</p>
                                <p className="text-sm text-gray-400 mb-4">Start tracking your job search journey</p>
                                <button
                                    onClick={() => navigate('/generate')}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    <Plus size={16} />
                                    Add Your First Application
                                </button>
                            </div>
                        ) : (
                            <React.Fragment>
                                <ResponsiveContainer width="100%" height={280} className="outline-none">
                                    <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset={(() => {
                                                    const dataMax = Math.max(...velocityData.map((i) => i.applications));
                                                    if (dataMax <= 0) return 0;
                                                    if (dataMax <= 3) return 0; // If max is less than target, all red
                                                    return (dataMax - 3) / dataMax;
                                                })()} stopColor="#22c55e" stopOpacity={1} />
                                                <stop offset={(() => {
                                                    const dataMax = Math.max(...velocityData.map((i) => i.applications));
                                                    if (dataMax <= 0) return 0;
                                                    if (dataMax <= 3) return 0;
                                                    return (dataMax - 3) / dataMax;
                                                })()} stopColor="#ef4444" stopOpacity={1} />
                                            </linearGradient>
                                            <linearGradient id="splitFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset={(() => {
                                                    const dataMax = Math.max(...velocityData.map((i) => i.applications));
                                                    if (dataMax <= 0) return 0;
                                                    if (dataMax <= 3) return 0;
                                                    return (dataMax - 3) / dataMax;
                                                })()} stopColor="#22c55e" stopOpacity={0.2} />
                                                <stop offset={(() => {
                                                    const dataMax = Math.max(...velocityData.map((i) => i.applications));
                                                    if (dataMax <= 0) return 0;
                                                    if (dataMax <= 3) return 0;
                                                    return (dataMax - 3) / dataMax;
                                                })()} stopColor="#ef4444" stopOpacity={0.2} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    const value = payload[0].value as number;
                                                    const isTargetMet = value >= 3;
                                                    return (
                                                        <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
                                                            <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-1.5 h-8 rounded-full ${isTargetMet ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                                <div>
                                                                    <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
                                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Applications</p>
                                                                </div>
                                                            </div>
                                                            <p className={`text-[10px] font-bold mt-2 ${isTargetMet ? 'text-green-600' : 'text-red-500'}`}>
                                                                {isTargetMet ? 'Target Met! 🎉' : 'Target Not Met'}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                            cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <ReferenceLine y={3} stroke="#9CA3AF" strokeDasharray="3 3">
                                            <Label
                                                content={({ viewBox }) => {
                                                    const { x, y, width } = viewBox as any;
                                                    return (
                                                        <text x={x! + width} y={y} fill="#9CA3AF" fontSize={10} textAnchor="end" dy={-10}>
                                                            Daily Target: 3
                                                        </text>
                                                    );
                                                }}
                                            />
                                        </ReferenceLine>
                                        <Area
                                            type="monotone"
                                            dataKey="applications"
                                            stroke="url(#splitColor)"
                                            strokeWidth={3}
                                            fill="url(#splitFill)"
                                            dot={(props: any) => {
                                                const { cx, cy, payload } = props;
                                                const isTargetMet = payload.applications >= 3;
                                                return (
                                                    <circle
                                                        key={payload.day}
                                                        cx={cx}
                                                        cy={cy}
                                                        r={4}
                                                        stroke="white"
                                                        strokeWidth={2}
                                                        fill={isTargetMet ? "#22c55e" : "#ef4444"}
                                                    />
                                                );
                                            }}
                                            activeDot={(props: any) => {
                                                const { cx, cy, payload } = props;
                                                const isTargetMet = payload.applications >= 3;
                                                return (
                                                    <circle
                                                        cx={cx}
                                                        cy={cy}
                                                        r={6}
                                                        stroke="white"
                                                        strokeWidth={2}
                                                        fill={isTargetMet ? "#22c55e" : "#ef4444"}
                                                    />
                                                );
                                            }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>

                                <div className="mt-4 flex items-center gap-3 text-sm text-gray-500 bg-blue-50/50 p-3 rounded-lg border border-blue-50">
                                    <div className="p-1.5 bg-blue-100 rounded-full text-blue-600">
                                        <ArrowUpRight size={14} />
                                    </div>
                                    Your next interview starts with today’s application.
                                </div>
                            </React.Fragment>
                        )}
                    </div>

                    {/* Rejected Stats */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col h-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <XCircle size={20} className="text-slate-400" />
                            Application Rejections
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 pl-7">Insights into non-selection.</p>

                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-gray-100">
                                <div>
                                    <span className="text-4xl font-black text-gray-900 block tracking-tight">{rejectedJobs}</span>
                                    <span className="text-sm text-gray-500 font-medium mt-1 block">Total Rejections</span>
                                </div>
                                <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
                                    <span className="text-lg font-bold text-red-600">{(rejectedJobs / (totalJobs || 1) * 100).toFixed(0)}%</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Primary Reasons for Non-Selection</p>
                                <div className="space-y-4">
                                    {rejectionStats.length > 0 ? (
                                        rejectionStats.map(([reason, count]) => {
                                            const percentage = Math.round((count / (rejectedJobs || 1)) * 100);
                                            return (
                                                <div key={reason}>
                                                    <div className="flex justify-between items-end mb-1">
                                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]" title={reason}>
                                                            {reason}
                                                        </span>
                                                        <div className="text-right">
                                                            <span className="text-xs font-bold text-gray-900">{count}</span>
                                                            <span className="text-[10px] text-gray-400 font-normal ml-1">({percentage}%)</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-red-500 rounded-full transition-all duration-500 ease-out"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <p className="text-sm text-gray-400">You haven't received any rejections yet. Keep going!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AnalyticsSection;
