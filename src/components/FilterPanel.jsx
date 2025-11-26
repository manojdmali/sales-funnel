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
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl hover:bg-white/95">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-50 rounded-xl">
                        <Filter className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Filters & Search</h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Refine your dashboard view</p>
                    </div>
                    {activeFiltersCount > 0 && (
                        <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full shadow-lg shadow-purple-200 animate-scaleIn">
                            {activeFiltersCount} Active
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </button>
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 text-gray-500 hover:text-purple-600"
                    >
                        {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Search Bar - Always Visible */}
            <div className="p-5 bg-gray-50/50">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-300" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search across all fields..."
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-purple-500 transition-all duration-300 text-gray-700 font-medium placeholder-gray-400 shadow-sm group-hover:border-gray-200"
                    />
                </div>
            </div>

            {/* Filter Options - Collapsible */}
            {isExpanded && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white border-t border-gray-100 animate-fadeIn">
                    {Object.entries(availableFilters).map(([key, options]) => (
                        options && (
                            <div key={key} className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                    {key.replace('_', ' ')}
                                </label>
                                <div className="relative">
                                    <select
                                        value={filters[key] || ''}
                                        onChange={(e) => handleFilterChange(key, e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-gray-700 font-medium appearance-none cursor-pointer hover:bg-gray-100"
                                    >
                                        <option value="">All {key.replace('_', ' ')}s</option>
                                        {options.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
