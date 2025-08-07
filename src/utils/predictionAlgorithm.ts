import { AviatorData, DataFilter, PredictionResult, AppSettings } from '../types';

// Enhanced pattern detection for better predictions
const detectPatterns = (data: AviatorData[]): {
  pattern: 'rising' | 'falling' | 'alternating' | 'stable' | 'none';
  strength: number;
  avgMultiplier: number;
  volatility: number;
} => {
  if (data.length < 5) return { pattern: 'none', strength: 0, avgMultiplier: 0, volatility: 0 };
  
  const values = data.map(d => d.multiplier);
  const diffs = values.slice(1).map((val, i) => val - values[i]);
  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const avgMultiplier = values.reduce((a, b) => a + b, 0) / values.length;
  
  // Calculate volatility
  const volatility = Math.sqrt(
    diffs.map(d => Math.pow(d - avgDiff, 2)).reduce((a, b) => a + b, 0) / diffs.length
  );
  
  // Detect alternating pattern
  let alternating = 0;
  for (let i = 1; i < values.length; i++) {
    if ((values[i] > values[i-1] && (i === 1 || values[i-1] < values[i-2])) ||
        (values[i] < values[i-1] && (i === 1 || values[i-1] > values[i-2]))) {
      alternating++;
    }
  }
  
  const alternatingStrength = alternating / (values.length - 1);
  
  // Detect trend
  const trend = avgDiff;
  const trendStrength = Math.abs(trend) / avgMultiplier;
  
  if (alternatingStrength > 0.7) {
    return {
      pattern: 'alternating',
      strength: alternatingStrength * 100,
      avgMultiplier,
      volatility
    };
  } else if (Math.abs(trendStrength) > 0.1) {
    return {
      pattern: trend > 0 ? 'rising' : 'falling',
      strength: Math.min(Math.abs(trendStrength) * 200, 100),
      avgMultiplier,
      volatility
    };
  }
  
  return {
    pattern: 'stable',
    strength: Math.max(0, 100 - (volatility * 100)),
    avgMultiplier,
    volatility
  };
};

// Advanced prediction algorithm with pattern recognition
const predictNextMultiplier = (data: AviatorData[]): PredictionResult => {
  if (data.length < 5) {
    return {
      predictedMultiplier: 2.0,
      confidence: 0,
      basedOnSamples: data.length,
      recommendedAction: 'skip'
    };
  }
  
  const recentData = data.slice(-20);
  const pattern = detectPatterns(recentData);
  
  let prediction: number;
  let confidence: number;
  
  switch (pattern.pattern) {
    case 'alternating': {
      const lastValue = recentData[recentData.length - 1].multiplier;
      prediction = lastValue < pattern.avgMultiplier 
        ? pattern.avgMultiplier * 1.2 
        : pattern.avgMultiplier * 0.8;
      confidence = pattern.strength;
      break;
    }
    
    case 'rising': {
      prediction = pattern.avgMultiplier * (1 + pattern.volatility);
      confidence = pattern.strength * (1 - pattern.volatility);
      break;
    }
    
    case 'falling': {
      prediction = pattern.avgMultiplier * (1 - pattern.volatility * 0.5);
      confidence = pattern.strength * (1 - pattern.volatility);
      break;
    }
    
    case 'stable': {
      prediction = pattern.avgMultiplier;
      confidence = pattern.strength;
      break;
    }
    
    default: {
      prediction = pattern.avgMultiplier;
      confidence = 50;
    }
  }
  
  // Ensure prediction is within reasonable bounds
  prediction = Math.max(1.2, Math.min(prediction, 10));
  
  // Adjust confidence based on sample size
  confidence = confidence * (recentData.length / 20);
  
  return {
    predictedMultiplier: parseFloat(prediction.toFixed(2)),
    confidence: Math.round(confidence),
    basedOnSamples: recentData.length,
    recommendedAction: confidence >= 65 ? 'bet' : 'skip'
  };
};

// Main prediction function
export const calculatePrediction = (
  data: AviatorData[], 
  settings: AppSettings, 
  filter: DataFilter
): PredictionResult => {
  const filteredData = data.filter(item => {
    if (filter.startDate && item.timestamp < filter.startDate.getTime()) return false;
    if (filter.endDate && item.timestamp > filter.endDate.getTime()) return false;
    if (filter.minMultiplier && item.multiplier < filter.minMultiplier) return false;
    if (filter.maxMultiplier && item.multiplier > filter.maxMultiplier) return false;
    if (filter.platforms && filter.platforms.length > 0 && !filter.platforms.includes(item.platform)) return false;
    return true;
  });
  
  return predictNextMultiplier(filteredData);
};