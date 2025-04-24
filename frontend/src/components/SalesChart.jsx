import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Placeholder data for the last 7 days
const salesData = {
  labels: ['Apr 16', 'Apr 17', 'Apr 18', 'Apr 19', 'Apr 20', 'Apr 21', 'Today'],
  datasets: [
    {
      label: 'Sales ($)', // Example Label
      data: [65, 59, 80, 81, 56, 55, 90], // Example data points
      fill: false,
      borderColor: '#9066f0', // Primary purple color
      tension: 0.1,
      pointBackgroundColor: '#9066f0',
      pointRadius: 4
    },
    {
       label: 'Visitors', // Example second dataset from screenshot
       data: [35, 49, 40, 51, 86, 25, 50], // Example data points
       fill: false,
       borderColor: '#ff4d6d', // Example pink/red color
       tension: 0.1,
       pointBackgroundColor: '#ff4d6d',
       pointRadius: 4
     },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
         color: '#adb5bd' // Legend text color
      }
    },
    title: {
      display: false, // Title is handled by the Paper component
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker tooltip
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
      }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)' // Lighter grid lines
      },
      ticks: {
        color: '#adb5bd' // Axis text color
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#adb5bd'
      }
    }
  }
};

function SalesChart() {
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Line options={options} data={salesData} />
    </Box>
  );
}

export default SalesChart; 