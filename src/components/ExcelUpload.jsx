import React, { useState, useCallback } from 'react';
import { Upload, X, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { validateExcelFile, parseExcelFile } from '../utils/excelProcessor';

const ExcelUpload = ({ onFileProcessed, onClose }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }, []);

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    };

    const processFile = async (file) => {
        setError(null);
        setSelectedFile(file);

        // Validate file
        const validation = validateExcelFile(file);
        if (!validation.valid) {
            setError(validation.error);
            return;
        }

        // Parse file
        setIsProcessing(true);
        try {
            const parsedData = await parseExcelFile(file);
            onFileProcessed(parsedData);
        } catch (err) {
            setError(err.message);
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn overflow-y-auto">
            <div className="glass rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-white/20 animate-scaleIn my-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                            <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Upload Excel File</h2>
                            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Upload your sales funnel data</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/50 rounded-lg transition-all"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                </div>

                {/* Upload Area */}
                <div className="p-4 sm:p-6">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-3 border-dashed rounded-xl p-6 sm:p-12 text-center transition-all ${isDragging
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/30'
                            }`}
                    >
                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                            <div className={`p-4 sm:p-6 rounded-full transition-all ${isDragging ? 'bg-purple-100' : 'bg-gray-100'
                                }`}>
                                <Upload className={`w-8 h-8 sm:w-12 sm:h-12 transition-all ${isDragging ? 'text-purple-600 animate-bounce' : 'text-gray-400'
                                    }`} />
                            </div>

                            <div>
                                <p className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                    {isDragging ? 'Drop your file here' : 'Drag & drop your Excel file'}
                                </p>
                                <p className="text-sm text-gray-600 mb-3 sm:mb-4">or</p>
                                <label className="btn-primary cursor-pointer inline-block px-6 py-3 text-sm sm:text-base">
                                    Browse Files
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        disabled={isProcessing}
                                    />
                                </label>
                            </div>

                            <div className="text-xs text-gray-500 space-y-1">
                                <p>Supported formats: .xlsx, .xls</p>
                                <p>Maximum file size: 10 MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Selected File Info */}
                    {selectedFile && !isProcessing && !error && (
                        <div className="mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 sm:gap-3">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-green-900 text-sm sm:text-base truncate">{selectedFile.name}</p>
                                <p className="text-xs sm:text-sm text-green-700">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Processing State */}
                    {isProcessing && (
                        <div className="mt-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-blue-600"></div>
                                <p className="text-blue-900 font-medium text-sm sm:text-base">Processing Excel file...</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-red-900 text-sm sm:text-base">Upload Failed</p>
                                <p className="text-xs sm:text-sm text-red-700 mt-1 break-words">{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-white/20 bg-white/30">
                    <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <p className="leading-relaxed">Your file will be processed locally in your browser. No data is sent to any server.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExcelUpload;
