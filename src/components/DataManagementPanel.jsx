import React from 'react';
import { FileSpreadsheet, Trash2, Eye, EyeOff, Calendar, Database } from 'lucide-react';

const DataManagementPanel = ({ datasets, onToggle, onDelete, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                            <Database className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Manage Data Sources</h2>
                            <p className="text-white/80 text-sm">Control which Excel files are included in your dashboard</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {datasets.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No files uploaded yet</p>
                            <p className="text-sm">Upload an Excel file to see it here</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {datasets.map((dataset) => (
                                <div
                                    key={dataset.id}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${dataset.isActive
                                            ? 'bg-purple-50 border-purple-200 shadow-sm'
                                            : 'bg-gray-50 border-gray-200 opacity-75'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${dataset.isActive ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'}`}>
                                            <FileSpreadsheet className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${dataset.isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {dataset.filename}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(dataset.uploadedAt).toLocaleDateString()}
                                                </span>
                                                <span>•</span>
                                                <span>{Object.keys(dataset.data.sheets || {}).length} Sheets</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onToggle(dataset.id)}
                                            className={`p-2 rounded-lg transition-all ${dataset.isActive
                                                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                                }`}
                                            title={dataset.isActive ? "Hide from dashboard" : "Show in dashboard"}
                                        >
                                            {dataset.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => onDelete(dataset.id)}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                            title="Delete file"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataManagementPanel;
