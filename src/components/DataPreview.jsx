import React, { useState } from 'react';
import { X, FileSpreadsheet, CheckCircle, ChevronRight, Table, BarChart3 } from 'lucide-react';

const DataPreview = ({ parsedData, onAccept, onCancel }) => {
    const [activeSheet, setActiveSheet] = useState(0);

    if (!parsedData || !parsedData.sheets || parsedData.sheets.length === 0) {
        return null;
    }

    const currentSheet = parsedData.sheets[activeSheet];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn overflow-y-auto">
            <div className="glass rounded-2xl shadow-2xl w-full max-w-6xl border-2 border-white/20 my-4 sm:my-8 animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 sticky top-0 bg-white/70 backdrop-blur-md z-10">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex-shrink-0">
                            <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Preview Excel Data</h2>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{parsedData.filename}</p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-white/50 rounded-lg transition-all flex-shrink-0 ml-2"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                </div>

                {/* File Info */}
                <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-white/20">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-white rounded-lg flex-shrink-0">
                                <Table className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-600 truncate">Total Sheets</p>
                                <p className="text-base sm:text-lg font-bold text-gray-900">{parsedData.sheets?.length || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-white rounded-lg flex-shrink-0">
                                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-600 truncate">Total Rows</p>
                                <p className="text-base sm:text-lg font-bold text-gray-900">
                                    {parsedData.sheets?.reduce((sum, sheet) => sum + (sheet.totalRows || sheet.allData?.length || 0), 0) || 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-white rounded-lg flex-shrink-0">
                                <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-600 truncate">File Size</p>
                                <p className="text-base sm:text-lg font-bold text-gray-900">
                                    {parsedData.size ? (parsedData.size / 1024).toFixed(2) : '0.00'} KB
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-white rounded-lg flex-shrink-0">
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-600 truncate">Upload Date</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                    {parsedData.uploadDate ? new Date(parsedData.uploadDate).toLocaleDateString() : 'Just now'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sheet Selector Dropdown */}
                <div className="p-4 sm:p-6 bg-white/50 border-b border-white/20">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Select Sheet:</label>
                        <select
                            value={activeSheet}
                            onChange={(e) => setActiveSheet(Number(e.target.value))}
                            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-purple-300 rounded-lg text-sm sm:text-base text-gray-900 font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white shadow-sm hover:border-purple-400 cursor-pointer"
                        >
                            {parsedData.sheets.map((sheet, index) => (
                                <option key={index} value={index}>
                                    {sheet.name || `Sheet ${index + 1}`} ({sheet.totalRows || sheet.allData?.length || sheet.preview?.length || 0} rows, {sheet.totalColumns || sheet.headers?.length || 0} columns)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Sheet Preview */}
                <div className="p-4 sm:p-6">
                    <div className="mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{currentSheet.name || 'Sheet Data'}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Showing first {Math.min(currentSheet.preview?.length || 0, 10)} of {currentSheet.totalRows || currentSheet.allData?.length || 0} rows • {currentSheet.totalColumns || currentSheet.headers?.length || 0} columns
                        </p>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm -mx-2 sm:mx-0">
                        <table className="w-full min-w-full">
                            <thead className="bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-200 sticky top-0">
                                <tr>
                                    {(currentSheet.headers || []).map((header, index) => (
                                        <th
                                            key={index}
                                            className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap"
                                        >
                                            {header || `Column ${index + 1}`}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {(currentSheet.preview || []).length > 0 ? (
                                    currentSheet.preview.map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            className={`hover:bg-purple-50/50 transition-colors ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                        >
                                            {(currentSheet.headers || []).map((header, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 whitespace-nowrap"
                                                >
                                                    {row[header] !== null && row[header] !== undefined
                                                        ? String(row[header])
                                                        : '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={currentSheet.headers?.length || 1} className="px-4 py-8 text-center text-gray-500 text-sm">
                                            No preview data available for this sheet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {(currentSheet.totalRows || currentSheet.allData?.length || 0) > 10 && (
                        <div className="mt-3 text-center text-xs sm:text-sm text-gray-600 bg-yellow-50 py-2 rounded-lg">
                            <span className="font-medium">+ {(currentSheet.totalRows || currentSheet.allData?.length || 0) - Math.min(currentSheet.preview?.length || 0, 10)} more rows</span> not shown in preview
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 sm:p-6 border-t border-white/20 bg-white/30">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <p className="leading-relaxed">Data looks good? Click "Use This Data" to update the dashboard</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 order-1 sm:order-2">
                            <button
                                onClick={onCancel}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onAccept(parsedData)}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                Use This Data
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataPreview;
