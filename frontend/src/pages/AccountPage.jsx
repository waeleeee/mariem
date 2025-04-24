import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AccountPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) return;
      try {
        const res = await axios.get(`http://localhost:3000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user || res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Account</Typography>
      {!user ? (
        <Typography>Loading...</Typography>
      ) : (
        <Paper sx={{ p: 2, maxWidth: 400 }}>
          <List>
            <ListItem><ListItemText primary="Name" secondary={`${user.firstName} ${user.lastName}`} /></ListItem>
            <ListItem><ListItemText primary="Email" secondary={user.email} /></ListItem>
            <ListItem><ListItemText primary="Role" secondary={user.role} /></ListItem>
            <ListItem><ListItemText primary="Phone" secondary={user.phoneNumber || '-'} /></ListItem>
            <ListItem><ListItemText primary="Address" secondary={user.address || '-'} /></ListItem>
          </List>
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default AccountPage; 