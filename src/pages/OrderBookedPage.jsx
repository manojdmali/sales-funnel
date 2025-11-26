import React, { useState } from 'react';
import EnhancedTable from '../components/EnhancedTable';
import FilterPanel from '../components/FilterPanel';
import AddEditForm from '../components/AddEditForm';
import { useDashboardData } from '../utils/dashboardDataHook';
import { columnDefinitions } from '../utils/columnDefinitions';

const OrderBookedPage = () => {
    const { aggregatedData, filters, setFilters, searchTerm, setSearchTerm, availableFilters, updateSheetData } = useDashboardData();
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);
    
    const sheetKey = 'order_booked';
    const data = aggregatedData?.sheets?.[sheetKey]?.data || [];
    const columns = columnDefinitions[sheetKey] || [];

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
            newData[editData._index] = { ...cleanData, sr_no: editData._index + 1 };
            updateSheetData(sheetKey, newData);
        } else {
            // Add new record
            const newRecord = { 
                ...formData, 
                sr_no: data.length + 1,
                id: Date.now() // Add unique ID for better tracking
            };
            updateSheetData(sheetKey, [...data, newRecord]);
        }
        setShowForm(false);
        setEditData(null);
    };

    const handleDelete = (index) => {
        const newData = data.filter((_, i) => i !== index)
            .map((item, i) => ({ ...item, sr_no: i + 1 })); // Reindex sr_no
        updateSheetData(sheetKey, newData);
    };

    return (
        <div className="min-h-screen p-2 sm:p-4 lg:p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                        Order Booked List
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Manage your order booked records with complete sales information
                    </p>
                </div>

                {/* Filter Panel */}
                <div className="mb-6">
                    <FilterPanel
                        filters={filters}
                        onFilterChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
                        onSearch={setSearchTerm}
                        searchTerm={searchTerm}
                        availableFilters={availableFilters}
                    />
                </div>

                {/* Data Table */}
                <EnhancedTable
                    title={`Order Booked Records (${data.length})`}
                    data={data}
                    columns={columns}
                    defaultSort={{ key: 'sales_person', direction: 'asc' }}
                    onAddData={handleAddData}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                
                {/* Add/Edit Form Modal */}
                {showForm && (
                    <AddEditForm
                        sheetType={sheetKey}
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

export default OrderBookedPage;
