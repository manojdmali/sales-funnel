import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Plus, FileSpreadsheet, ChevronLeft, ChevronRight, Trash2, Edit } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const EnhancedTable = ({
    title,
    data,
    columns,
    defaultSort = null,
    enableExport = true,
    onAddData = null,
    onEdit = null,
    onDelete = null,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState(defaultSort);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, index: null, record: null });

    // Sorting logic
    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            const aString = String(aValue).toLowerCase();
            const bString = String(bValue).toLowerCase();

            if (aString < bString) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aString > bString) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    // Pagination logic
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    const handleSort = (columnKey) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === columnKey && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: columnKey, direction });
    };

    const exportToCSV = () => {
        const headers = columns.map(col => col.label).join(',');
        const rows = data.map(row =>
            columns.map(col => {
                const value = row[col.key];
                if (value === null || value === undefined) return '';
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            }).join(',')
        ).join('\n');

        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getSortIcon = (columnKey) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <ArrowUpDown className="w-4 h-4 text-gray-400 opacity-50 group-hover:opacity-100 transition-opacity" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-4 h-4 text-purple-600" />
            : <ArrowDown className="w-4 h-4 text-purple-600" />;
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-gray-100 gap-4 bg-gradient-to-r from-white/50 to-purple-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="text-xs text-gray-500 font-medium">{data.length} records found</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {onAddData && (
                        <button
                            onClick={onAddData}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transform hover:-translate-y-0.5 transition-all duration-200 text-sm font-semibold shadow-lg shadow-gray-200"
                        >
                            <Plus className="w-4 h-4" />
                            Add Record
                        </button>
                    )}
                    {enableExport && data.length > 0 && (
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transform hover:-translate-y-0.5 transition-all duration-200 text-sm font-semibold"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-purple-600 to-indigo-600">
                            {columns.map(column => (
                                <th
                                    key={column.key}
                                    onClick={() => column.sortable !== false && handleSort(column.key)}
                                    className={`px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider ${column.sortable !== false ? 'cursor-pointer hover:bg-white/10 transition-colors group' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {column.sortable !== false && <ArrowUpDown className="w-3 h-3 text-white/70" />}
                                    </div>
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    {columns.map(column => (
                                        <td key={`${idx}-${column.key}`} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                            {column.render
                                                ? column.render(row[column.key], row)
                                                : (row[column.key] !== null && row[column.key] !== undefined
                                                    ? String(row[column.key])
                                                    : <span className="text-gray-400 italic">N/A</span>)
                                            }
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {onEdit && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const dataIndex = startIndex + idx;
                                                            onEdit(row, dataIndex);
                                                        }}
                                                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit Record"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const dataIndex = startIndex + idx;
                                                            setDeleteConfirm({
                                                                isOpen: true,
                                                                index: dataIndex,
                                                                record: row
                                                            });
                                                        }}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <FileSpreadsheet className="w-12 h-12 mb-3 opacity-20" />
                                        <p className="text-sm font-medium">No data available</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {data.length > 0 && (
                <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Show</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span>per page</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-transparent hover:border-gray-200 hover:shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-transparent hover:border-gray-200 hover:shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
            
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, index: null, record: null })}
                onConfirm={() => {
                    if (deleteConfirm.index !== null) {
                        onDelete(deleteConfirm.index);
                    }
                }}
                title="Delete Record"
                message={`Are you sure you want to delete this record? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default EnhancedTable;
