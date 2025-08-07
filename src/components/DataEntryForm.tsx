import React, { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { Platform } from '../types';

interface DataEntryFormProps {
  onSuccess?: () => void;
}

export const DataEntryForm: React.FC<DataEntryFormProps> = ({ onSuccess }) => {
  const { addDataPoint, settings } = useDataStore();
  const [multiplier, setMultiplier] = useState<string>('');
  const [platform, setPlatform] = useState<Platform>(settings.defaultPlatform);
  const [customPlatform, setCustomPlatform] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    const multiplierValue = parseFloat(multiplier);
    if (isNaN(multiplierValue) || multiplierValue <= 1) {
      setError('Multiplier must be greater than 1');
      return;
    }
    
    const platformValue = platform === 'custom' ? customPlatform.trim() : platform;
    if (!platformValue) {
      setError('Platform is required');
      return;
    }
    
    setIsSubmitting(true);
    
    // Add the data point
    addDataPoint({
      timestamp: Date.now(),
      multiplier: multiplierValue,
      platform: platformValue,
      notes: notes.trim() || undefined,
    });
    
    // Reset form
    setMultiplier('');
    setNotes('');
    // Keep the platform selection
    
    setIsSubmitting(false);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className={`p-4 rounded-lg shadow-md ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-semibold mb-4">Add New Data Point</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="multiplier" className="block text-sm font-medium mb-1">
          Multiplier *
        </label>
        <input
          id="multiplier"
          type="number"
          step="0.01"
          min="1.01"
          placeholder="e.g., 2.55"
          value={multiplier}
          onChange={(e) => setMultiplier(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            settings.darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300'
          }`}
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="platform" className="block text-sm font-medium mb-1">
          Platform *
        </label>
        <div className="flex gap-2">
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className={`flex-1 px-3 py-2 border rounded-md ${
              settings.darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
          >
            <option value="betpawa">BetPawa</option>
            <option value="other">Other</option>
            <option value="custom">Custom</option>
          </select>
          
          {platform === 'custom' && (
            <input
              type="text"
              placeholder="Enter platform name"
              value={customPlatform}
              onChange={(e) => setCustomPlatform(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-md ${
                settings.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          placeholder="Any observations about this result..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            settings.darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300'
          }`}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md font-medium ${
            isSubmitting 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? 'Adding...' : 'Add Data Point'}
        </button>
      </div>
    </form>
  );
};