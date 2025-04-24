import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import SalesChart from '../components/SalesChart';
import EquipmentTypeChart from '../components/EquipmentTypeChart';

function AdminStatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [equipmentData, setEquipmentData] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [userStats, setUserStats] = useState({ total: 0, admin: 0, customer: 0 });

  useEffect(() => {
    const fetchStatisticsData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch products for equipment statistics
        const productsRes = await axios.get('http://localhost:3000/api/products');
        const products = productsRes.data;

        // Calculate equipment distribution
        const equipmentCounts = {
          Microphones: products.filter(p => p.category === 'microphones').length,
          Transmitters: products.filter(p => p.category === 'transmitters').length,
          Headphones: products.filter(p => p.category === 'accessories' && p.name.toLowerCase().includes('headphone')).length,
          Speakers: products.filter(p => p.category === 'speakers').length,
          Cables: products.filter(p => p.category === 'accessories' && p.name.toLowerCase().includes('cable')).length,
          Accessories: products.filter(p => p.category === 'accessories').length,
        };

        // Filter out categories with 0 count
        const filteredEquipmentData = Object.entries(equipmentCounts).reduce((acc, [key, value]) => {
          if (value > 0) acc[key] = value;
          return acc;
        }, {});

        setEquipmentData(filteredEquipmentData);

        // Try to fetch users for user statistics
        try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const usersRes = await axios.get('http://localhost:3000/api/users', config);
          const users = usersRes.data;
          
          setUserStats({
            total: users.length,
            admin: users.filter(user => user.role === 'admin').length,
            customer: users.filter(user => user.role === 'customer').length
          });
        } catch (userErr) {
          console.error('Error fetching user statistics:', userErr);
          // Don't fail the whole page if user stats fail
        }

      } catch (err) {
        console.error('Error fetching statistics data:', err);
        setError('Failed to load statistics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatisticsData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Statistics
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Equipment" />
        <Tab label="Sales" />
        <Tab label="Users" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {/* Equipment Statistics Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Equipment Distribution
                  </Typography>
                  <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {Object.keys(equipmentData).length === 0 ? (
                      <Typography color="text.secondary">No equipment data available</Typography>
                    ) : (
                      <EquipmentTypeChart data={equipmentData} />
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Equipment Inventory Status
                  </Typography>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body1">
                      Total Equipment Types: {Object.keys(equipmentData).length}
                    </Typography>
                    <Typography variant="body1">
                      Total Items in Inventory: {Object.values(equipmentData).reduce((sum, count) => sum + count, 0)}
                    </Typography>
                    {Object.entries(equipmentData).map(([category, count]) => (
                      <Typography key={category} variant="body2" sx={{ mt: 1 }}>
                        {category}: {count} items ({((count / Object.values(equipmentData).reduce((sum, c) => sum + c, 0)) * 100).toFixed(1)}%)
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Sales Statistics Tab */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Sales Trends (Last 7 Days)
                  </Typography>
                  <Box sx={{ height: 320 }}>
                    <SalesChart />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* User Statistics Tab */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    User Distribution
                  </Typography>
                  <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {userStats.total === 0 ? (
                      <Typography color="text.secondary">No user data available</Typography>
                    ) : (
                      <EquipmentTypeChart data={{ 
                        Admins: userStats.admin, 
                        Customers: userStats.customer 
                      }} />
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    User Statistics
                  </Typography>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body1">
                      Total Users: {userStats.total}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Admin Users: {userStats.admin} ({((userStats.admin / userStats.total) * 100).toFixed(1)}%)
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Customer Users: {userStats.customer} ({((userStats.customer / userStats.total) * 100).toFixed(1)}%)
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
}

export default AdminStatisticsPage;