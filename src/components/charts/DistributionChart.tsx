import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AviatorData } from '../../types';
import { useDataStore } from '../../store/dataStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DistributionChartProps {
  data: AviatorData[];
  bins?: number;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ 
  data,
  bins = 10 
}) => {
  const { settings } = useDataStore();
  
  // Process the distribution data
  const distributionData = useMemo(() => {
    if (data.length === 0) return null;
    
    // Get min and max values
    const multipliers = data.map(item => item.multiplier);
    let min = Math.floor(Math.min(...multipliers));
    let max = Math.ceil(Math.max(...multipliers));
    
    // If max is too large, cap it to show a reasonable distribution
    if (max > 10) max = 10;
    if (min < 1) min = 1;
    
    // Calculate bin size
    const binSize = (max - min) / bins;
    
    // Create bins
    const distribution: number[] = Array(bins).fill(0);
    const binLabels: string[] = [];
    
    // Create bin labels
    for (let i = 0; i < bins; i++) {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
    }
    
    // Populate bins
    data.forEach(item => {
      if (item.multiplier >= min && item.multiplier < max) {
        const binIndex = Math.min(bins - 1, Math.floor((item.multiplier - min) / binSize));
        distribution[binIndex]++;
      }
    });
    
    const chartData: ChartData<'bar'> = {
      labels: binLabels,
      datasets: [
        {
          label: 'Distribution',
          data: distribution,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        },
      ],
    };
    
    return chartData;
  }, [data, bins]);
  
  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Frequency',
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
        grid: {
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Multiplier Range',
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
        grid: {
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Multiplier Distribution',
        color: settings.darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
      },
    },
  };
  
  if (!distributionData) {
    return (
      <div className={`p-4 rounded-lg text-center ${settings.darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        No data available for distribution analysis.
      </div>
    );
  }
  
  return (
    <div className={`p-4 rounded-lg shadow ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="h-80">
        <Bar data={distributionData} options={options} />
      </div>
    </div>
  );
};