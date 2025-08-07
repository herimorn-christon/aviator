import React, { useState, useRef } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { AviatorData } from '../types';

export const ImportExport: React.FC = () => {
  const { aviatorData, importData, settings } = useDataStore();
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = () => {
    if (aviatorData.length === 0) {
      return;
    }
    
    const dataStr = JSON.stringify(aviatorData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `aviator-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedData = JSON.parse(content) as AviatorData[];
        
        // Validate the data format
        if (!Array.isArray(parsedData)) {
          throw new Error('Invalid data format: Expected an array');
        }
        
        // Check if each item has the required fields
        const isValid = parsedData.every(item => 
          typeof item.id === 'string' &&
          typeof item.timestamp === 'number' &&
          typeof item.multiplier === 'number' &&
          typeof item.platform === 'string'
        );
        
        if (!isValid) {
          throw new Error('Invalid data format: Some items are missing required fields');
        }
        
        // Import the data
        importData(parsedData);
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setImportError(`Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className={`p-4 rounded-lg shadow-md ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className="text-lg font-medium mb-4">Import/Export Data</h3>
      
      {importError && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded-md flex items-center gap-2">
          <AlertTriangle size={18} />
          <span>{importError}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <button
            onClick={handleImportClick}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
              settings.darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <Upload size={18} />
            <span>Import Data</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <p className="text-xs mt-1 text-gray-500">
            Import previously exported data (JSON format)
          </p>
        </div>
        
        <div>
          <button
            onClick={handleExport}
            disabled={aviatorData.length === 0}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
              aviatorData.length === 0 
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : settings.darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Download size={18} />
            <span>Export Data</span>
          </button>
          <p className="text-xs mt-1 text-gray-500">
            {aviatorData.length === 0 
              ? 'No data available to export'
              : 'Download all data as a JSON file'
            }
          </p>
        </div>
      </div>
    </div>
  );
};