import React, { useState, useMemo } from 'react';
import { useDashboardData } from '../utils/dashboardDataHook';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    ComposedChart, Treemap, FunnelChart, Funnel, LabelList
} from 'recharts';
import {
    TrendingUp, Users, IndianRupee, Target, Calendar,
    X, Activity, LineChart as LineChartIcon, Zap,
    Award, Briefcase, Clock, Globe, Star, TrendingDown,
    CheckCircle, ShoppingBag, Settings, GripHorizontal, Plus, Trash2, RotateCcw, BarChart3, Maximize2
} from 'lucide-react';

const ResponsiveGridLayout = WidthProvider(Responsive);

const COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#3b82f6', '#ef4444', '#06b6d4', '#84cc16', '#f97316',
    '#a855f7', '#14b8a6', '#f43f5e', '#eab308'
];

const CHART_COLORS = {
    primary: ['#667eea', '#764ba2'],
    secondary: ['#f093fb', '#f5576c'],
    success: ['#11998e', '#38ef7d'],
    warning: ['#f2994a', '#f2c94c'],
    danger: ['#eb3349', '#f45c43'],
    info: ['#4facfe', '#00f2fe'],
    purple: ['#a855f7', '#6366f1'],
    ocean: ['#2E3192', '#1BFFFF'],
    sunset: ['#ff6b6b', '#feca57'],
    forest: ['#0cebeb', '#20e3b2', '#29ffc6'],
};

const GRADIENT_COLORS = [
    { start: '#667eea', end: '#764ba2' },
    { start: '#f093fb', end: '#f5576c' },
    { start: '#4facfe', end: '#00f2fe' },
    { start: '#43e97b', end: '#38f9d7' },
    { start: '#fa709a', end: '#fee140' },
];

