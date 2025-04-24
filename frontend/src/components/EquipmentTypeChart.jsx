import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Box } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

function EquipmentTypeChart({ data }) { // Expects data as a prop
  const chartData = {
    labels: Object.keys(data), // e.g., ['Microphones', 'Speakers', ...]
    datasets: [
      {
        label: '# of Equipment',
        data: Object.values(data), // e.g., [24, 18, ...]
        backgroundColor: [
          'rgba(144, 102, 240, 0.8)', // Purple
          'rgba(54, 162, 235, 0.8)', // Blue
          'rgba(255, 206, 86, 0.8)', // Yellow
          'rgba(75, 192, 192, 0.8)', // Teal
          'rgba(153, 102, 255, 0.8)', // Indigo
          'rgba(255, 99, 132, 0.8)',  // Red
          'rgba(255, 159, 64, 0.8)'  // Orange
        ],
        borderColor: [
          'rgba(144, 102, 240, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
         labels: {
             color: '#adb5bd' // Legend text color
         }
      },
      title: {
        display: false,
      },
       tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
        }
    },
  };

  return (
      <Box sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <Doughnut data={chartData} options={options} />
      </Box>
     
  );
}

export default EquipmentTypeChart; 