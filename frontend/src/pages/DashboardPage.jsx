import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Grid, Paper, CircularProgress, Alert, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Import chart components
import SalesChart from '../components/SalesChart';
import EquipmentTypeChart from '../components/EquipmentTypeChart';

// Summary Card Component
const SummaryCard = ({ title, count, link = "#", isLoading }) => (
  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 120, justifyContent: 'space-between', backgroundColor: 'background.paper' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
       <MuiLink component={RouterLink} to={link} sx={{ color: 'text.secondary' }}>
          ▶
       </MuiLink>
    </Box>
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {isLoading ? (
        <CircularProgress size={24} />
      ) : (
        <Typography component="p" variant="h4">
          {count}
        </Typography>
      )}
    </Box>
  </Paper>
);

function DashboardPage() {
  const [summaryData, setSummaryData] = useState({});
  const [equipmentChartData, setEquipmentChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const productsRes = await axios.get('http://localhost:3000/api/products');
        const products = productsRes.data;

        // Calculate counts for summary cards and equipment chart
        const counts = {
          Microphones: products.filter(p => p.category === 'microphones').length,
          Transmitters: products.filter(p => p.category === 'transmitters').length,
          Headphones: products.filter(p => p.category === 'accessories' && p.name.toLowerCase().includes('headphone')).length,
          Speakers: products.filter(p => p.category === 'speakers').length,
          Cables: products.filter(p => p.category === 'accessories' && p.name.toLowerCase().includes('cable')).length,
          Accessories: products.filter(p => p.category === 'accessories').length,
        };
        // Filter out categories with 0 count for the chart
        const chartCounts = Object.entries(counts).reduce((acc, [key, value]) => {
            if (value > 0) acc[key] = value;
            return acc;
            }, {});

        setSummaryData(counts);
        setEquipmentChartData(chartCounts); // Use filtered counts for chart

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box>
       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        {/* Summary Cards */}
        {Object.entries(summaryData).map(([key, value]) => (
             <Grid xs={12} sm={6} md={4} lg={2} key={key}>
               <SummaryCard title={key} count={value ?? '-'} isLoading={loading} link={`/admin/products/${key.toLowerCase()}`} />
             </Grid>
        ))}

        {/* Charts Row */}
        <Grid xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300, backgroundColor: 'background.paper' }}>
             <Typography component="h2" variant="h6" color="primary" gutterBottom>
                 Sales for the last 7 Days
             </Typography>
             <Box sx={{ flexGrow: 1, position: 'relative' }}>
                 {loading ? <CircularProgress /> : <SalesChart />}
             </Box>
          </Paper>
        </Grid>
        <Grid xs={12} md={4}>
           <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300, backgroundColor: 'background.paper' }}>
             <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Equipment by Type
             </Typography>
             <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {loading || Object.keys(equipmentChartData).length === 0 ? <CircularProgress /> : <EquipmentTypeChart data={equipmentChartData} />}
              </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}

export default DashboardPage; 