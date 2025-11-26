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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="glass rounded-3xl shadow-2xl p-8 sm:p-12 text-center max-w-3xl border-2 border-white/50 animate-scaleIn relative z-10">
          <div className="mb-8">
            <div className="inline-flex p-6 sm:p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-xl">
              <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>

            {/* Enhanced Title with Bold Sales Funnel */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-2 tracking-tight leading-tight">
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-700 mb-2">Welcome to</span>
              <span className="block text-indigo-700 font-black">
                Sales Funnel
              </span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-700 mt-2">Dashboard</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-medium max-w-2xl mx-auto">
              Transform your Excel data into powerful business insights with advanced analytics and visualizations
            </p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-800">Multi-file support</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-800">Advanced filtering</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-800">Interactive charts</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-800">Real-time updates</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="group px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/30 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 font-bold text-base sm:text-lg inline-flex items-center gap-3"
          >
            <Upload className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            Upload Your Excel File
            <div className="ml-2 px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
              .xlsx, .xls
            </div>
          </button>

          <p className="mt-6 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Your data stays private - all processing happens in your browser
            </span>
          </p>
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
      <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-slideIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h1 className="text-5xl sm:text-7xl font-black text-gray-900 mb-4 tracking-tight">
                  Sales <span className="text-indigo-700">Funnel</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-gray-700">
                  <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-indigo-200 text-sm font-medium shadow-sm">{d.metadata.report_name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm font-medium">Last Updated: {new Date(d.metadata.generated_at).toLocaleDateString()}</span>
                  {dataSource === 'uploaded' && (
                    <>
                      <span className="text-gray-400">•</span>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-300 rounded-full text-green-700 text-xs font-bold uppercase tracking-wide shadow-sm">
                        <Upload className="w-3 h-3" />
                        <span>{d.metadata.filename || 'Uploaded Excel'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="group px-6 py-4 bg-white text-indigo-600 rounded-2xl hover:shadow-xl hover:shadow-indigo-500/20 transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg flex items-center gap-3 border-2 border-indigo-200"
                >
                  <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  Upload Excel
                </button>
                <button
                  onClick={() => setShowDataManagement(true)}
                  className="group px-6 py-4 bg-white text-blue-600 rounded-2xl hover:shadow-xl hover:shadow-blue-500/20 transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg flex items-center gap-3 border-2 border-blue-200"
                >
                  <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <Database className="w-5 h-5" />
                  </div>
                  Manage Data ({datasets.length})
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

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard icon={Target} label="Total Proposals" value={filteredProposals.length} gradient="from-blue-500 to-blue-600" />
            <KPICard icon={Users} label="Client Visits" value={filteredVisits.length} gradient="from-purple-500 to-purple-600" />
            <KPICard icon={TrendingUp} label="Demos Conducted" value={filteredDemos.length} gradient="from-pink-500 to-pink-600" />
            <KPICard icon={IndianRupee} label="Total TCV (Cr.)" value={`Rs ${totalTCV.toFixed(2)}`} gradient="from-amber-500 to-amber-600" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Sales Funnel Overview">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                  <XAxis dataKey="name" stroke="#ffffff" />
                  <YAxis stroke="#ffffff" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Regional Performance">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                  <XAxis dataKey="region" stroke="#ffffff" />
                  <YAxis stroke="#ffffff" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="visits" fill="#8b5cf6" name="Client Visits" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="proposals" fill="#f59e0b" name="Proposals" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Industry Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={industryData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Deal Health Metrics">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Average Probability</span>
                    <span className="text-sm font-bold text-purple-600">{avgProbability.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500" style={{ width: `${avgProbability}%` }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total TCV</p>
                    <p className="text-xl font-bold text-purple-600">Rs {totalTCV.toFixed(2)} Cr</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Active Deals</p>
                    <p className="text-xl font-bold text-blue-600">{filteredProposals.length}</p>
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
