import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { AviatorData } from '../../types';
import { useDataStore } from '../../store/dataStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MultiplierChartProps {
  data: AviatorData[];
  limit?: number;
}

export const MultiplierChart: React.FC<MultiplierChartProps> = ({ data, limit = 20 }) => {
  const { settings } = useDataStore();
  
  // Process chart data
  const chartData = useMemo(() => {
    const limitedData = [...data].slice(-limit);
    
    // Group by platform for multi-line chart
    const platforms = Array.from(new Set(limitedData.map(item => item.platform)));
    
    const datasets = platforms.map((platform, index) => {
      const platformData = limitedData.filter(item => item.platform === platform);
      
      // Generate a color based on index
      const colors = [
        'rgb(59, 130, 246)', // blue
        'rgb(16, 185, 129)', // green
        'rgb(249, 115, 22)', // orange
        'rgb(236, 72, 153)', // pink
        'rgb(139, 92, 246)', // purple
      ];
      
      const colorIndex = index % colors.length;
      
      return {
        label: platform,
        data: platformData.map(item => item.multiplier),
        borderColor: colors[colorIndex],
        backgroundColor: colors[colorIndex] + '33', // Add transparency
        tension: 0.2,
      };
    });
    
    const chartData: ChartData<'line'> = {
      labels: limitedData.map(item => format(item.timestamp, 'HH:mm:ss')),
      datasets,
    };
    
    return chartData;
  }, [data, limit]);
  
  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 1,
        grid: {
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
      x: {
        grid: {
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
      title: {
        display: true,
        text: 'Recent Multiplier Values',
        color: settings.darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };
  
  if (data.length === 0) {
    return (
      <div className={`p-4 rounded-lg text-center ${settings.darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        No data available for chart visualization.
      </div>
    );
  }
  
  return (
    <div className={`p-4 rounded-lg shadow ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};