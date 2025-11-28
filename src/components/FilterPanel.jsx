import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

const FilterPanel = ({ filters, onFilterChange, onSearch, searchTerm, availableFilters }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSearchChange = (e) => {
        onSearch(e.target.value);
    };

    const handleFilterChange = (filterKey, value) => {
        onFilterChange(filterKey, value);
    };

    const clearFilters = () => {
        Object.keys(filters).forEach(key => {
            onFilterChange(key, '');
        });
        onSearch('');
    };

    const activeFiltersCount = Object.values(filters).filter(v => v && v !== '').length + (searchTerm ? 1 : 0);

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/40 overflow-hidden mb-6 transition-all duration-300">
            {/* Compact Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-50 rounded-lg">
                        <Filter className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-base">Filters & Search</h3>
                    </div>
                    {activeFiltersCount > 0 && (
                        <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                            <X className="w-3 h-3" />
                            Clear
                        </button>
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200 text-gray-500 hover:text-purple-600"
                    >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Compact Search Bar */}
            <div className="px-4 py-3 bg-gray-50/50">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-300" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search across all fields..."
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-0 focus:border-purple-500 transition-all duration-300 text-sm text-gray-700 placeholder-gray-400 shadow-sm"
                    />
                </div>
            </div>

            {/* Compact Filter Options */}
            {isExpanded && (
                <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-white border-t border-gray-100">
                    {Object.entries(availableFilters).map(([key, options]) => (
                        options && (
                            <div key={key} className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    {key.replace('_', ' ')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={filters[key] || ''}
                                        onChange={(e) => handleFilterChange(key, e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm text-gray-700 appearance-none cursor-pointer hover:bg-gray-100"
                                    >
                                        <option value="">All</option>
                                        {options.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterPanel;
