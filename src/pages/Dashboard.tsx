import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, LineChart, Settings, Plus } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { PredictionDisplay } from '../components/PredictionDisplay';
import { MultiplierChart } from '../components/charts/MultiplierChart';
import { DataTable } from '../components/DataTable';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    aviatorData, 
    latestPrediction, 
    generatePrediction, 
    isLoading,
    settings
  } = useDataStore();
  
  // Generate a prediction when the dashboard loads if we have data
  useEffect(() => {
    if (aviatorData.length > 0 && !latestPrediction && !isLoading) {
      generatePrediction();
    }
  }, [aviatorData.length, latestPrediction, generatePrediction, isLoading]);
  
  const hasData = aviatorData.length > 0;
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Aviator Prediction Dashboard</h1>
      
      {!hasData ? (
        <div className={`p-8 rounded-lg shadow-md text-center ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Welcome to Aviator Predictor</h2>
          <p className="mb-6">
            Start by collecting data from aviator games to generate predictions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/collect')}
              className="flex flex-col items-center p-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Database size={32} className="mb-2" />
              <span className="text-lg font-medium">Collect Data</span>
              <span className="text-sm mt-1">Add your first data points</span>
            </button>
            
            <button
              onClick={() => navigate('/settings')}
              className={`flex flex-col items-center p-6 rounded-lg ${
                settings.darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              } transition-colors`}
            >
              <Settings size={32} className="mb-2" />
              <span className="text-lg font-medium">Settings</span>
              <span className="text-sm mt-1">Customize your experience</span>
            </button>
            
            <button
              onClick={() => navigate('/predict')}
              className={`flex flex-col items-center p-6 rounded-lg ${
                settings.darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              } transition-colors`}
            >
              <LineChart size={32} className="mb-2" />
              <span className="text-lg font-medium">Predictions</span>
              <span className="text-sm mt-1">View detailed analysis</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <MultiplierChart data={aviatorData} limit={20} />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Recent Results</h2>
                <button
                  onClick={() => navigate('/collect')}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                >
                  <Plus size={16} />
                  <span>Add Data</span>
                </button>
              </div>
              <DataTable data={aviatorData} limit={5} />
            </div>
          </div>
          
          {/* Right column */}
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Current Prediction</h2>
                <button
                  onClick={() => generatePrediction()}
                  className={`text-sm px-3 py-1 rounded ${
                    settings.darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Refresh
                </button>
              </div>
              <PredictionDisplay 
                prediction={latestPrediction} 
                isLoading={isLoading} 
              />
            </div>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/predict')}
                className={`p-4 rounded-lg flex items-center justify-center gap-2 ${
                  settings.darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <LineChart size={20} />
                <span>View Detailed Predictions</span>
              </button>
              
              <button
                onClick={() => navigate('/history')}
                className={`p-4 rounded-lg flex items-center justify-center gap-2 ${
                  settings.darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                <Database size={20} />
                <span>View All Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;