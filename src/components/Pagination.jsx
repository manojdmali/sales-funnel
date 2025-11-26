import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems
}) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-4 py-3 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{startItem}</span> to{' '}
                <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalItems}</span> results
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="First page"
                >
                    <ChevronsLeft className="w-4 h-4 text-gray-600" />
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Previous page"
                >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>

                <div className="flex gap-1">
                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="px-3 py-1 rounded-lg hover:bg-purple-50 text-sm transition-all"
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="px-2 py-1 text-gray-400">...</span>}
                        </>
                    )}

                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => onPageChange(number)}
                            className={`px-3 py-1 rounded-lg text-sm transition-all ${currentPage === number
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                                    : 'hover:bg-purple-50 text-gray-700'
                                }`}
                        >
                            {number}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="px-2 py-1 text-gray-400">...</span>}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="px-3 py-1 rounded-lg hover:bg-purple-50 text-sm transition-all"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Next page"
                >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>

                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Last page"
                >
                    <ChevronsRight className="w-4 h-4 text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
