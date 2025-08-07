// Define types for the application

export interface AviatorData {
  id: string;
  timestamp: number;
  multiplier: number;
  platform: string;
  notes?: string;
}

export interface PredictionResult {
  predictedMultiplier: number;
  confidence: number; // 0-100
  basedOnSamples: number;
  recommendedAction?: 'bet' | 'skip';
}

export interface DataFilter {
  startDate?: Date;
  endDate?: Date;
  minMultiplier?: number;
  maxMultiplier?: number;
  platforms?: string[];
}

export type Platform = 'betpawa' | 'other' | 'custom';

export interface AppSettings {
  predictionAlgorithm: 'basic' | 'advanced' | 'pattern';
  confidenceThreshold: number;
  darkMode: boolean;
  autoRefresh: boolean;
  defaultPlatform: Platform;
}

export interface User {
  email: string;
  platform: Platform;
  isActive: boolean;
}