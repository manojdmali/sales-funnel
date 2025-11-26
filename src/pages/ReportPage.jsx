import React, { useState } from 'react';
import EnhancedTable from '../components/EnhancedTable';
import FilterPanel from '../components/FilterPanel';
import AddDataForm from '../components/AddDataForm';
import { useDashboardData } from '../utils/dashboardDataHook';
import { columnDefinitions } from '../utils/columnDefinitions';

const ReportPage = ({ sheetKey, title }) => {
    const {
        aggregatedData,
        filters,
        setFilters,
        searchTerm,
        setSearchTerm,
        availableFilters,
        addRecord,
        deleteRecord
    } = useDashboardData();

    const [showAddForm, setShowAddForm] = useState(false);

    // Get data for this specific sheet
    const rawData = aggregatedData?.sheets?.[sheetKey]?.data || [];

    // Filter data
    const filteredData = rawData.filter(item => {
        // Apply search
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = Object.values(item).some(value =>
                value && String(value).toLowerCase().includes(searchLower)
            );
            if (!matchesSearch) return false;
        }

        // Apply filters
        for (const [key, value] of Object.entries(filters)) {
            if (value && item[key] !== value) {
                return false;
            }
        }

        return true;
    });

    const columns = columnDefinitions[sheetKey] || [];

    const handleAddData = (newRecord) => {
        addRecord(sheetKey, newRecord);
        setShowAddForm(false);
    };

    const handleDeleteData = (index) => {
        deleteRecord(sheetKey, index);
    };

    if (!aggregatedData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] p-4">
                <div className="text-center glass rounded-2xl p-8 sm:p-12 max-w-md">
                    <p className="text-gray-700 text-base sm:text-lg font-medium">
                        Please upload data from the Dashboard to view reports.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-6 lg:p-8 animate-fadeIn">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Showing {filteredData.length} records
                        {aggregatedData.metadata.filename && (
                            <span className="hidden sm:inline"> from {aggregatedData.metadata.filename}</span>
                        )}
                    </p>
                </div>

                {/* Filter Panel */}
                <FilterPanel
                    filters={filters}
                    onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
                    onSearch={setSearchTerm}
                    searchTerm={searchTerm}
                    availableFilters={availableFilters}
                />

                {/* Data Table */}
                <div className="mt-6 sm:mt-8">
                    <EnhancedTable
                        title={`${title} List`}
                        data={filteredData}
                        columns={columns}
                        onAddData={() => setShowAddForm(true)}
                        onDelete={handleDeleteData}
                    />
                </div>

                {/* Add Data Form Modal */}
                {showAddForm && (
                    <AddDataForm
                        sheetType={sheetKey}
                        onSubmit={handleAddData}
                        onCancel={() => setShowAddForm(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default ReportPage;
