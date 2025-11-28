import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, IndianRupee, Sparkles, Upload } from 'lucide-react';
import FilterPanel from './components/FilterPanel';
import EnhancedTable from './components/EnhancedTable';
import ExcelUpload from './components/ExcelUpload';
import DataPreview from './components/DataPreview';
import AddDataForm from './components/AddDataForm';
import { transformToDashboardFormat } from './utils/excelProcessor';
import { useDashboardData } from './utils/dashboardDataHook';
import DataManagementPanel from './components/DataManagementPanel';
import { Database } from 'lucide-react';

const SalesFunnelDashboard = () => {
  // Dashboard data hook handles multiple Excel uploads and aggregation
  const {
    datasets,
    addDataset,
    removeDataset,
    aggregatedData,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    availableFilters,
    toggleDataset,
    addRecord
  } = useDashboardData();

  // Local UI state
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [parsedExcelData, setParsedExcelData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(null);
  const [dataSource, setDataSource] = useState('default');

  // Stop loading once datasets are loaded (even if empty)
  useEffect(() => {
    // datasets will be loaded from localStorage on mount
    setLoading(false);
  }, []);

  // Handle file upload process
  const handleFileProcessed = (parsedData) => {
    setParsedExcelData(parsedData);
    setShowUploadModal(false);
    setShowPreviewModal(true);
  };

  // Accept previewed data and add as a new dataset
  const handleAcceptData = (parsedData) => {
    const transformedData = transformToDashboardFormat(parsedData);
    const filename = parsedData.filename || 'Uploaded Excel';
    addDataset(transformedData, filename);
    setDataSource('uploaded');
    setShowPreviewModal(false);
    setParsedExcelData(null);
  };

  const handleCancelPreview = () => {
    setShowPreviewModal(false);
    setParsedExcelData(null);
  };

  // Add new record to the latest active dataset
  const handleAddData = (sheetType, newRecord) => {
    addRecord(sheetType, newRecord);
    setShowAddForm(null);
  };

  // Filter function
  const filterData = (data, additionalFilters = {}) => {
    if (!data) return [];
    return data.filter((item) => {
      // Search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = Object.values(item).some(
          (value) => value && String(value).toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }
      // Filters
      const allFilters = { ...filters, ...additionalFilters };
      for (const [key, value] of Object.entries(allFilters)) {
        if (value && item[key] !== value) return false;
      }
      return true;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-shimmer w-32 h-32 rounded-full mb-4"></div>
        <p className="text-white text-xl font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  if (!aggregatedData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-cyan-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
          
          {/* Floating particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-purple-300/50 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-blue-300/40 rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 right-20 w-1 h-1 bg-pink-300/60 rounded-full animate-ping"></div>
        </div>

        {/* Main Content Card */}
        <div className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto animate-slideUp">
          {/* Hero Icon */}
          <div className="relative mb-8">
            <div className="inline-flex p-8 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl mb-6 shadow-2xl animate-glow">
              <Upload className="w-16 h-16 sm:w-20 sm:h-20 text-white animate-bounce-slow" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>

          {/* Enhanced Title */}
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 tracking-tight leading-tight animate-gradient">
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-white/80 mb-3 animate-fadeInUp">Welcome to the Future of</span>
              <span className="block animate-fadeInUp animation-delay-200">
                Sales Analytics
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-white/80 mt-3 animate-fadeInUp animation-delay-400">Dashboard</span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/70 mb-8 font-medium max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-600">
              Transform your Excel data into 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold"> powerful insights </span>
              with AI-powered analytics and stunning visualizations
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 animate-fadeInUp animation-delay-800">
            <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-white text-sm">🚀 Lightning Fast</span>
            </div>
            <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse animation-delay-200"></div>
              <span className="font-semibold text-white text-sm">🎯 Smart Filtering</span>
            </div>
            <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse animation-delay-400"></div>
              <span className="font-semibold text-white text-sm">📊 Interactive Charts</span>
            </div>
            <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-pulse animation-delay-600"></div>
              <span className="font-semibold text-white text-sm">🤖 AI Assistant</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-fadeInUp animation-delay-1000">
            <button
              onClick={() => setShowUploadModal(true)}
              className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 font-bold text-lg sm:text-xl inline-flex items-center gap-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></div>
              <Upload className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">Upload Your Excel File</span>
              <div className="relative z-10 px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm border border-white/30">
                .xlsx, .xls
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-8 animate-fadeInUp animation-delay-1200">
            <p className="text-white/60 text-sm flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">100% Secure - Your data never leaves your browser</span>
            </p>
          </div>

          {/* Stats Preview */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 animate-fadeInUp animation-delay-1400">
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">∞</div>
              <div className="text-white/60 text-sm font-medium mt-1">Files Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">10+</div>
              <div className="text-white/60 text-sm font-medium mt-1">Chart Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">24/7</div>
              <div className="text-white/60 text-sm font-medium mt-1">AI Assistant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">⚡</div>
              <div className="text-white/60 text-sm font-medium mt-1">Real-time</div>
            </div>
          </div>
        </div>

        {/* Modals for welcome screen */}
        {showUploadModal && (
          <ExcelUpload onFileProcessed={handleFileProcessed} onClose={() => setShowUploadModal(false)} />
        )}

        {showPreviewModal && parsedExcelData && (
          <DataPreview parsedData={parsedExcelData} onAccept={handleAcceptData} onCancel={handleCancelPreview} />
        )}

        {/* Custom Animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(-10deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.5); }
            50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.8), 0 0 60px rgba(59, 130, 246, 0.5); }
          }
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
          .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
          .animate-slideUp { animation: slideUp 0.8s ease-out; }
          .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
          .animate-glow { animation: glow 3s ease-in-out infinite; }
          .animate-gradient { animation: gradient 3s ease infinite; background-size: 200% 200%; }
          .animate-gradient-x { animation: gradient-x 3s ease infinite; background-size: 200% 200%; }
          .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
          .animation-delay-200 { animation-delay: 0.2s; }
          .animation-delay-400 { animation-delay: 0.4s; }
          .animation-delay-600 { animation-delay: 0.6s; }
          .animation-delay-800 { animation-delay: 0.8s; }
          .animation-delay-1000 { animation-delay: 1s; }
          .animation-delay-1200 { animation-delay: 1.2s; }
          .animation-delay-1400 { animation-delay: 1.4s; }
        `}</style>
      </div>
    );
  }

  // Alias for easier reference
  const d = aggregatedData;

  // Guarded filtered data
  const filteredProposals = d?.sheets?.proposal_submitted?.data ? filterData(d.sheets.proposal_submitted.data) : [];
  const filteredVisits = d?.sheets?.client_direct_visit?.data ? filterData(d.sheets.client_direct_visit.data) : [];
  const filteredDemos = d?.sheets?.demos?.data ? filterData(d.sheets.demos.data) : [];
  const filteredDCVisits = d?.sheets?.dc_visit?.data ? filterData(d.sheets.dc_visit.data) : [];

  // Chart data
  const funnelData = [
    { name: 'Client Visits', value: filteredVisits.length, color: '#3b82f6' },
    { name: 'Demos', value: filteredDemos.length, color: '#8b5cf6' },
    { name: 'DC Visits', value: filteredDCVisits.length, color: '#ec4899' },
    { name: 'Proposals', value: filteredProposals.length, color: '#f59e0b' },
  ];

  const regionCounts = filteredProposals.reduce((acc, item) => {
    if (item.region) acc[item.region] = (acc[item.region] || 0) + 1;
    return acc;
  }, {});
  const regionData = Object.entries(regionCounts).map(([region, count]) => ({
    region,
    proposals: count,
    visits: filteredVisits.filter((v) => v.region === region).length,
  }));

  const industryData = Object.entries(
    filteredProposals.reduce((acc, item) => {
      if (item.industry) acc[item.industry] = (acc[item.industry] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const totalTCV = filteredProposals.reduce((sum, p) => sum + (p.tcv || 0), 0);
  const avgProbability = filteredProposals.length > 0
    ? filteredProposals.reduce((sum, p) => sum + (p.probability || 0), 0) / filteredProposals.length
    : 0;

  const KPICard = ({ icon: Icon, label, value, gradient }) => (
    <div className="relative overflow-hidden glass rounded-2xl shadow-xl p-6 border border-white/20 card-hover animate-fadeIn group">
      <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <Icon className="w-32 h-32 transform rotate-12" />
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
          <p className="text-4xl font-black text-gray-800 tracking-tight">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 ring-4 ring-white/30`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children }) => (
    <div className="glass rounded-xl shadow-xl p-6 border-2 border-white/20 animate-fadeIn">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        {title}
      </h3>
      {children}
    </div>
  );

  // Table column definitions (unchanged)
  const proposalColumns = [
    { key: 'sr_no', label: 'Sr. No', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'client_name', label: 'Client', sortable: true },
    { key: 'sales_stage', label: 'Stage', sortable: true },
    { key: 'probability', label: 'Probability', sortable: true, render: (value) => value ? `${value}%` : 'N/A' },
    { key: 'tcv', label: 'TCV (Cr)', sortable: true, render: (value) => value ? `Rs ${value.toFixed(2)}` : 'N/A' },
    { key: 'sales_type', label: 'Type', sortable: true },
    { key: 'region', label: 'Region', sortable: true },
    { key: 'industry', label: 'Industry', sortable: true },
  ];

  const visitColumns = [
    { key: 'sr_no', label: 'Sr. No', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'sales_person', label: 'Sales Person', sortable: true },
    { key: 'client_name', label: 'Client', sortable: true },
    { key: 'products_pitched', label: 'Products', sortable: true },
    { key: 'industry', label: 'Industry', sortable: true },
    { key: 'region', label: 'Region', sortable: true },
  ];

  const demoColumns = [
    { key: 'sr_no', label: 'Sr. No', sortable: true },
    { key: 'sales_person', label: 'Sales Person', sortable: true },
    { key: 'client_name', label: 'Client', sortable: true },
    { key: 'contact_no', label: 'Contact', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
  ];

  const dcVisitColumns = [
    { key: 'sr_no', label: 'Sr. No', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'sales_person', label: 'Sales Person', sortable: true },
    { key: 'account_name', label: 'Account', sortable: true },
    { key: 'product_pitched', label: 'Product', sortable: true },
    { key: 'sector', label: 'Sector', sortable: true },
    { key: 'region', label: 'Region', sortable: true },
  ];

  return (
    <>
      <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          {/* Compact Header */}
          <div className="mb-6 animate-slideIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2 tracking-tight">
                  Sales <span className="text-indigo-700">Funnel</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-gray-700 text-sm">
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-indigo-200 font-medium shadow-sm">{d.metadata.report_name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-medium">Updated: {new Date(d.metadata.generated_at).toLocaleDateString()}</span>
                  {dataSource === 'uploaded' && (
                    <>
                      <span className="text-gray-400">•</span>
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-300 rounded-full text-green-700 text-xs font-bold">
                        <Upload className="w-3 h-3" />
                        <span>{d.metadata.filename || 'Excel'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="group px-4 py-2.5 bg-white text-indigo-600 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold text-sm flex items-center gap-2 border border-indigo-200"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
                <button
                  onClick={() => setShowDataManagement(true)}
                  className="group px-4 py-2.5 bg-white text-blue-600 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold text-sm flex items-center gap-2 border border-blue-200"
                >
                  <Database className="w-4 h-4" />
                  Data ({datasets.length})
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFilterChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
            onSearch={setSearchTerm}
            searchTerm={searchTerm}
            availableFilters={availableFilters}
          />

          {/* Compact KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPICard icon={Target} label="Proposals" value={filteredProposals.length} gradient="from-blue-500 to-blue-600" />
            <KPICard icon={Users} label="Client Visits" value={filteredVisits.length} gradient="from-purple-500 to-purple-600" />
            <KPICard icon={TrendingUp} label="Demos" value={filteredDemos.length} gradient="from-pink-500 to-pink-600" />
            <KPICard icon={IndianRupee} label="TCV (Cr.)" value={`₹${totalTCV.toFixed(2)}`} gradient="from-amber-500 to-amber-600" />
          </div>

          {/* Enhanced Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <ChartCard title="📊 Sales Funnel Overview">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#db2777" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#d97706" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      fontSize: '14px',
                      fontWeight: '600'
                    }} 
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {funnelData.map((entry, index) => {
                      const gradients = ['url(#blueGradient)', 'url(#purpleGradient)', 'url(#pinkGradient)', 'url(#amberGradient)'];
                      return <Cell key={`cell-${index}`} fill={gradients[index]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="🌍 Regional Performance">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="proposalsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#d97706" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis dataKey="region" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      fontSize: '14px',
                      fontWeight: '600'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', fontWeight: '600' }} />
                  <Bar dataKey="visits" fill="url(#visitsGradient)" name="Client Visits" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="proposals" fill="url(#proposalsGradient)" name="Proposals" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="🏢 Industry Distribution">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <defs>
                    {['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'].map((color, index) => (
                      <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie 
                    data={industryData} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={90}
                    innerRadius={30}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#pieGradient${index % 5})`} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      fontSize: '14px',
                      fontWeight: '600'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="💊 Deal Health Metrics">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Average Probability</span>
                    <span className="text-sm font-bold text-purple-600">{avgProbability.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="h-3 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-1000 shadow-sm" style={{ width: `${avgProbability}%` }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <p className="text-xs text-purple-600 font-semibold">Total TCV</p>
                    <p className="text-lg font-black text-purple-700">₹{totalTCV.toFixed(2)} Cr</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <p className="text-xs text-blue-600 font-semibold">Active Deals</p>
                    <p className="text-lg font-black text-blue-700">{filteredProposals.length}</p>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Data Tables with Pagination */}
          <div className="space-y-6">
            <EnhancedTable title={`Proposals Submitted (${filteredProposals.length} total)`} data={filteredProposals} columns={proposalColumns} defaultSort={{ key: 'date', direction: 'desc' }} onAddData={() => setShowAddForm('proposal_submitted')} />
            <EnhancedTable title={`Client Direct Visits (${filteredVisits.length} total)`} data={filteredVisits} columns={visitColumns} defaultSort={{ key: 'date', direction: 'desc' }} onAddData={() => setShowAddForm('client_direct_visit')} />
            <EnhancedTable title={`Demos Conducted (${filteredDemos.length} total)`} data={filteredDemos} columns={demoColumns} onAddData={() => setShowAddForm('demos')} />
            <EnhancedTable title={`DC Visits (${filteredDCVisits.length} total)`} data={filteredDCVisits} columns={dcVisitColumns} defaultSort={{ key: 'date', direction: 'desc' }} onAddData={() => setShowAddForm('dc_visit')} />
          </div>

          {/* Footer */}
          <div className="glass rounded-xl shadow-xl p-6 mt-8 text-center border-2 border-white/20">
            <p className="text-gray-700 font-medium">
              Showing {filteredProposals.length + filteredVisits.length + filteredDemos.length + filteredDCVisits.length} of {d.kpis.total_funnel_activities} total activities
            </p>
          </div>
        </div>
      </div>

      {/* Modals - Rendered outside main content for proper z-index */}
      {showUploadModal && (
        <ExcelUpload onFileProcessed={handleFileProcessed} onClose={() => setShowUploadModal(false)} />
      )}

      {showPreviewModal && parsedExcelData && (
        <DataPreview parsedData={parsedExcelData} onAccept={handleAcceptData} onCancel={handleCancelPreview} />
      )}

      {showAddForm && (
        <AddDataForm sheetType={showAddForm} onSubmit={(newRecord) => handleAddData(showAddForm, newRecord)} onCancel={() => setShowAddForm(null)} />
      )}

      {showDataManagement && (
        <DataManagementPanel
          datasets={datasets}
          onToggle={toggleDataset}
          onDelete={removeDataset}
          onClose={() => setShowDataManagement(false)}
        />
      )}
    </>
  );
};

export default SalesFunnelDashboard;
