import React, { useState } from 'react';
import EnhancedTable from '../components/EnhancedTable';
import FilterPanel from '../components/FilterPanel';
import AddDataForm from '../components/AddDataForm';
import { useDashboardData } from '../utils/dashboardDataHook';
import { columnDefinitions } from '../utils/columnDefinitions';

const ReportPage = ({ sheetKey, title }) => {
    const {
        aggregatedData,
        datasets,
        filters,
        setFilters,
        searchTerm,
        setSearchTerm,
        availableFilters,
        addRecord,
        deleteRecord,
        updateRecord
    } = useDashboardData();

    const [showAddForm, setShowAddForm] = useState(false);
    const [editData, setEditData] = useState(null);

    // Get data for this specific sheet - filter out null/undefined items
    const rawData = (aggregatedData?.sheets?.[sheetKey]?.data || []).filter(item => item !== null && item !== undefined);

    // Filter data with index mapping
    const filteredData = rawData
        .map((item, index) => ({ ...item, _originalIndex: index }))
        .filter(item => {
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
        try {
            const recordToDelete = filteredData[index];
            const originalIndex = filteredData[index]?._originalIndex ?? index;
            
            // Get the actual source dataset (not aggregated)
            const activeDatasets = datasets.filter(d => d.isActive);
            const sourceDataset = activeDatasets[activeDatasets.length - 1];
            const sourceData = sourceDataset?.data?.sheets?.[sheetKey]?.data || [];
            
            console.log('Delete - Filtered Index:', index, 'Original Index:', originalIndex);
            console.log('Aggregated Data Length:', aggregatedData?.sheets?.[sheetKey]?.data?.length);
            console.log('Source Dataset Length:', sourceData.length);
            
            // Find index in source dataset
            const cleanRecord = { ...recordToDelete };
            delete cleanRecord._originalIndex;
            const sourceIndex = sourceData.findIndex(item => 
                item && JSON.stringify(item) === JSON.stringify(cleanRecord)
            );
            
            console.log('Source Index Found:', sourceIndex);
            
            if (sourceIndex !== -1) {
                deleteRecord(sheetKey, sourceIndex);
            } else {
                console.error('Could not find record in source dataset');
            }
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    const handleEditData = (record, index) => {
        try {
            // Get the actual source dataset (not aggregated)
            const activeDatasets = datasets.filter(d => d.isActive);
            const sourceDataset = activeDatasets[activeDatasets.length - 1];
            const sourceData = sourceDataset?.data?.sheets?.[sheetKey]?.data || [];
            
            const cleanRecord = { ...record };
            delete cleanRecord._originalIndex;
            
            // Find index in source dataset
            const sourceIndex = sourceData.findIndex(item => 
                item && JSON.stringify(item) === JSON.stringify(cleanRecord)
            );
            
            console.log('Edit - Source Index Found:', sourceIndex, 'Source Data Length:', sourceData.length);
            
            if (sourceIndex !== -1) {
                setEditData({ record: cleanRecord, index: sourceIndex });
            } else {
                console.error('Could not find record in source dataset for editing');
            }
        } catch (error) {
            console.error('Error editing record:', error);
        }
    };

    const handleUpdateData = (updatedRecord) => {
        try {
            if (!editData || editData.index === undefined) {
                console.error('Invalid edit data');
                return;
            }
            updateRecord(sheetKey, editData.index, updatedRecord);
            setEditData(null);
        } catch (error) {
            console.error('Error updating record:', error);
            setEditData(null);
        }
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
                        onEdit={handleEditData}
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

                {/* Edit Data Form Modal */}
                {editData && (
                    <AddDataForm
                        sheetType={sheetKey}
                        initialData={editData.record}
                        onSubmit={handleUpdateData}
                        onCancel={() => setEditData(null)}
                        isEdit={true}
                    />
                )}
            </div>
        </div>
    );
};

export default ReportPage;
