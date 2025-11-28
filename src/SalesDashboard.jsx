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
      <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-cyan-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'1\'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
          
          {/* Floating particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-purple-300/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-blue-300/25 rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 right-20 w-1 h-1 bg-pink-300/40 rounded-full animate-ping"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Premium Enhanced Header */}
          <div className="mb-6 animate-slideIn">
            <div className="relative bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-6 overflow-hidden">
              {/* Header Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      <div className="relative">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-purple-800 to-slate-800 tracking-tight leading-tight">
                          Sales <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient">Funnel</span>
                        </h1>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                        <p className="text-sm text-slate-600 font-semibold mt-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Advanced Analytics Dashboard
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <div className="group px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-300 rounded-full text-indigo-800 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <span className="flex items-center gap-2">
                            📊 <span>{d.metadata.report_name}</span>
                          </span>
                        </div>
                        <div className="px-4 py-2 bg-gradient-to-r from-slate-100 to-gray-100 border border-slate-300 rounded-full text-slate-700 font-semibold shadow-md">
                          🕒 {new Date(d.metadata.generated_at).toLocaleDateString()}
                        </div>
                        {dataSource === 'uploaded' && (
                          <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-300 rounded-full text-emerald-800 font-bold shadow-lg animate-pulse">
                            <Upload className="w-3 h-3 inline mr-2" />
                            {d.metadata.filename || 'Excel Data'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 hover:scale-105 transition-all duration-500 font-bold text-sm flex items-center gap-3 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></div>
                      <Upload className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                      <span className="relative z-10 hidden sm:inline">Upload Excel</span>
                      <span className="relative z-10 sm:hidden">Upload</span>
                    </button>
                    <button
                      onClick={() => setShowDataManagement(true)}
                      className="group px-6 py-3 bg-white/80 backdrop-blur-sm text-blue-700 rounded-2xl hover:shadow-xl border-2 border-blue-200 transform hover:-translate-y-1 transition-all duration-300 font-bold text-sm flex items-center gap-3 hover:bg-blue-50"
                    >
                      <Database className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="hidden sm:inline">Manage Data</span>
                      <span className="sm:hidden">Data</span>
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-black shadow-lg">{datasets.length}</span>
                    </button>
                  </div>
                </div>
                
                {/* Enhanced Quick Stats Bar */}
                <div className="mt-6 pt-6 border-t border-gradient-to-r from-transparent via-slate-200 to-transparent">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    <div className="group text-center p-3 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">{filteredProposals.length}</div>
                      <div className="text-xs text-indigo-600 font-bold mt-1">Proposals</div>
                    </div>
                    <div className="group text-center p-3 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">{filteredVisits.length}</div>
                      <div className="text-xs text-purple-600 font-bold mt-1">Visits</div>
                    </div>
                    <div className="group text-center p-3 bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl border border-pink-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">{filteredDemos.length}</div>
                      <div className="text-xs text-pink-600 font-bold mt-1">Demos</div>
                    </div>
                    <div className="group text-center p-3 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl border border-amber-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">₹{totalTCV.toFixed(1)}</div>
                      <div className="text-xs text-amber-600 font-bold mt-1">TCV (Cr)</div>
                    </div>
                    <div className="group text-center p-3 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">{avgProbability.toFixed(0)}%</div>
                      <div className="text-xs text-emerald-600 font-bold mt-1">Avg Prob</div>
                    </div>
                    <div className="group text-center p-3 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl border border-cyan-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{filteredDCVisits.length}</div>
                      <div className="text-xs text-cyan-600 font-bold mt-1">DC Visits</div>
                    </div>
                  </div>
                </div>
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

          {/* Highlighted Sales Pipeline Funnel */}
          <div className="mb-6 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl border-2 border-white/50 p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                        Sales Pipeline Funnel
                      </h2>
                      <p className="text-sm text-gray-600 font-semibold mt-1">Track your complete sales journey from leads to closed deals</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-full">
                    <span className="text-2xl animate-bounce">⭐</span>
                    <span className="text-sm font-black text-yellow-800">KEY METRIC</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Funnel Visualization */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Pipeline Stages
                    </h3>
                    <div className="space-y-3">
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-blue-700">👥 Client Visits</span>
                          <span className="text-2xl font-black text-blue-600">{filteredVisits.length}</span>
                        </div>
                        <div className="h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold" style={{width: '100%'}}>
                          100%
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-purple-700">🎯 Demos Conducted</span>
                          <span className="text-2xl font-black text-purple-600">{filteredDemos.length}</span>
                        </div>
                        <div className="h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold" style={{width: filteredVisits.length > 0 ? `${(filteredDemos.length / filteredVisits.length * 100)}%` : '0%'}}>
                          {filteredVisits.length > 0 ? `${((filteredDemos.length / filteredVisits.length) * 100).toFixed(0)}%` : '0%'}
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-pink-700">📋 Proposals Submitted</span>
                          <span className="text-2xl font-black text-pink-600">{filteredProposals.length}</span>
                        </div>
                        <div className="h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold" style={{width: filteredVisits.length > 0 ? `${(filteredProposals.length / filteredVisits.length * 100)}%` : '0%'}}>
                          {filteredVisits.length > 0 ? `${((filteredProposals.length / filteredVisits.length) * 100).toFixed(0)}%` : '0%'}
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-green-700">✅ Closed Deals</span>
                          <span className="text-2xl font-black text-green-600">{filteredDCVisits.length}</span>
                        </div>
                        <div className="h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold" style={{width: filteredVisits.length > 0 ? `${(filteredDCVisits.length / filteredVisits.length * 100)}%` : '0%'}}>
                          {filteredVisits.length > 0 ? `${((filteredDCVisits.length / filteredVisits.length) * 100).toFixed(0)}%` : '0%'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold opacity-90">Total Pipeline Value</p>
                          <p className="text-4xl font-black mt-2">₹{totalTCV.toFixed(2)} Cr</p>
                        </div>
                        <IndianRupee className="w-16 h-16 opacity-20" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-200">
                        <p className="text-xs font-semibold text-purple-600">Conversion Rate</p>
                        <p className="text-2xl font-black text-purple-700 mt-1">
                          {filteredVisits.length > 0 ? `${((filteredProposals.length / filteredVisits.length) * 100).toFixed(1)}%` : '0%'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Visit → Proposal</p>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-pink-200">
                        <p className="text-xs font-semibold text-pink-600">Avg Deal Size</p>
                        <p className="text-2xl font-black text-pink-700 mt-1">
                          ₹{filteredProposals.length > 0 ? (totalTCV / filteredProposals.length).toFixed(2) : '0'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Per Proposal</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-xl text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold opacity-90">Win Probability</p>
                          <p className="text-4xl font-black mt-2">{avgProbability.toFixed(0)}%</p>
                        </div>
                        <TrendingUp className="w-16 h-16 opacity-20" />
                      </div>
                      <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                        <div className="h-2 bg-white rounded-full transition-all duration-1000" style={{width: `${avgProbability}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              <div className="relative">
                {/* Radial Progress Circle */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg className="transform -rotate-90 w-48 h-48">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="#e5e7eb"
                        strokeWidth="16"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="url(#healthGradient)"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        strokeDashoffset={`${2 * Math.PI * 80 * (1 - avgProbability / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="50%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">{avgProbability.toFixed(0)}%</span>
                      <span className="text-xs font-semibold text-gray-500 mt-1">Win Rate</span>
                    </div>
                  </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg group hover:scale-105 transition-transform">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                    <p className="text-xs font-semibold opacity-90 relative z-10">Total TCV</p>
                    <p className="text-xl font-black mt-1 relative z-10">₹{totalTCV.toFixed(1)}</p>
                    <p className="text-xs opacity-75 relative z-10">Crores</p>
                  </div>
                  
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg group hover:scale-105 transition-transform">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                    <p className="text-xs font-semibold opacity-90 relative z-10">Active</p>
                    <p className="text-xl font-black mt-1 relative z-10">{filteredProposals.length}</p>
                    <p className="text-xs opacity-75 relative z-10">Deals</p>
                  </div>
                  
                  <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-4 text-white shadow-lg group hover:scale-105 transition-transform">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                    <p className="text-xs font-semibold opacity-90 relative z-10">Avg Size</p>
                    <p className="text-xl font-black mt-1 relative z-10">₹{filteredProposals.length > 0 ? (totalTCV / filteredProposals.length).toFixed(1) : '0'}</p>
                    <p className="text-xs opacity-75 relative z-10">Cr/Deal</p>
                  </div>
                </div>

                {/* Health Status Bar */}
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold text-green-700">Pipeline Health:</span>
                    </div>
                    <span className="text-sm font-black text-green-600">
                      {avgProbability >= 70 ? 'Excellent' : avgProbability >= 50 ? 'Good' : avgProbability >= 30 ? 'Fair' : 'Needs Attention'}
                    </span>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 text-blue-600" />
                <span className="text-xs font-semibold text-blue-600 bg-blue-200 px-2 py-1 rounded-full">{filteredProposals.length}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-sm">View Proposals</h3>
              <p className="text-xs text-gray-600 mt-1">Detailed proposal tracking</p>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-6 h-6 text-purple-600" />
                <span className="text-xs font-semibold text-purple-600 bg-purple-200 px-2 py-1 rounded-full">{filteredVisits.length}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-sm">Client Visits</h3>
              <p className="text-xs text-gray-600 mt-1">Visit history & details</p>
            </div>
            
            <div className="group bg-gradient-to-br from-pink-50 to-rose-100 border border-pink-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 text-pink-600" />
                <span className="text-xs font-semibold text-pink-600 bg-pink-200 px-2 py-1 rounded-full">{filteredDemos.length}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-sm">Demo Sessions</h3>
              <p className="text-xs text-gray-600 mt-1">Demo performance data</p>
            </div>
            
            <div className="group bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <IndianRupee className="w-6 h-6 text-amber-600" />
                <span className="text-xs font-semibold text-amber-600 bg-amber-200 px-2 py-1 rounded-full">₹{totalTCV.toFixed(1)}Cr</span>
              </div>
              <h3 className="font-bold text-gray-800 text-sm">Revenue Pipeline</h3>
              <p className="text-xs text-gray-600 mt-1">Total contract value</p>
            </div>
          </div>

          {/* Compact Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mt-6 text-center border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">
              📊 Displaying {filteredProposals.length + filteredVisits.length + filteredDemos.length + filteredDCVisits.length} of {d.kpis.total_funnel_activities} total activities
              <span className="mx-2">•</span>
              <span className="text-indigo-600 font-semibold">Real-time Analytics Dashboard</span>
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
