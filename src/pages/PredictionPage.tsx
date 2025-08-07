import React, { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { PredictionDisplay } from '../components/PredictionDisplay';
import { DataFilter } from '../components/DataFilter';
import { DistributionChart } from '../components/charts/DistributionChart';
import { MultiplierChart } from '../components/charts/MultiplierChart';
import { DataTable } from '../components/DataTable';

const PredictionPage: React.FC = () => {
  const { 
    aviatorData, 
    latestPrediction, 
    generatePrediction, 
    isLoading,
    currentFilter,
    settings
  } = useDataStore();
  
  const [filteredCount, setFilteredCount] = useState<number>(0);
  
  // Get filtered data count
  useEffect(() => {
    // This is a simplified version of the filter logic
    // In a real app, we would reuse the filtering logic from the algorithm
    let count = aviatorData.length;
    
    if (currentFilter.startDate) {
      count = aviatorData.filter(item => item.timestamp >= currentFilter.startDate!.getTime()).length;
    }
    
    if (currentFilter.platforms && currentFilter.platforms.length > 0) {
      count = aviatorData.filter(item => currentFilter.platforms!.includes(item.platform)).length;
    }
    
    setFilteredCount(count);
  }, [aviatorData, currentFilter]);
  
  // Generate a prediction when the page loads if we have data
  useEffect(() => {
    if (aviatorData.length > 0 && !isLoading) {
      generatePrediction();
    }
  }, [aviatorData.length, generatePrediction, isLoading]);
  
  const hasData = aviatorData.length > 0;
  const hasFilteredData = filteredCount > 0;
  
  if (!hasData) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Predictions</h1>
        <div className={`p-6 rounded-lg shadow-md text-center ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <AlertCircle className="mx-auto mb-4 text-yellow-500" size={48} />
          <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
          <p className="mb-4">
            You need to add aviator game results before you can see predictions.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Predictions</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div>
          <DataFilter />
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Current Prediction</h2>
              <button
                onClick={() => generatePrediction()}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                disabled={isLoading}
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
            <PredictionDisplay 
              prediction={latestPrediction} 
              isLoading={isLoading} 
            />
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <h3 className="font-medium mb-2">Understanding Predictions</h3>
            <p className="text-sm mb-2">
              Our prediction algorithm analyzes historical data to identify patterns and trends.
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Higher confidence levels indicate more reliable predictions</li>
              <li>Predictions are based on the most recent relevant data</li>
              <li>Use filters to focus predictions on specific conditions</li>
              <li>Algorithm improves as more data is collected</li>
            </ul>
          </div>
        </div>
        
        {/* Right column */}
        <div className="lg:col-span-2">
          {!hasFilteredData ? (
            <div className={`p-6 rounded-lg shadow-md text-center ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <AlertCircle className="mx-auto mb-4 text-yellow-500" size={32} />
              <h2 className="text-lg font-semibold mb-2">No Data Matches Current Filters</h2>
              <p className="mb-4">
                Try adjusting your filter settings to include more data points.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <MultiplierChart data={aviatorData} />
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Value Distribution</h2>
                <DistributionChart data={aviatorData} />
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Filtered Data</h2>
                <p className="text-sm text-gray-500 mb-2">
                  Showing {filteredCount} of {aviatorData.length} records
                </p>
                <DataTable 
                  data={aviatorData.filter(item => {
                    // Simple filter implementation for display
                    if (currentFilter.startDate && item.timestamp < currentFilter.startDate.getTime()) return false;
                    if (currentFilter.platforms && currentFilter.platforms.length > 0 && !currentFilter.platforms.includes(item.platform)) return false;
                    return true;
                  })}
                  limit={10}
                  showActions={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;