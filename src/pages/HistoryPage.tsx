import React from 'react';
import { useDataStore } from '../store/dataStore';
import { DataTable } from '../components/DataTable';
import { DataFilter } from '../components/DataFilter';
import { ImportExport } from '../components/ImportExport';

const HistoryPage: React.FC = () => {
  const { aviatorData } = useDataStore();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Data History</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <DataFilter />
          </div>
          <div className="md:w-2/3">
            <ImportExport />
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-4">All Data Points</h2>
          <DataTable data={aviatorData} />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;