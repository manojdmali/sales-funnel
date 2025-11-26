import { useState, useEffect, useMemo } from 'react';
import { dataService } from '../services/dataService';

/**
 * Custom hook to manage multiple Excel datasets with dual-mode persistence (IndexedDB / DB)
 */
export const useDashboardData = () => {
    const [datasets, setDatasets] = useState([]);
    const [filters, setFilters] = useState({
        region: '',
        industry: '',
        sales_type: '',
        sales_person: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Load datasets from configured storage on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const savedDatasets = await dataService.loadDatasets();
                if (savedDatasets && Array.isArray(savedDatasets)) {
                    // Ensure all datasets have required fields
                    const migrated = savedDatasets.map(d => ({
                        ...d,
                        id: d.id || Date.now() + Math.random(),
                        isActive: d.isActive !== undefined ? d.isActive : true,
                        uploadedAt: d.uploadedAt || new Date().toISOString()
                    }));
                    setDatasets(migrated);
                }
            } catch (error) {
                console.error('Error loading datasets:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Save datasets to configured storage whenever they change
    useEffect(() => {
        if (!isLoading) {
            dataService.saveDatasets(datasets).catch(error => {
                console.error('Error saving datasets:', error);
            });
        }
    }, [datasets, isLoading]);

    // Add a new dataset (from an uploaded Excel file)
    const addDataset = (parsedData, filename = 'Uploaded Excel') => {
        const newEntry = {
            id: Date.now(),
            data: parsedData,
            filename,
            isActive: true,
            uploadedAt: new Date().toISOString()
        };
        setDatasets((prev) => [...prev, newEntry]);
    };

    // Remove a dataset by its id
    const removeDataset = (id) => {
        setDatasets((prev) => prev.filter((d) => d.id !== id));
    };

    // Toggle dataset active state
    const toggleDataset = (id) => {
        setDatasets((prev) => prev.map(d =>
            d.id === id ? { ...d, isActive: !d.isActive } : d
        ));
    };

    // Add a single record to a specific sheet in the latest active dataset
    const addRecord = (sheetKey, newRecord) => {
        setDatasets((prev) => {
            const activeDatasets = prev.filter(d => d.isActive);
            if (activeDatasets.length === 0) return prev;

            const targetId = activeDatasets[activeDatasets.length - 1].id;

            return prev.map(dataset => {
                if (dataset.id !== targetId) return dataset;

                const updatedDataset = JSON.parse(JSON.stringify(dataset));

                if (!updatedDataset.data.sheets[sheetKey]) {
                    updatedDataset.data.sheets[sheetKey] = { data: [], total_records: 0 };
                }

                const sheet = updatedDataset.data.sheets[sheetKey];
                sheet.data = [newRecord, ...sheet.data];
                sheet.total_records = sheet.data.length;

                return updatedDataset;
            });
        });
    };

    // Remove a single record from a specific sheet in the latest active dataset
    const deleteRecord = (sheetKey, recordIndex) => {
        setDatasets((prev) => {
            const activeDatasets = prev.filter(d => d.isActive);
            if (activeDatasets.length === 0) return prev;

            const targetId = activeDatasets[activeDatasets.length - 1].id;

            return prev.map(dataset => {
                if (dataset.id !== targetId) return dataset;

                const updatedDataset = JSON.parse(JSON.stringify(dataset));

                if (!updatedDataset.data.sheets[sheetKey]) return dataset;

                const sheet = updatedDataset.data.sheets[sheetKey];
                sheet.data = sheet.data.filter((r, i) => i !== recordIndex);
                sheet.total_records = sheet.data.length;

                return updatedDataset;
            });
        });
    };

    // Update entire sheet data in the latest active dataset
    const updateSheetData = (sheetKey, newData) => {
        setDatasets((prev) => {
            const activeDatasets = prev.filter(d => d.isActive);
            if (activeDatasets.length === 0) return prev;

            const targetId = activeDatasets[activeDatasets.length - 1].id;

            return prev.map(dataset => {
                if (dataset.id !== targetId) return dataset;

                const updatedDataset = JSON.parse(JSON.stringify(dataset));

                if (!updatedDataset.data.sheets[sheetKey]) {
                    updatedDataset.data.sheets[sheetKey] = { data: [], total_records: 0 };
                }

                const sheet = updatedDataset.data.sheets[sheetKey];
                sheet.data = newData;
                sheet.total_records = newData.length;

                return updatedDataset;
            });
        });
    };

    // Merge all ACTIVE datasets into a single aggregated structure
    const aggregatedData = useMemo(() => {
        const activeDatasets = datasets.filter(d => d.isActive);
        if (activeDatasets.length === 0) return null;

        const merged = { metadata: {}, sheets: {}, kpis: {} };

        const lastActive = activeDatasets[activeDatasets.length - 1];
        merged.metadata = {
            ...lastActive.data.metadata,
            report_name: activeDatasets.length > 1 ? 'Combined Report' : lastActive.data.metadata.report_name,
            filename: activeDatasets.length > 1 ? `${activeDatasets.length} Files Selected` : lastActive.filename
        };

        activeDatasets.forEach(({ data }) => {
            if (!data.sheets) return;
            Object.entries(data.sheets).forEach(([key, sheet]) => {
                if (!merged.sheets[key]) {
                    merged.sheets[key] = { ...sheet, data: [] };
                }
                merged.sheets[key].data = merged.sheets[key].data.concat(sheet.data || []);
            });
        });

        Object.values(merged.sheets).forEach(sheet => {
            sheet.total_records = sheet.data.length;
        });

        merged.kpis = {
            total_funnel_activities: Object.values(merged.sheets).reduce((acc, s) => acc + s.total_records, 0)
        };

        return merged;
    }, [datasets]);

    // Available filter options based on aggregated data
    const availableFilters = useMemo(() => {
        if (!aggregatedData || !aggregatedData.sheets) return {};

        const filters = {
            region: new Set(),
            industry: new Set(),
            sales_type: new Set(),
            sales_person: new Set()
        };

        Object.values(aggregatedData.sheets).forEach(sheet => {
            if (!sheet.data) return;
            sheet.data.forEach(item => {
                if (item.region) filters.region.add(item.region);
                if (item.industry) filters.industry.add(item.industry);
                if (item.sales_type) filters.sales_type.add(item.sales_type);
                if (item.sales_person) filters.sales_person.add(item.sales_person);
            });
        });

        return {
            region: Array.from(filters.region).sort(),
            industry: Array.from(filters.industry).sort(),
            sales_type: Array.from(filters.sales_type).sort(),
            sales_person: Array.from(filters.sales_person).sort()
        };
    }, [aggregatedData]);

    return {
        datasets,
        addDataset,
        removeDataset,
        toggleDataset,
        aggregatedData,
        filters,
        setFilters,
        searchTerm,
        setSearchTerm,
        availableFilters,
        addRecord,
        deleteRecord,
        updateSheetData,
        isLoading
    };
};
