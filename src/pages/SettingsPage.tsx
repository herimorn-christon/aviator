import React from 'react';
import { Sun, Moon, Save, RotateCw, Wrench } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { AppSettings, Platform } from '../types';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, clearAllData, generatePrediction } = useDataStore();
  
  const algorithms = [
    { id: 'basic', name: 'Basic', description: 'Simple average-based prediction with minimal processing' },
    { id: 'advanced', name: 'Advanced', description: 'Enhanced algorithm with trend analysis and weighted predictions' },
    { id: 'pattern', name: 'Pattern Detection', description: 'Sophisticated algorithm that looks for recurring patterns' },
  ];
  
  const handleSettingChange = <K extends keyof AppSettings>(
    key: K, 
    value: AppSettings[K]
  ) => {
    updateSettings({ [key]: value });
    
    // Re-generate prediction if algorithm changes
    if (key === 'predictionAlgorithm') {
      generatePrediction();
    }
  };
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
      clearAllData();
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-4 rounded-lg shadow-md ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-lg font-medium mb-4">Prediction Settings</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Prediction Algorithm
            </label>
            <div className="space-y-2">
              {algorithms.map((algorithm) => (
                <div 
                  key={algorithm.id}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    settings.predictionAlgorithm === algorithm.id
                      ? settings.darkMode
                        ? 'border-blue-500 bg-blue-900 bg-opacity-20'
                        : 'border-blue-500 bg-blue-50'
                      : settings.darkMode
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSettingChange('predictionAlgorithm', algorithm.id as 'basic' | 'advanced' | 'pattern')}
                >
                  <div className="flex items-center gap-2">
                    <Wrench 
                      size={16} 
                      className={settings.predictionAlgorithm === algorithm.id ? 'text-blue-500' : 'text-gray-500'} 
                    />
                    <span className="font-medium">{algorithm.name}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{algorithm.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Confidence Threshold
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={settings.confidenceThreshold}
                onChange={(e) => handleSettingChange('confidenceThreshold', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="font-mono w-10">{settings.confidenceThreshold}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum confidence level required for a "bet" recommendation
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Default Platform
            </label>
            <select
              value={settings.defaultPlatform}
              onChange={(e) => handleSettingChange('defaultPlatform', e.target.value as Platform)}
              className={`w-full px-3 py-2 border rounded-md ${
                settings.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="betpawa">BetPawa</option>
              <option value="other">Other</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Auto Refresh Predictions
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoRefresh}
                  onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer ${
                  settings.darkMode ? 'bg-gray-700' : 'bg-gray-200'
                } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Automatically refresh predictions when new data is added
            </p>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg shadow-md ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-lg font-medium mb-4">Display Settings</h2>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Dark Mode
              </label>
              <button
                onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                className={`p-2 rounded-full ${
                  settings.darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {settings.darkMode ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-blue-600" />
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-md font-medium mb-2">Data Management</h3>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={generatePrediction}
                className={`py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                  settings.darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <RotateCw size={16} />
                <span>Regenerate Prediction</span>
              </button>
              
              <button
                onClick={handleClearData}
                className="py-2 px-4 rounded-md flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                <Save size={16} />
                <span>Clear All Data</span>
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md dark:bg-yellow-900 dark:bg-opacity-20 dark:text-yellow-200">
              <p className="text-sm">
                <strong>Warning:</strong> Clearing data will remove all your collected aviator results and cannot be undone. Make sure to export your data first if you want to keep a backup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;