import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { AviatorData, DataFilter, PredictionResult, AppSettings, User } from '../types';
import { calculatePrediction } from '../utils/predictionAlgorithm';

interface DataState {
  user: User | null;
  aviatorData: AviatorData[];
  currentFilter: DataFilter;
  settings: AppSettings;
  latestPrediction: PredictionResult | null;
  isLoading: boolean;
  isCollecting: boolean;
  
  // Actions
  startSession: (email: string, platform: Platform) => void;
  endSession: () => void;
  addDataPoint: (data: Omit<AviatorData, 'id'>) => void;
  deleteDataPoint: (id: string) => void;
  updateDataPoint: (id: string, data: Partial<AviatorData>) => void;
  setFilter: (filter: DataFilter) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  generatePrediction: () => void;
  clearAllData: () => void;
  importData: (data: AviatorData[]) => void;
  toggleCollection: () => void;
}

// Initial app settings
const defaultSettings: AppSettings = {
  predictionAlgorithm: 'basic',
  confidenceThreshold: 70,
  darkMode: true,
  autoRefresh: false,
  defaultPlatform: 'betpawa',
};

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      user: null,
      aviatorData: [],
      currentFilter: {},
      settings: defaultSettings,
      latestPrediction: null,
      isLoading: false,
      isCollecting: false,
      
      startSession: (email, platform) => {
        set({
          user: {
            email,
            platform,
            isActive: true
          }
        });
      },
      
      endSession: () => {
        set({
          user: null,
          isCollecting: false
        });
      },
      
      addDataPoint: (data) => {
        const newDataPoint: AviatorData = {
          id: uuidv4(),
          ...data,
        };
        
        set((state) => ({
          aviatorData: [...state.aviatorData, newDataPoint],
        }));
        
        // Auto-generate new prediction when data is added
        if (get().settings.autoRefresh) {
          get().generatePrediction();
        }
      },
      
      deleteDataPoint: (id) => {
        set((state) => ({
          aviatorData: state.aviatorData.filter((item) => item.id !== id),
        }));
      },
      
      updateDataPoint: (id, data) => {
        set((state) => ({
          aviatorData: state.aviatorData.map((item) => 
            item.id === id ? { ...item, ...data } : item
          ),
        }));
      },
      
      setFilter: (filter) => {
        set({ currentFilter: filter });
      },
      
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      
      generatePrediction: () => {
        set({ isLoading: true });
        
        // Simulating API call or complex calculation
        setTimeout(() => {
          const { aviatorData, settings, currentFilter } = get();
          const prediction = calculatePrediction(aviatorData, settings, currentFilter);
          
          set({
            latestPrediction: prediction,
            isLoading: false,
          });
        }, 800);
      },
      
      clearAllData: () => {
        set({ aviatorData: [] });
      },
      
      importData: (data) => {
        set((state) => ({
          aviatorData: [...state.aviatorData, ...data],
        }));
      },
      
      toggleCollection: () => {
        set((state) => ({
          isCollecting: !state.isCollecting
        }));
      },
    }),
    {
      name: 'aviator-storage',
    }
  )
);