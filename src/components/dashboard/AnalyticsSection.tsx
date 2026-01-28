import React, { useState, useMemo } from 'react';
import { Users, CheckCircle, Award, Target, Plus, XCircle, Calculator, Code, Filter, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BoardColumn } from '../../types';
import { calculateVelocityData } from '../../utils/analyticsUtils';

interface AnalyticsSectionProps {
    columns: BoardColumn[];
    onFunnelClick?: (columnId: string) => void;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ columns, onFunnelClick }) => {
    const [timeFilter, setTimeFilter] = useState<'7days' | '30days' | '3months' | 'all'>('7days');
    const [showTimeFilter, setShowTimeFilter] = useState(false);



    // Target State
    const [dailyTarget, setDailyTarget] = useState(() => {
        const saved = localStorage.getItem('dailyTarget');
        return saved ? parseInt(saved) : 3;
    });
    const [showTargetModal, setShowTargetModal] = useState(false);
    const [tempDaily, setTempDaily] = useState(dailyTarget);

    const navigate = useNavigate();

    // --- Metrics Helper ---
    const getLifetimeCount = (colId: string) => {
        const allItems = columns.flatMap(col => col.items);
        return allItems.filter(item => {
            const hasHistoryEntry = item.history?.some(h => h.status === colId);
            const isCurrentlyInStatus = columns.find(c => c.id === colId)?.items.some(i => i.id === item.id);

            if (colId === 'applied') {
                // For applied, we consider anything that isn't just in the 'saved' column
                const isSaved = columns.find(c => c.id === 'saved')?.items.some(i => i.id === item.id);
                return !isSaved || hasHistoryEntry;
            }

            return hasHistoryEntry || isCurrentlyInStatus;
        }).length;
    };

    // --- Metrics Calculations ---
    const totalJobs = columns.reduce((sum, col) => sum + (col.items?.length || 0), 0);
    const appliedJobs = columns.find(col => col.id === 'applied')?.items?.length || 0;
    const screeningJobs = columns.find(col => col.id === 'screening')?.items?.length || 0;
    const aptitudeJobs = columns.find(col => col.id === 'aptitude')?.items?.length || 0;
    const technicalJobs = columns.find(col => col.id === 'technical')?.items?.length || 0;
    const interviewJobs = columns.find(col => col.id === 'interview')?.items?.length || 0;
    const offerJobs = columns.find(col => col.id === 'offer')?.items?.length || 0;


    const rejectionStats = useMemo(() => {
        const rejectedCol = columns.find(col => col.id === 'rejected');
        if (!rejectedCol || !rejectedCol.items) return { stats: [], total: 0 };

        const filteredItems = rejectedCol.items;

        const counts: Record<string, number> = {};
        filteredItems.forEach((job) => {
            const reason = job.rejectionReason || 'Other';
            counts[reason] = (counts[reason] || 0) + 1;
        });

        const stats = Object.entries(counts)
            .sort((a, b) => b[1] - a[1]) // Sort desc
            .slice(0, 3); // Top 3

        return { stats, total: filteredItems.length };
    }, [columns]);

    const velocityData = useMemo(() => {
        return calculateVelocityData(columns, timeFilter);
    }, [columns, timeFilter]);

    const metrics = [
        { id: 'applied', label: 'Applied', value: appliedJobs, icon: Users, color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700', iconColor: 'text-blue-600', lifetime: getLifetimeCount('applied') },
        { id: 'screening', label: 'Review', value: screeningJobs, icon: Target, color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-700', iconColor: 'text-orange-600', lifetime: getLifetimeCount('screening') },
        { id: 'aptitude', label: 'Aptitude', value: aptitudeJobs, icon: Calculator, color: 'cyan', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', textColor: 'text-cyan-700', iconColor: 'text-cyan-600', lifetime: getLifetimeCount('aptitude') },
        { id: 'technical', label: 'Technical', value: technicalJobs, icon: Code, color: 'indigo', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', textColor: 'text-indigo-700', iconColor: 'text-indigo-600', lifetime: getLifetimeCount('technical') },
        { id: 'interview', label: 'Interview', value: interviewJobs, icon: CheckCircle, color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700', iconColor: 'text-purple-600', lifetime: getLifetimeCount('interview') },
        { id: 'offer', label: 'Offers', value: offerJobs, icon: Award, color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700', iconColor: 'text-green-600', lifetime: getLifetimeCount('offer') }
    ];

    const filterOptions = [
        { value: '7days', label: 'Past 7 Days' },
        { value: '30days', label: 'Past 30 Days' },
        { value: '3months', label: 'Past 90 Days' },
        { value: 'all', label: 'All Time Overview' }
    ];

    const isEmpty = totalJobs === 0;

    return (
        <div className="mb-8">
            {/* 1. The 'At-a-Glance' Layer (Top) */}
            <div className="mb-10">
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
                                    {metric.lifetime > 0 && (
                                        <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap bg-green-50 text-green-600">
                                            +{metric.lifetime} <span className="opacity-70 font-medium whitespace-nowrap">all time</span>
                                        </div>
                                    )}
                                </div>

                                <div className="relative z-10">
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">{metric.value}</p>
                                    <h3 className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wide">{metric.label}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. The 'Current Focus' Layer (Middle) - Charts & Rejections */}
            <div className="mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Search Momentum Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <div className="mb-6 flex flex-row items-start justify-between gap-4">
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                    Job Search Velocity
                                </h3>
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

                                {/* Target Settings */}
                                <button
                                    onClick={() => {
                                        setTempDaily(dailyTarget);
                                        setShowTargetModal(true)
                                    }}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    title="Set Goals"
                                >
                                    <Target size={20} />
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
                                    <AreaChart
                                        data={velocityData}
                                        margin={{
                                            top: 10,
                                            right: window.innerWidth < 640 ? 5 : 10,
                                            left: window.innerWidth < 640 ? -30 : -20,
                                            bottom: 0
                                        }}
                                    >
                                        <defs>
                                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset={(() => {
                                                    const dataMax = Math.max(...velocityData.map((i) => i.applications));
                                                    if (dataMax <= 0) return 0;
                                                    if (dataMax <= dailyTarget) return 0; // If max is less than target, all red
                                                    return (dataMax - dailyTarget) / dataMax;
                                                })()} stopColor="#22c55e" stopOpacity={1} />
                                                <stop offset={(() => {
                                                    const dataMax = Math.max(...velocityData.map((i) => i.applications));
                                                    if (dataMax <= 0) return 0;
                                                    if (dataMax <= dailyTarget) return 0;
                                                    return (dataMax - dailyTarget) / dataMax;
                                                })()} stopColor="#ef4444" stopOpacity={1} />
                                            </linearGradient>
                                            <linearGradient id="splitFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset={(() => {
                                                    const dataMax = Math.max(...velocityData.map((i) => i.applications));
                                                    if (dataMax <= 0) return 0;
                                                    if (dataMax <= dailyTarget) return 0;
                                                    return (dataMax - dailyTarget) / dataMax;
                                                })()} stopColor="#22c55e" stopOpacity={0.2} />
                                                <stop offset={(() => {
                                                    const dataMax = Math.max(...velocityData.map((i) => i.applications));
                                                    if (dataMax <= 0) return 0;
                                                    if (dataMax <= dailyTarget) return 0;
                                                    return (dataMax - dailyTarget) / dataMax;
                                                })()} stopColor="#ef4444" stopOpacity={0.2} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={(props: any) => {
                                                const { x, y, payload } = props;
                                                const isMobile = window.innerWidth < 640; // sm breakpoint
                                                const label = isMobile ? payload.value.split(',')[0].split(' ')[0] : payload.value;
                                                return (
                                                    <text
                                                        x={x}
                                                        y={y + 10}
                                                        fill="#9CA3AF"
                                                        fontSize={isMobile ? 10 : 11}
                                                        fontWeight={isMobile ? 600 : 400}
                                                        textAnchor="middle"
                                                    >
                                                        {label}
                                                    </text>
                                                );
                                            }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                            allowDecimals={false}
                                            domain={[0, (dataMax: number) => Math.max(dataMax + 1, dailyTarget + 2)]}
                                        />
                                        <Tooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    const value = payload[0].value as number;
                                                    const isTargetMet = value >= dailyTarget;
                                                    const upcomingRounds = (payload[0].payload as any).upcomingRounds || [];

                                                    return (
                                                        <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl max-w-xs">
                                                            <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-1.5 h-8 rounded-full ${isTargetMet ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                                <div>
                                                                    <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
                                                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Applications</p>
                                                                </div>
                                                            </div>
                                                            {isTargetMet && (
                                                                <p className="text-[10px] font-bold mt-2 text-green-600">
                                                                    Target Met!
                                                                </p>
                                                            )}

                                                            {upcomingRounds.length > 0 && (
                                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wide mb-2">Scheduled Rounds</p>
                                                                    <div className="space-y-1.5">
                                                                        {upcomingRounds.map((round: any, idx: number) => (
                                                                            <div key={idx} className="flex items-center gap-2 text-xs">
                                                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                                                                <span className="font-medium text-gray-700 capitalize">{round.type}</span>
                                                                                <span className="text-gray-400">•</span>
                                                                                <span className="text-gray-600 truncate">{round.company}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                            cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="applications"
                                            stroke="url(#splitColor)"
                                            strokeWidth={3}
                                            fill="url(#splitFill)"
                                            dot={(props: any) => {
                                                const { cx, cy, payload } = props;
                                                const isTargetMet = payload.applications >= dailyTarget;
                                                const hasUpcomingRounds = payload.upcomingRounds && payload.upcomingRounds.length > 0;

                                                return (
                                                    <g>
                                                        <circle
                                                            key={payload.day}
                                                            cx={cx}
                                                            cy={cy}
                                                            r={4}
                                                            stroke="white"
                                                            strokeWidth={2}
                                                            fill={isTargetMet ? "#22c55e" : "#ef4444"}
                                                        />
                                                        {hasUpcomingRounds && (
                                                            <>
                                                                <circle
                                                                    cx={cx}
                                                                    cy={cy - (window.innerWidth < 640 ? 12 : 15)}
                                                                    r={window.innerWidth < 640 ? 5 : 6}
                                                                    fill="#a855f7"
                                                                    stroke="white"
                                                                    strokeWidth={2}
                                                                />
                                                                <text
                                                                    x={cx}
                                                                    y={cy - (window.innerWidth < 640 ? 10 : 13)}
                                                                    textAnchor="middle"
                                                                    fill="white"
                                                                    fontSize={window.innerWidth < 640 ? 7 : 8}
                                                                    fontWeight="bold"
                                                                >
                                                                    {payload.upcomingRounds.length}
                                                                </text>
                                                            </>
                                                        )}
                                                    </g>
                                                );
                                            }}
                                            activeDot={(props: any) => {
                                                const { cx, cy, payload } = props;
                                                const isTargetMet = payload.applications >= dailyTarget;
                                                const hasUpcomingRounds = payload.upcomingRounds && payload.upcomingRounds.length > 0;

                                                return (
                                                    <g>
                                                        <circle
                                                            cx={cx}
                                                            cy={cy}
                                                            r={window.innerWidth < 640 ? 5 : 6}
                                                            stroke="white"
                                                            strokeWidth={2}
                                                            fill={isTargetMet ? "#22c55e" : "#ef4444"}
                                                        />
                                                        {hasUpcomingRounds && (
                                                            <>
                                                                <circle
                                                                    cx={cx}
                                                                    cy={cy - (window.innerWidth < 640 ? 15 : 18)}
                                                                    r={window.innerWidth < 640 ? 7 : 8}
                                                                    fill="#a855f7"
                                                                    stroke="white"
                                                                    strokeWidth={2}
                                                                />
                                                                <text
                                                                    x={cx}
                                                                    y={cy - (window.innerWidth < 640 ? 12 : 15)}
                                                                    textAnchor="middle"
                                                                    fill="white"
                                                                    fontSize={window.innerWidth < 640 ? 8 : 9}
                                                                    fontWeight="bold"
                                                                >
                                                                    {payload.upcomingRounds.length}
                                                                </text>
                                                            </>
                                                        )}
                                                    </g>
                                                );
                                            }}
                                        />
                                        <ReferenceLine y={dailyTarget} stroke="#9CA3AF" strokeDasharray="4 4" strokeWidth={1}>
                                            <Label
                                                content={({ viewBox }) => {
                                                    const { x, y, width } = viewBox as any;
                                                    const isMobile = window.innerWidth < 640;
                                                    return (
                                                        <text
                                                            x={x! + width}
                                                            y={y}
                                                            fill="#9CA3AF"
                                                            fontSize={isMobile ? 9 : 10}
                                                            fontWeight="600"
                                                            textAnchor="end"
                                                            dy={-10}
                                                        >
                                                            Goal: {dailyTarget}
                                                        </text>
                                                    );
                                                }}
                                            />
                                        </ReferenceLine>
                                    </AreaChart>
                                </ResponsiveContainer>


                            </React.Fragment>
                        )}
                    </div>

                    {/* Rejected Stats */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                Application Rejections
                            </h3>
                        </div>


                        <div className="flex-1 flex flex-col">
                            {rejectionStats.stats.length > 0 ? (
                                <>
                                    <div className="h-48 w-full relative mb-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={rejectionStats.stats.map(([reason, count]) => ({ name: reason, value: count }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={55}
                                                    outerRadius={75}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {rejectionStats.stats.map((_, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={[
                                                                '#ef4444', // red-500
                                                                '#f59e0b', // amber-500
                                                                '#64748b', // slate-500
                                                                '#94a3b8'  // slate-400
                                                            ][index % 4]}
                                                            stroke="none"
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    content={({ active, payload }) => {
                                                        if (active && payload && payload.length) {
                                                            return (
                                                                <div className="bg-white px-3 py-2 border border-gray-100 shadow-xl rounded-lg text-xs">
                                                                    <p className="font-bold text-gray-900">{payload[0].name}</p>
                                                                    <p className="text-gray-500">{payload[0].value} Rejections</p>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-2xl font-black text-gray-900 leading-tight">{rejectionStats.total}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Distribution by Reason</p>
                                        {rejectionStats.stats.map(([reason, count], index) => {
                                            const percentage = Math.round((count / (rejectionStats.total || 1)) * 100);
                                            const colors = ['bg-red-500', 'bg-amber-500', 'bg-slate-500', 'bg-slate-400'];
                                            return (
                                                <div key={reason} className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className={`w-2 h-2 rounded-full shrink-0 ${colors[index % 4]}`} />
                                                        <span className="text-xs font-medium text-gray-600 truncate group-hover:text-gray-900 transition-colors">
                                                            {reason}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-900">{count}</span>
                                                        <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                                            {percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                                        <XCircle size={24} className="text-gray-300" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">No rejection data available yet.</p>
                                    <p className="text-xs text-gray-400 mt-1">Keep applying to build your insights!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Target Settings Modal */}
            {
                showTargetModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setShowTargetModal(false)}
                        />
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                                        <Target size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Set Your Goals</h3>
                                        <p className="text-sm text-gray-500">How many applications per day?</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Daily Goal</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                value={tempDaily}
                                                onChange={(e) => {
                                                    setTempDaily(parseInt(e.target.value));
                                                }}
                                                className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                            />
                                            <span className="w-8 text-center font-bold text-purple-600">{tempDaily}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button
                                        onClick={() => setShowTargetModal(false)}
                                        className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDailyTarget(tempDaily);
                                            localStorage.setItem('dailyTarget', tempDaily.toString());
                                            setShowTargetModal(false);
                                            toast.success("Daily goal updated!");
                                        }}
                                        className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-95"
                                    >
                                        Save Goal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AnalyticsSection;
