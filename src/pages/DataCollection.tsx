import React from 'react';
import { useDataStore } from '../store/dataStore';
import { SessionControl } from '../components/SessionControl';
import { DataEntryForm } from '../components/DataEntryForm';
import { DataTable } from '../components/DataTable';
import { ImportExport } from '../components/ImportExport';

const DataCollection: React.FC = () => {
  const { aviatorData, settings, user } = useDataStore();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Data Collection</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div>
          <SessionControl />
          
          {user && (
            <>
              <div className="mt-6">
                <DataEntryForm />
              </div>
              <div className="mt-6">
                <ImportExport />
              </div>
            </>
          )}
          
          <div className="mt-6 p-4 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <h3 className="font-medium mb-2">Tips for Better Predictions</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Add at least 20 data points for basic predictions</li>
              <li>Record consecutive results for best pattern detection</li>
              <li>Include platform information for platform-specific insights</li>
              <li>Add notes for unusual patterns or observations</li>
            </ul>
          </div>
        </div>
        
        {/* Right column */}
        <div className="lg:col-span-2">
          <div className={`p-4 rounded-lg shadow-md mb-4 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">All Data Points</h2>
              <span className="text-sm text-gray-500">
                {aviatorData.length} {aviatorData.length === 1 ? 'record' : 'records'}
              </span>
            </div>
          </div>
          
          <DataTable data={aviatorData} />
        </div>
      </div>
    </div>
  );
};

export default DataCollection;