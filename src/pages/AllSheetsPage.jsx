import React, { useState } from 'react';
import EnhancedTable from '../components/EnhancedTable';
import AddEditForm from '../components/AddEditForm';
import { useDashboardData } from '../utils/dashboardDataHook';
import { columnDefinitions } from '../utils/columnDefinitions';
import { FileSpreadsheet, Database } from 'lucide-react';

const AllSheetsPage = () => {
    const { aggregatedData, updateSheetData } = useDashboardData();
    const [activeSheet, setActiveSheet] = useState('order_booked');
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);

    const sheetTitles = {
        order_booked: 'Order Booked',
        payment_collection: 'Payment Collection',
        funnel: 'Funnel',
        proposal_submitted: 'Proposal Submitted',
        demos: 'Demos',
        partner_on_board: 'Partner on Board',
        dc_visit: 'DC Visit',
        client_direct_visit: 'Client Direct Visit',
        events_attend: 'Events Attend',
        tender: 'Tender',
        daily_report: 'Daily Report'
    };

    const data = aggregatedData?.sheets?.[activeSheet]?.data || [];
    const columns = columnDefinitions[activeSheet] || [];

    const handleAddData = () => {
        setEditData(null);
        setShowForm(true);
    };

    const handleEdit = (rowData, index) => {
        setEditData({ ...rowData, _index: index });
        setShowForm(true);
    };

    const handleSave = (formData) => {
        if (editData && editData._index !== undefined) {
            // Edit existing record
            const newData = [...data];
            const { _index, ...cleanData } = formData;
            newData[editData._index] = cleanData;
            updateSheetData(activeSheet, newData);
        } else {
            // Add new record
            const newRecord = { ...formData, sr_no: data.length + 1 };
            updateSheetData(activeSheet, [...data, newRecord]);
        }
        setShowForm(false);
        setEditData(null);
    };

    const handleDelete = (index) => {
        const newData = data.filter((_, i) => i !== index)
            .map((item, i) => ({ ...item, sr_no: i + 1 }));
        updateSheetData(activeSheet, newData);
    };

    const availableSheets = Object.keys(aggregatedData?.sheets || {}).filter(key => 
        columnDefinitions[key] && (aggregatedData.sheets[key]?.data?.length > 0 || key === activeSheet)
    );

    return (
        <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                            <Database className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900">Data Management</h1>
                            <p className="text-gray-600 text-lg">Manage all your sales funnel data in one place</p>
                        </div>
                    </div>

                    {/* Sheet Selector */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Select Data Sheet</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                            {Object.keys(sheetTitles).map(sheetKey => {
                                const isAvailable = availableSheets.includes(sheetKey);
                                const recordCount = aggregatedData?.sheets?.[sheetKey]?.data?.length || 0;
                                
                                return (
                                    <button
                                        key={sheetKey}
                                        onClick={() => setActiveSheet(sheetKey)}
                                        disabled={!isAvailable && sheetKey !== activeSheet}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                            activeSheet === sheetKey
                                                ? 'border-purple-500 bg-purple-50 text-purple-900'
                                                : isAvailable
                                                ? 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 text-gray-700'
                                                : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileSpreadsheet className="w-4 h-4" />
                                            <span className="font-semibold text-sm">{sheetTitles[sheetKey]}</span>
                                        </div>
                                        <p className="text-xs opacity-75">
                                            {recordCount} records
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <EnhancedTable
                    title={`${sheetTitles[activeSheet]} (${data.length})`}
                    data={data}
                    columns={columns}
                    defaultSort={{ key: columns[0]?.key || 'sr_no', direction: 'asc' }}
                    onAddData={handleAddData}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Add/Edit Form */}
                {showForm && (
                    <AddEditForm
                        sheetType={activeSheet}
                        editData={editData}
                        onSave={handleSave}
                        onCancel={() => {
                            setShowForm(false);
                            setEditData(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default AllSheetsPage;