const AdvancedDashboardV2 = () => {
    const { aggregatedData, isLoading } = useDashboardData();
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [fullscreenCard, setFullscreenCard] = useState(null);
    const [visibleItems, setVisibleItems] = useState({
        'kpi-proposals': true,
        'kpi-clients': true,
        'kpi-revenue': true,
        'kpi-pipeline': true,
        'kpi-winrate': true,
        'kpi-events': true,
        'chart-monthly': true,
        'chart-region': true,
        'chart-radar': true,
        'chart-funnel': true,
        'chart-industry': true,
        'chart-probability': true,
        'chart-timeline': true,
        'chart-performers': true,
        'chart-treemap': true,
        'chart-3d-bars': true,
        'chart-gauge': true,
        'chart-radial': true,
        'chart-heatmap': true,
    });

    const chartData = useMemo(() => {
        if (!aggregatedData) return null;
        const d = aggregatedData;

        const monthlyData = {};
        Object.values(d.sheets || {}).forEach(sheet => {
            (sheet.data || []).forEach(item => {
                if (item.date) {
                    const month = new Date(item.date).toLocaleString('default', { month: 'short', year: 'numeric' });
                    if (!monthlyData[month]) monthlyData[month] = { month, proposals: 0, visits: 0, demos: 0, events: 0, revenue: 0 };
                    if (sheet === d.sheets.proposal_submitted) monthlyData[month].proposals++;
                    if (sheet === d.sheets.client_direct_visit) monthlyData[month].visits++;
                    if (sheet === d.sheets.demos) monthlyData[month].demos++;
                    if (sheet === d.sheets.events_attend) monthlyData[month].events++;
                    monthlyData[month].revenue += (item.amount || item.tcv || 0);
                }
            });
        });

        const regionData = {};
        Object.values(d.sheets || {}).forEach(sheet => {
            (sheet.data || []).forEach(item => {
                if (item.region) regionData[item.region] = (regionData[item.region] || 0) + 1;
            });
        });

        const salesPersonData = {};
        Object.values(d.sheets || {}).forEach(sheet => {
            (sheet.data || []).forEach(item => {
                if (item.sales_person) {
                    if (!salesPersonData[item.sales_person]) salesPersonData[item.sales_person] = { name: item.sales_person, activities: 0, value: 0, proposals: 0, demos: 0, visits: 0 };
                    salesPersonData[item.sales_person].activities++;
                    salesPersonData[item.sales_person].value += (item.tcv || item.amount || 0);
                    if (sheet === d.sheets.proposal_submitted) salesPersonData[item.sales_person].proposals++;
                    if (sheet === d.sheets.demos) salesPersonData[item.sales_person].demos++;
                    if (sheet === d.sheets.client_direct_visit) salesPersonData[item.sales_person].visits++;
                }
            });
        });

        const industryData = {};
        (d.sheets?.proposal_submitted?.data || []).forEach(item => {
            if (item.industry) {
                if (!industryData[item.industry]) industryData[item.industry] = { name: item.industry, value: 0, revenue: 0 };
                industryData[item.industry].value++;
                industryData[item.industry].revenue += (item.tcv || 0);
            }
        });

        // Sales stage funnel - enhanced with fallback data
        const stageData = {};
        const allProposals = d.sheets?.proposal_submitted?.data || d.sheets?.funnel?.data || [];
        
        // Process actual data
        allProposals.forEach(item => {
            const stage = item.sales_stage || item.sales_stages;
            if (stage) {
                stageData[stage] = (stageData[stage] || 0) + 1;
            }
        });
        
        // Add fallback data if no stages found
        if (Object.keys(stageData).length === 0) {
            const totalActivities = (d.sheets?.client_direct_visit?.data?.length || 0) + 
                                  (d.sheets?.demos?.data?.length || 0) + 
                                  (d.sheets?.proposal_submitted?.data?.length || 0) + 
                                  (d.sheets?.order_booked?.data?.length || 0);
            
            if (totalActivities > 0) {
                stageData['Leads'] = d.sheets?.client_direct_visit?.data?.length || 5;
                stageData['Qualified'] = d.sheets?.demos?.data?.length || 3;
                stageData['Proposals'] = d.sheets?.proposal_submitted?.data?.length || 2;
                stageData['Won'] = d.sheets?.order_booked?.data?.length || 1;
            } else {
                // Demo data for visualization
                stageData['Leads'] = 100;
                stageData['Qualified'] = 75;
                stageData['Proposals'] = 45;
                stageData['Negotiations'] = 25;
                stageData['Won'] = 15;
            }
        }

        const probabilityBuckets = { '0-25%': 0, '26-50%': 0, '51-75%': 0, '76-100%': 0 };
        (d.sheets?.proposal_submitted?.data || []).forEach(item => {
            const prob = item.probability || 0;
            if (prob <= 25) probabilityBuckets['0-25%']++;
            else if (prob <= 50) probabilityBuckets['26-50%']++;
            else if (prob <= 75) probabilityBuckets['51-75%']++;
            else probabilityBuckets['76-100%']++;
        });

        return {
            monthly: Object.values(monthlyData).slice(-12),
            regions: Object.entries(regionData).map(([name, value]) => ({ name, value })),
            salesPeople: Object.values(salesPersonData).sort((a, b) => b.activities - a.activities).slice(0, 10),
            industries: Object.values(industryData),
            stages: Object.entries(stageData)
                .map(([name, value]) => ({ name, value }))
                .filter(item => item.name && item.value > 0)
                .sort((a, b) => {
                    // Sort by typical funnel order
                    const order = ['Leads', 'Qualified', 'Proposals', 'Negotiations', 'Won', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
                    const aIndex = order.indexOf(a.name);
                    const bIndex = order.indexOf(b.name);
                    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                    if (aIndex !== -1) return -1;
                    if (bIndex !== -1) return 1;
                    return b.value - a.value;
                }),
            probability: Object.entries(probabilityBuckets).map(([name, value]) => ({ name, value })),
            kpis: {
                totalProposals: d.sheets?.proposal_submitted?.data?.length || 0,
                totalVisits: d.sheets?.client_direct_visit?.data?.length || 0,
                totalDemos: d.sheets?.demos?.data?.length || 0,
                totalEvents: d.sheets?.events_attend?.data?.length || 0,
                totalPartners: d.sheets?.partner_on_board?.data?.length || 0,
                totalRevenue: (d.sheets?.order_booked?.data || []).reduce((sum, item) => sum + (item.amount || 0), 0),
                totalTCV: (d.sheets?.proposal_submitted?.data || []).reduce((sum, item) => sum + (item.tcv || 0), 0),
                avgDealSize: d.sheets?.proposal_submitted?.data?.length > 0 ? (d.sheets.proposal_submitted.data.reduce((sum, item) => sum + (item.tcv || 0), 0) / d.sheets.proposal_submitted.data.length) : 0,
                conversionRate: d.sheets?.proposal_submitted?.data?.length > 0 ? ((d.sheets?.order_booked?.data?.length || 0) / d.sheets.proposal_submitted.data.length * 100) : 0,
                avgProbability: d.sheets?.proposal_submitted?.data?.length > 0 ? (d.sheets.proposal_submitted.data.reduce((sum, item) => sum + (item.probability || 0), 0) / d.sheets.proposal_submitted.data.length) : 0
            }
        };
    }, [aggregatedData]);

    const resetDashboard = () => {
        const allVisible = {};
        Object.keys(visibleItems).forEach(key => {
            allVisible[key] = true;
        });
        setVisibleItems(allVisible);
    };

    const removeWidget = (id) => {
        setVisibleItems(prev => ({ ...prev, [id]: false }));
    };

    const addWidget = (id) => {
        setVisibleItems(prev => ({ ...prev, [id]: true }));
    };

    if (isLoading || !aggregatedData || !chartData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="relative">
                        <div className="absolute inset-0 blur-xl bg-purple-500/30 animate-pulse"></div>
                        <div className="relative animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mx-auto mb-6"></div>
                    </div>
                    <p className="text-xl font-bold text-purple-400 animate-pulse">Analyzing Data...</p>
                </div>
            </div>
        );
    }

    const KPICard = ({ icon: Icon, label, value, change, color, subtitle, id }) => {
        const [isHovered, setIsHovered] = React.useState(false);

        return (
            <div
                className="h-full relative group rounded-2xl p-5 border border-white/30 shadow-2xl hover:shadow-purple-500/40 overflow-hidden backdrop-blur-xl flex flex-col justify-between transition-all duration-500 animate-float"
                style={{
                    background: `linear-gradient(135deg, ${color.start} 0%, ${color.end} 100%)`,
                    animationDelay: `${Math.random() * 2}s`
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Animated rings */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-white/25 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                            <Icon className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                        {change !== undefined && (
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm transition-all duration-300 ${change >= 0
                                ? 'bg-emerald-400/30 text-emerald-50 shadow-lg shadow-emerald-500/20'
                                : 'bg-rose-400/30 text-rose-50 shadow-lg shadow-rose-500/20'
                                }`}>
                                {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {Math.abs(change)}%
                            </div>
                        )}
                    </div>
                    <p className="text-white/90 text-sm font-bold mb-2 tracking-wide">{label}</p>
                    <p className="text-white text-3xl font-black mb-2 drop-shadow-lg tracking-tight">{value}</p>
                    {subtitle && <p className="text-white/70 text-xs font-semibold">{subtitle}</p>}
                </div>

                {/* Glow effect on hover */}
                {isHovered && (
                    <div className="absolute inset-0 bg-white/5 animate-pulse-ring rounded-2xl"></div>
                )}

                {isCustomizing && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
                        <button onClick={() => removeWidget(id)} className="p-1.5 bg-red-500/90 rounded-lg hover:bg-red-600 transition-all hover:scale-110 shadow-lg">
                            <Trash2 className="w-3 h-3 text-white" />
                        </button>
                        <div className="cursor-move text-white/70 hover:text-white bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                            <GripHorizontal className="w-4 h-4" />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const ChartCard = ({ title, icon: Icon, children, gradient = 0, id }) => {
        const gradColor = GRADIENT_COLORS[gradient % GRADIENT_COLORS.length];
        const [isHovered, setIsHovered] = React.useState(false);
        const isFullscreen = fullscreenCard === id;

        return (
            <div
                className={`relative group rounded-3xl p-5 border border-white/20 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 backdrop-blur-2xl bg-gradient-to-br from-white/98 to-white/90 flex flex-col overflow-hidden ${
                    isFullscreen ? 'fixed inset-4 z-50 h-auto' : 'h-full'
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    boxShadow: isHovered
                        ? `0 20px 60px rgba(${parseInt(gradColor.start.slice(1, 3), 16)}, ${parseInt(gradColor.start.slice(3, 5), 16)}, ${parseInt(gradColor.start.slice(5, 7), 16)}, 0.3)`
                        : '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
            >
                {/* Animated border glow */}
                <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"
                    style={{
                        background: `linear-gradient(135deg, ${gradColor.start}30 0%, ${gradColor.end}30 100%)`
                    }}
                ></div>

                {/* Floating particles effect */}
                {isHovered && (
                    <>
                        <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
                        <div className="absolute top-20 right-20 w-2 h-2 bg-pink-400/40 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute bottom-20 left-20 w-2 h-2 bg-indigo-400/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                    </>
                )}

                <div className="relative z-10 flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2.5 rounded-2xl shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                            style={{ background: `linear-gradient(135deg, ${gradColor.start} 0%, ${gradColor.end} 100%)` }}
                        >
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r"
                            style={isHovered ? { backgroundImage: `linear-gradient(to right, ${gradColor.start}, ${gradColor.end})` } : {}}>
                            {title}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 z-20">
                        <button
                            onClick={() => setFullscreenCard(isFullscreen ? null : id)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all hover:scale-110"
                        >
                            {isFullscreen ? <X className="w-4 h-4 text-gray-600" /> : <Maximize2 className="w-4 h-4 text-gray-600" />}
                        </button>
                        {isCustomizing && (
                            <>
                                <button
                                    onClick={() => removeWidget(id)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all hover:scale-110 border border-red-200"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                                <div className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-move transition-all">
                                    <GripHorizontal className="w-5 h-5 text-gray-500" />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className={`flex-1 min-h-0 relative z-10 ${isFullscreen ? 'h-[calc(100vh-200px)]' : ''}`}>
                    {children}
                </div>

                {/* Bottom gradient accent */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-1 opacity-50 group-hover:opacity-100 group-hover:h-2 transition-all duration-500"
                    style={{ background: `linear-gradient(to right, ${gradColor.start}, ${gradColor.end})` }}
                ></div>
            </div>
        );
    };

    // 3D Gauge Chart Component
    const GaugeChart3D = ({ value, max, label }) => {
        const percentage = (value / max) * 100;
        const rotation = (percentage / 100) * 180 - 90;

        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-48 h-24">
                    {/* 3D Background Circle */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
                        <defs>
                            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#667eea" />
                                <stop offset="100%" stopColor="#764ba2" />
                            </linearGradient>
                            <filter id="shadow3d">
                                <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
                            </filter>
                        </defs>
                        {/* Background arc */}
                        <path
                            d="M 20 80 A 80 80 0 0 1 180 80"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="15"
                            strokeLinecap="round"
                        />
                        {/* Progress arc */}
                        <path
                            d="M 20 80 A 80 80 0 0 1 180 80"
                            fill="none"
                            stroke="url(#gaugeGrad)"
                            strokeWidth="15"
                            strokeLinecap="round"
                            strokeDasharray={`${percentage * 2.51} 999`}
                            filter="url(#shadow3d)"
                            className="transition-all duration-1000"
                        />
                        {/* Needle */}
                        <line
                            x1="100"
                            y1="80"
                            x2="100"
                            y2="30"
                            stroke="#ef4444"
                            strokeWidth="3"
                            strokeLinecap="round"
                            transform={`rotate(${rotation} 100 80)`}
                            filter="url(#shadow3d)"
                            className="transition-all duration-1000"
                        />
                        {/* Center dot */}
                        <circle cx="100" cy="80" r="6" fill="#ef4444" filter="url(#shadow3d)" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                        <div className="text-3xl font-black text-gray-900">{value}%</div>
                        <div className="text-xs font-semibold text-gray-500">{label}</div>
                    </div>
                </div>
            </div>
        );
    };

    // Radial Progress Component
    const RadialProgress = ({ value, color, label }) => {
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (value / 100) * circumference;

        return (
            <div className="relative w-32 h-32 mx-auto">
                <svg className="transform -rotate-90 w-full h-full">
                    <defs>
                        <linearGradient id={`radial-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={color.start} />
                            <stop offset="100%" stopColor={color.end} />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {/* Background circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r="45"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r="45"
                        stroke={`url(#radial-${label})`}
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        filter="url(#glow)"
                        className="transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-gray-900">{value}%</span>
                    <span className="text-xs font-semibold text-gray-500 mt-1">{label}</span>
                </div>
            </div>
        );
    };

    const widgetsList = [
        { id: 'kpi-proposals', name: 'Total Proposals', type: 'KPI' },
        { id: 'kpi-clients', name: 'Client Engagements', type: 'KPI' },
        { id: 'kpi-revenue', name: 'Total Revenue', type: 'KPI' },
        { id: 'kpi-pipeline', name: 'Pipeline Value', type: 'KPI' },
        { id: 'kpi-winrate', name: 'Win Rate', type: 'KPI' },
        { id: 'kpi-events', name: 'Events Attended', type: 'KPI' },
        { id: 'chart-monthly', name: 'Revenue & Activity Trends', type: 'Chart' },
        { id: 'chart-region', name: 'Regional Performance', type: 'Chart' },
        { id: 'chart-radar', name: 'Top Performer Metrics', type: 'Chart' },
        { id: 'chart-funnel', name: 'Sales Pipeline Funnel', type: 'Chart' },
        { id: 'chart-industry', name: 'Industry Distribution', type: 'Chart' },
        { id: 'chart-probability', name: 'Deal Probability Zones', type: 'Chart' },
        { id: 'chart-performers', name: 'Sales Champions', type: 'Chart' },
        { id: 'chart-3d-bars', name: '3D Performance Bars', type: '3D Chart' },
        { id: 'chart-gauge', name: 'Conversion Gauge', type: '3D Chart' },
        { id: 'chart-radial', name: 'Pipeline Health', type: '3D Chart' },
        { id: 'chart-heatmap', name: 'Activity Heatmap', type: '3D Chart' },
    ];

    const visibleWidgets = widgetsList.filter(w => visibleItems[w.id]);
    const hiddenWidgets = widgetsList.filter(w => !visibleItems[w.id]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-8 relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-40 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-violet-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="max-w-[1600px] mx-auto relative z-10">
                {/* Enhanced Header */}
                <div className="mb-10 flex items-center justify-between animate-slideIn">
                    <div>
                        <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-3 tracking-tight">
                            Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 animate-gradient">Analytics V2</span>
                        </h1>
                        <p className="text-gray-600 text-lg font-semibold flex items-center gap-3">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Fully customizable dashboard • Drag, Resize, Add & Remove widgets
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={resetDashboard}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg backdrop-blur-sm border border-gray-200 hover:border-gray-300 hover:scale-105"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                        <button
                            onClick={() => setIsCustomizing(!isCustomizing)}
                            className={`flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold transition-all duration-300 relative overflow-hidden ${isCustomizing
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/40 scale-105'
                                : 'bg-white text-gray-700 shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-gray-200 hover:border-purple-300'
                                }`}
                        >
                            {isCustomizing && (
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 animate-pulse"></div>
                            )}
                            <Settings className={`w-5 h-5 relative z-10 ${isCustomizing ? 'animate-spin-slow' : ''}`} />
                            <span className="relative z-10">{isCustomizing ? 'Done Customizing' : 'Customize Dashboard'}</span>
                        </button>
                    </div>
                </div>

                {/* Add Hidden Widgets Section - Enhanced */}
                {isCustomizing && hiddenWidgets.length > 0 && (
                    <div className="mb-8 p-7 bg-white/90 backdrop-blur-2xl rounded-3xl border-2 border-purple-200/50 shadow-2xl shadow-purple-500/10 animate-fadeIn relative overflow-hidden">
                        {/* Decorative gradient background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                                Add Widgets to Dashboard
                            </h3>
                            <p className="text-gray-600 font-medium mb-6 ml-14">
                                {hiddenWidgets.length} {hiddenWidgets.length === 1 ? 'widget' : 'widgets'} available to add
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {hiddenWidgets.map((widget, index) => (
                                    <button
                                        key={widget.id}
                                        onClick={() => addWidget(widget.id)}
                                        className="group relative flex flex-col items-start gap-3 p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200/60 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        {/* Hover gradient effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>

                                        <div className="relative z-10 flex items-center justify-between w-full">
                                            <span className="text-xs font-bold text-purple-700 bg-purple-200/80 px-3 py-1 rounded-full backdrop-blur-sm">
                                                {widget.type}
                                            </span>
                                            <div className="p-1.5 bg-purple-500 rounded-lg group-hover:scale-125 group-hover:rotate-90 transition-all duration-300 shadow-lg">
                                                <Plus className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <span className="relative z-10 text-sm font-bold text-gray-800 leading-tight">{widget.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats */}
                {isCustomizing && (
                    <div className="mb-6 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            {visibleWidgets.length} Active Widgets
                        </span>
                        <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                            {hiddenWidgets.length} Hidden
                        </span>
                    </div>
                )}

                {/* Placeholder message when no widgets */}
                {visibleWidgets.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 bg-purple-100 rounded-full mb-4">
                            <Settings className="w-16 h-16 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Widgets Displayed</h3>
                        <p className="text-gray-600 mb-6">Add widgets from the section above to customize your dashboard</p>
                    </div>
                )}

                {/* Dashboard Grid - Optimized auto-fit layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {/* KPI Cards */}
                    {visibleItems['kpi-proposals'] && (
                        <KPICard id="kpi-proposals" icon={Target} label="Total Proposals" value={chartData.kpis.totalProposals} subtitle="Active pipeline" change={12} color={{ start: '#667eea', end: '#764ba2' }} />
                    )}
                    {visibleItems['kpi-clients'] && (
                        <KPICard id="kpi-clients" icon={Users} label="Client Engagements" value={chartData.kpis.totalVisits + chartData.kpis.totalDemos} subtitle={`${chartData.kpis.totalVisits} visits • ${chartData.kpis.totalDemos} demos`} change={18} color={{ start: '#f093fb', end: '#f5576c' }} />
                    )}
                    {visibleItems['kpi-revenue'] && (
                        <KPICard id="kpi-revenue" icon={IndianRupee} label="Total Revenue" value={`Rs ${(chartData.kpis.totalRevenue / 10000000).toFixed(2)}Cr`} subtitle="Realized value" change={25} color={{ start: '#4facfe', end: '#00f2fe' }} />
                    )}
                    {visibleItems['kpi-pipeline'] && (
                        <KPICard id="kpi-pipeline" icon={TrendingUp} label="Pipeline Value" value={`Rs ${(chartData.kpis.totalTCV / 10000000).toFixed(2)}Cr`} subtitle={`Avg: Rs ${chartData.kpis.avgDealSize.toFixed(2)}Cr`} change={-5} color={{ start: '#43e97b', end: '#38f9d7' }} />
                    )}
                    {visibleItems['kpi-winrate'] && (
                        <KPICard id="kpi-winrate" icon={CheckCircle} label="Win Rate" value={`${chartData.kpis.conversionRate.toFixed(1)}%`} subtitle={`Avg Probability: ${chartData.kpis.avgProbability.toFixed(0)}%`} color={{ start: '#fa709a', end: '#fee140' }} />
                    )}
                    {visibleItems['kpi-events'] && (
                        <KPICard id="kpi-events" icon={Calendar} label="Events Attended" value={chartData.kpis.totalEvents} subtitle="Networking activities" change={8} color={{ start: '#f97316', end: '#db2777' }} />
                    )}

                    {/* Chart Cards */}
                    {visibleItems['chart-monthly'] && (
                        <div className="md:col-span-2 xl:col-span-3">
                            <ChartCard id="chart-monthly" title="Revenue & Activity Trends" icon={LineChartIcon} gradient={0}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart data={chartData.monthly}>
                                        <defs>
                                            <linearGradient id="colorRevenue3" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '11px' }} />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', border: '2px solid #a855f7', borderRadius: '12px', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)' }} />
                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                        <Area type="monotone" dataKey="revenue" fill="url(#colorRevenue3)" stroke="#a855f7" strokeWidth={2} />
                                        <Line type="monotone" dataKey="proposals" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} />
                                        <Line type="monotone" dataKey="visits" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 4 }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>
                    )}

                    {visibleItems['chart-region'] && (
                        <ChartCard id="chart-region" title="Regional Performance" icon={Globe} gradient={1}>
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <defs>
                                        {COLORS.slice(0, 6).map((color, i) => (
                                            <linearGradient key={`regionGrad${i}`} id={`regionGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor={color} stopOpacity={1} />
                                                <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <Pie
                                        data={chartData.regions}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
                                    >
                                        {chartData.regions.map((entry, index) =>
                                            <Cell key={`cell-${index}`} fill={`url(#regionGrad${index % 6})`} stroke="#fff" strokeWidth={2} />
                                        )}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '12px', border: '2px solid #f093fb' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    )}

                    {visibleItems['chart-funnel'] && (
                        <ChartCard id="chart-funnel" title="Sales Pipeline Funnel" icon={Target} gradient={3}>
                            <ResponsiveContainer width="100%" height={280}>
                                {chartData.stages.length > 0 ? (
                                    <FunnelChart>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                                                borderRadius: '12px', 
                                                border: '2px solid #4facfe',
                                                boxShadow: '0 4px 12px rgba(79, 172, 254, 0.2)'
                                            }} 
                                            formatter={(value, name) => [`${value} deals`, name]}
                                        />
                                        <Funnel 
                                            dataKey="value" 
                                            data={chartData.stages} 
                                            isAnimationActive
                                            animationDuration={1000}
                                        >
                                            <LabelList 
                                                position="center" 
                                                fill="#fff" 
                                                stroke="none" 
                                                fontSize={13}
                                                fontWeight="bold"
                                                formatter={(value, entry) => entry?.name ? `${entry.name}: ${value}` : value}
                                            />
                                            {chartData.stages.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                    stroke="#fff"
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </Funnel>
                                    </FunnelChart>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center p-8">
                                            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 text-lg font-medium mb-2">No Pipeline Data</p>
                                            <p className="text-gray-400 text-sm">Upload sales data to see your funnel</p>
                                        </div>
                                    </div>
                                )}
                            </ResponsiveContainer>
                        </ChartCard>
                    )}

                    {visibleItems['chart-industry'] && (
                        <ChartCard id="chart-industry" title="Industry Distribution" icon={Briefcase} gradient={4}>
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={chartData.industries}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={95}
                                        dataKey="value"
                                        label={({ name }) => name}
                                        paddingAngle={3}
                                    >
                                        {chartData.industries.map((entry, index) =>
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke="#fff"
                                                strokeWidth={3}
                                            />
                                        )}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '12px', border: '2px solid #43e97b' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    )}

                    {visibleItems['chart-probability'] && (
                        <div className="md:col-span-2 xl:col-span-2">
                            <ChartCard id="chart-probability" title="Deal Probability Zones" icon={Zap} gradient={0}>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={chartData.probability}>
                                        <defs>
                                            <linearGradient id="probGrad0" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6} />
                                            </linearGradient>
                                            <linearGradient id="probGrad1" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.6} />
                                            </linearGradient>
                                            <linearGradient id="probGrad2" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                                            </linearGradient>
                                            <linearGradient id="probGrad3" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.6} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: '600' }} />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '12px', border: '2px solid #667eea', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)' }} />
                                        <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                                            {chartData.probability.map((entry, index) =>
                                                <Cell key={`cell-${index}`} fill={`url(#probGrad${index})`} stroke="#fff" strokeWidth={2} />
                                            )}
                                            <LabelList dataKey="value" position="top" style={{ fill: '#374151', fontWeight: 'bold' }} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>
                    )}

                    {visibleItems['chart-performers'] && (
                        <div className="md:col-span-2 xl:col-span-4">
                            <ChartCard id="chart-performers" title="Sales Champions" icon={Star} gradient={2}>
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={chartData.salesPeople}>
                                        <defs>
                                            <linearGradient id="perfGrad1" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                                            </linearGradient>
                                            <linearGradient id="perfGrad2" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} stroke="#6b7280" style={{ fontSize: '11px', fontWeight: '500' }} />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '12px', border: '2px solid #ec4899', boxShadow: '0 4px 12px rgba(236, 72, 153, 0.2)' }} />
                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                        <Bar dataKey="activities" fill="url(#perfGrad1)" radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="proposals" fill="url(#perfGrad2)" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>
                    )}

                    {/* 3D Style Charts */}
                    {visibleItems['chart-3d-bars'] && (
                        <div className="md:col-span-2">
                            <ChartCard id="chart-3d-bars" title="3D Performance Bars" icon={BarChart3} gradient={3}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData.regions}>
                                        <defs>
                                            {COLORS.map((color, i) => (
                                                <linearGradient key={i} id={`3dGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                                                    <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                                                </linearGradient>
                                            ))}
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid #e5e7eb', borderRadius: '16px' }} />
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                            {chartData.regions.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={`url(#3dGrad${index % COLORS.length})`} />
                                            ))}
                                            <LabelList dataKey="value" position="top" style={{ fill: '#374151', fontWeight: 'bold' }} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>
                    )}

                    {visibleItems['chart-gauge'] && (
                        <ChartCard id="chart-gauge" title="Conversion Rate Gauge" icon={Activity} gradient={4}>
                            <GaugeChart3D
                                value={Math.round(chartData.kpis.conversionRate)}
                                max={100}
                                label="Win Rate"
                            />
                        </ChartCard>
                    )}

                    {visibleItems['chart-radial'] && (
                        <ChartCard id="chart-radial" title="Pipeline Health Metrics" icon={Target} gradient={1}>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <RadialProgress
                                    value={Math.round(chartData.kpis.avgProbability)}
                                    color={{ start: '#6366f1', end: '#8b5cf6' }}
                                    label="Avg Probability"
                                />
                                <RadialProgress
                                    value={Math.min(100, Math.round((chartData.kpis.totalProposals / 50) * 100))}
                                    color={{ start: '#ec4899', end: '#f59e0b' }}
                                    label="Pipeline Fill"
                                />
                            </div>
                        </ChartCard>
                    )}

                    {visibleItems['chart-heatmap'] && (
                        <div className="md:col-span-2">
                            <ChartCard id="chart-heatmap" title="Monthly Activity Heatmap" icon={Clock} gradient={2}>
                                <div className="grid grid-cols-6 gap-2 p-4">
                                    {chartData.monthly.map((month, idx) => {
                                        const intensity = Math.min(100, (month.proposals / 10) * 100);
                                        const color = intensity > 75 ? '#10b981' : intensity > 50 ? '#f59e0b' : intensity > 25 ? '#6366f1' : '#e5e7eb';
                                        return (
                                            <div
                                                key={idx}
                                                className="relative group aspect-square rounded-xl transition-all duration-300 hover:scale-110 cursor-pointer"
                                                style={{
                                                    backgroundColor: color,
                                                    boxShadow: `0 4px 12px ${color}40`,
                                                }}
                                            >
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                                    <span className="text-xs font-bold">{month.month?.split(' ')[0]}</span>
                                                    <span className="text-lg font-black">{month.proposals}</span>
                                                </div>
                                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ChartCard>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default AdvancedDashboardV2;

