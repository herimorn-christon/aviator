import React, { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { DataFilter as FilterType } from '../types';

export const DataFilter: React.FC = () => {
  const { currentFilter, setFilter, settings } = useDataStore();
  
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [minMultiplier, setMinMultiplier] = useState<string>('');
  const [maxMultiplier, setMaxMultiplier] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  
  // Get unique platforms from data
  const { aviatorData } = useDataStore();
  const uniquePlatforms = Array.from(new Set(aviatorData.map(d => d.platform)));
  
  const handleApplyFilter = () => {
    const filter: FilterType = {};
    
    if (startDate) {
      filter.startDate = new Date(startDate);
    }
    
    if (endDate) {
      filter.endDate = new Date(endDate);
    }
    
    if (minMultiplier && !isNaN(parseFloat(minMultiplier))) {
      filter.minMultiplier = parseFloat(minMultiplier);
    }
    
    if (maxMultiplier && !isNaN(parseFloat(maxMultiplier))) {
      filter.maxMultiplier = parseFloat(maxMultiplier);
    }
    
    if (selectedPlatforms.length > 0) {
      filter.platforms = selectedPlatforms;
    }
    
    setFilter(filter);
  };
  
  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setMinMultiplier('');
    setMaxMultiplier('');
    setSelectedPlatforms([]);
    setFilter({});
  };
  
  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };
  
  const hasActiveFilters = !!(
    startDate || endDate || minMultiplier || maxMultiplier || selectedPlatforms.length > 0
  );
  
  return (
    <div className={`p-4 rounded-lg shadow-md ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Filter Data</h3>
        {hasActiveFilters && (
          <button 
            onClick={handleReset}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Reset All
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  settings.darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
                placeholder="From"
              />
            </div>
            <div className="flex-1">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  settings.darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
                placeholder="To"
                min={startDate}
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Multiplier Range</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                step="0.01"
                min="1.01"
                value={minMultiplier}
                onChange={(e) => setMinMultiplier(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  settings.darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Min"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                step="0.01"
                min={minMultiplier || '1.01'}
                value={maxMultiplier}
                onChange={(e) => setMaxMultiplier(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  settings.darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>
      
      {uniquePlatforms.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {uniquePlatforms.map((platform) => (
              <button
                key={platform}
                onClick={() => handlePlatformToggle(platform)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedPlatforms.includes(platform)
                    ? settings.darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-800'
                    : settings.darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleApplyFilter}
          className={`px-4 py-2 rounded-md font-medium ${
            settings.darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};