import React, { useEffect, useState } from 'react';
import { Plane, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { PredictionResult } from '../types';
import { useDataStore } from '../store/dataStore';

interface PredictionDisplayProps {
  prediction: PredictionResult | null;
  isLoading?: boolean;
}

export const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ 
  prediction, 
  isLoading = false 
}) => {
  const { settings, aviatorData } = useDataStore();
  const [nextUpdate, setNextUpdate] = useState<number>(10);
  
  useEffect(() => {
    if (!isLoading && prediction) {
      const timer = setInterval(() => {
        setNextUpdate(prev => prev > 0 ? prev - 1 : 10);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLoading, prediction]);
  
  if (isLoading) {
    return (
      <div className={`p-6 rounded-lg shadow-md text-center ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-center mb-4">
          <Plane className="animate-bounce text-blue-500" size={48} />
        </div>
        <p className="text-lg">Analyzing patterns...</p>
      </div>
    );
  }
  
  if (!prediction) {
    return (
      <div className={`p-6 rounded-lg shadow-md text-center ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-center mb-4">
          <AlertCircle className="text-yellow-500" size={48} />
        </div>
        <p className="text-lg mb-2">Waiting for more data</p>
        <p className="text-sm text-gray-500">Collecting game results...</p>
      </div>
    );
  }
  
  const getConfidenceColor = () => {
    if (prediction.confidence >= 80) return 'text-green-500';
    if (prediction.confidence >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getTrendIcon = () => {
    if (aviatorData.length < 2) return null;
    const lastTwo = aviatorData.slice(-2);
    const trend = lastTwo[1].multiplier - lastTwo[0].multiplier;
    
    return trend > 0 ? (
      <TrendingUp className="text-green-500" size={24} />
    ) : (
      <TrendingDown className="text-red-500" size={24} />
    );
  };
  
  const getRecommendation = () => {
    if (prediction.confidence < 60) {
      return "Wait for clearer patterns";
    }
    return `Consider auto-cashout at ${prediction.predictedMultiplier.toFixed(2)}x`;
  };
  
  return (
    <div className={`p-6 rounded-lg shadow-lg bg-gradient-to-br ${
      settings.darkMode 
        ? prediction.confidence >= 70 ? 'from-blue-900 to-indigo-900' : 'from-gray-800 to-gray-900'
        : prediction.confidence >= 70 ? 'from-blue-50 to-indigo-100' : 'from-gray-50 to-gray-100'
    }`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h3 className="text-lg font-medium">Next Predicted Peak</h3>
          {getTrendIcon()}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-center items-baseline">
            <span className="font-mono text-6xl font-bold">
              {prediction.predictedMultiplier.toFixed(2)}
            </span>
            <span className="text-2xl ml-1">x</span>
          </div>
          
          <div className="mt-4 flex justify-center">
            <div className={`px-4 py-2 rounded-full ${
              prediction.confidence >= 70 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {getRecommendation()}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm mb-2">Confidence Level</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className={`h-2.5 rounded-full ${
                  prediction.confidence >= 80 ? 'bg-green-500' : 
                  prediction.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${prediction.confidence}%` }}
              />
            </div>
            <span className={`font-mono font-bold ${getConfidenceColor()}`}>
              {prediction.confidence}%
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`p-3 rounded-lg ${settings.darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <p className="text-sm text-gray-500">Based On</p>
            <p className="font-mono text-lg">{prediction.basedOnSamples} rounds</p>
          </div>
          <div className={`p-3 rounded-lg ${settings.darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <p className="text-sm text-gray-500">Next Update</p>
            <p className="font-mono text-lg">{nextUpdate}s</p>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <p>Pattern strength: {prediction.confidence >= 75 ? 'Strong' : prediction.confidence >= 60 ? 'Moderate' : 'Weak'}</p>
        </div>
      </div>
    </div>
  );
};