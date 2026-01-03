import React, { useState } from 'react';
import { TrendingUp, Users, CheckCircle, Award, Target, ChevronDown, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface AnalyticsSectionProps {
    columns: any[];
    onFunnelClick?: (columnId: string) => void;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ columns, onFunnelClick }) => {
    const [timeFilter, setTimeFilter] = useState<'7days' | '30days' | '3months' | 'all'>('7days');
    const navigate = useNavigate();

    // Calculate metrics from columns
    const totalJobs = columns.reduce((sum, col) => sum + (col.items?.length || 0), 0);
    const appliedJobs = columns.find(col => col.id === 'applied')?.items?.length || 0;
    const screeningJobs = columns.find(col => col.id === 'screening')?.items?.length || 0;
    const interviewJobs = columns.find(col => col.id === 'interview')?.items?.length || 0;
    const offerJobs = columns.find(col => col.id === 'offer')?.items?.length || 0;

    // Calculate conversion rates
    const applicationRate = totalJobs > 0 ? ((appliedJobs / totalJobs) * 100).toFixed(1) : '0';
    const interviewRate = appliedJobs > 0 ? ((interviewJobs / appliedJobs) * 100).toFixed(1) : '0';
    const offerRate = interviewJobs > 0 ? ((offerJobs / interviewJobs) * 100).toFixed(1) : '0';

    // Generate chart data based on columns and timeFilter
    const velocityData = React.useMemo(() => {
        // 1. Flatten all jobs from all columns
        const allJobs = columns.flatMap(col => col.items || []);

        // 2. Determine date range
        const now = new Date();
        const startDate = new Date();
        let loopCount = 0;
        let dateFormat: Intl.DateTimeFormatOptions = { weekday: 'short' }; // Mon, Tue

        switch (timeFilter) {
            case '7days':
                // Current Week (Mon - Sun)
                const day = now.getDay(); // 0 is Sun, 1 is Mon
                const diff = day === 0 ? 6 : day - 1; // Calculate days back to Monday
                startDate.setDate(now.getDate() - diff); // Set to Monday
                loopCount = 6; // 0 to 6 = 7 days
                dateFormat = { weekday: 'short' };
                break;
            case '30days':
                startDate.setDate(now.getDate() - 29);
                loopCount = 29;
                dateFormat = { month: 'short', day: 'numeric' }; // Jan 12
                break;
            case '3months':
                startDate.setDate(now.getDate() - 90);
                loopCount = 90;
                dateFormat = { month: 'short', day: 'numeric' };
                break;
            case 'all':
                startDate.setDate(now.getDate() - 180);
                loopCount = 180; // Cap at 6 months
                dateFormat = { month: 'short', year: '2-digit' };
                break;
        }

        startDate.setHours(0, 0, 0, 0); // Start of day

        // Helper to get local YYYY-MM-DD
        const getLocalDateKey = (date: Date) => {
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - (offset * 60 * 1000));
            return localDate.toISOString().split('T')[0];
        };

        // 3. Create map of dates in range
        const chartData: { fullDate: string, day: string, applications: number }[] = [];

        // Initialize all days in range with 0
        for (let i = 0; i <= loopCount; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const key = getLocalDateKey(d);

            // Format label for display
            const label = new Intl.DateTimeFormat('en-US', dateFormat).format(d);


            chartData.push({
                fullDate: key,
                day: label,
                applications: 0
            });
        }

        // 4. Fill with actual data
        allJobs.forEach(job => {
            if (!job.date) return;
            const jobDate = new Date(job.date);
            const key = getLocalDateKey(jobDate);

            // If job date is within our range map, increment
            // Note: We need to check if the key exists because of the range filter
            // We iterate through the CHART DATA to populate it, or map lookup
            const index = chartData.findIndex(d => d.fullDate === key);
            if (index !== -1) {
                chartData[index].applications += 1;
            }
        });

        return chartData;
    }, [columns, timeFilter]);

    const metrics = [
        {
            id: 'applied',
            label: 'Applied',
            value: appliedJobs,
            icon: Users,
            color: 'blue',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-700',
            iconColor: 'text-blue-600'
        },
        {
            id: 'screening',
            label: 'In Screening',
            value: screeningJobs,
            icon: Target,
            color: 'orange',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            textColor: 'text-orange-700',
            iconColor: 'text-orange-600'
        },
        {
            id: 'interview',
            label: 'Interviews',
            value: interviewJobs,
            icon: CheckCircle,
            color: 'purple',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            textColor: 'text-purple-700',
            iconColor: 'text-purple-600'
        },
        {
            id: 'offer',
            label: 'Offers',
            value: offerJobs,
            icon: Award,
            color: 'green',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-700',
            iconColor: 'text-green-600'
        }
    ];

    // Funnel steps with icons and conversion rates - MATCHING COLORS
    const funnelSteps = [
        {
            id: 'applied',
            label: 'Applied',
            value: appliedJobs,
            rate: applicationRate,
            icon: Users,
            iconBg: 'bg-blue-500',
            iconColor: 'text-white',
            textColor: 'text-blue-600'
        },
        {
            id: 'interview',
            label: 'Interview',
            value: interviewJobs,
            rate: interviewRate,
            icon: CheckCircle,
            iconBg: 'bg-purple-500',
            iconColor: 'text-white',
            textColor: 'text-purple-600'
        },
        {
            id: 'offer',
            label: 'Offer',
            value: offerJobs,
            rate: offerRate,
            icon: Award,
            iconBg: 'bg-green-500',
            iconColor: 'text-white',
            textColor: 'text-green-600'
        }
    ];

    const filterOptions = [
        { value: '7days', label: 'Last 7 Days (Sprint)' },
        { value: '30days', label: 'Last 30 Days' },
        { value: '3months', label: 'Last 3 Months' },
        { value: 'all', label: 'All Time' }
    ];

    const isEmpty = totalJobs === 0;

    // Smart Gradient Logic
    const dataMax = Math.max(...velocityData.map((i) => i.applications));
    const goal = 3;

    const gradientOffset = () => {
        if (dataMax <= 0) return 0;
        if (dataMax <= goal) return 0;
        return (dataMax - goal) / dataMax;
    };

    const off = gradientOffset();

    return (
        <div className="mb-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <div
                            key={metric.id}
                            onClick={() => onFunnelClick?.(metric.id)}
                            className={`${metric.bgColor} rounded-xl p-4 border ${metric.borderColor} hover:shadow-lg transition-all cursor-pointer group`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className={`p-2 rounded-lg ${metric.bgColor} group-hover:scale-110 transition-transform`}>
                                    <Icon size={20} className={metric.iconColor} />
                                </div>
                            </div>
                            <h3 className="text-xs font-semibold text-gray-700 mb-1">{metric.label}</h3>
                            <p className={`text-2xl font-bold ${metric.textColor}`}>{metric.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Velocity Chart & Funnel - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Search Momentum Chart (2/3 width) */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp size={20} className="text-blue-600" />
                                Search Momentum
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Your activity velocity vs. daily goals.</p>
                        </div>

                        {/* Time Filter Dropdown */}
                        <div className="relative">
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value as any)}
                                className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all"
                            >
                                {filterOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                    </div>

                    {isEmpty ? (
                        /* Empty State with CTA */
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
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset={off} stopColor="#3B82F6" stopOpacity={1} />
                                        <stop offset={off} stopColor="#EF4444" stopOpacity={1} />
                                    </linearGradient>
                                    <linearGradient id="splitFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset={off} stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset={off} stopColor="#EF4444" stopOpacity={0.2} />
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
                                            const isGoalMet = value >= 3;
                                            return (
                                                <div className={`bg-white p-3 border shadow-xl rounded-xl ${isGoalMet ? 'border-blue-100' : 'border-red-100'}`}>
                                                    <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
                                                    <p className={`text-lg font-bold ${isGoalMet ? 'text-blue-600' : 'text-red-600'}`}>
                                                        {value} <span className="text-xs font-medium text-gray-400">Applications</span>
                                                    </p>
                                                    {!isGoalMet && (
                                                        <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                                                            Below Goal (3)
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <ReferenceLine y={3} stroke="#E5E7EB" strokeDasharray="3 3">
                                    <Label
                                        content={({ viewBox }) => {
                                            const { x, y, width } = viewBox as any;
                                            return (
                                                <text x={x! + width} y={y} fill="#9CA3AF" fontSize={10} textAnchor="end" dy={-10}>
                                                    Daily Goal (3)
                                                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
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
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#60A5FA' }} // Neutral blue for dot to work on both
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Right: Application Funnel (1/3 width) */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Target size={20} className="text-blue-600" />
                        Funnel
                    </h3>

                    <div className="space-y-6">
                        {funnelSteps.map((step, index) => {
                            const Icon = step.icon;
                            const isLast = index === funnelSteps.length - 1;
                            const showRate = step.value > 0 && parseFloat(step.rate) > 0;

                            return (
                                <div key={step.id} className="relative">
                                    <div className="flex items-start gap-4">
                                        {/* Icon Circle - Filled style for consistency */}
                                        <div className="relative flex-shrink-0">
                                            <div className={`${step.iconBg} w-12 h-12 rounded-full flex items-center justify-center shadow-sm`}>
                                                <Icon size={20} className={step.iconColor} />
                                            </div>
                                            {/* Connector Line */}
                                            {!isLast && (
                                                <div className="absolute left-1/2 top-12 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300 -ml-px h-8"></div>
                                            )}
                                        </div>

                                        {/* Metrics */}
                                        <div className="flex-1 pt-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-semibold text-gray-700">{step.label}</span>
                                                {showRate && (
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700`}>
                                                        {step.rate}%
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-2xl font-bold ${step.textColor}`}>{step.value}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;
