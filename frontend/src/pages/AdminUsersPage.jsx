import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Stack
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', phoneNumber: '', address: '', role: 'customer'
  });

  // Fetch users and orders
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      // Fetch users first
      const usersRes = await axios.get('http://localhost:3000/api/users', config);
      setUsers(usersRes.data);
      
      try {
        // Try to fetch orders separately to handle potential order-specific errors
        const ordersRes = await axios.get('http://localhost:3000/api/orders', config);
        setOrders(ordersRes.data);
      } catch (orderErr) {
        console.error('Error loading orders:', orderErr);
        // Still set orders to empty array but don't fail the whole page
        setOrders([]);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { fetchData(); }, []);

  // Compute stats per user
  const stats = users.map(u => {
    const userOrders = orders.filter(o => o.User && o.User.id === u.id);
    const orderCount = userOrders.length;
    const totalSales = userOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0);
    return { ...u, orderCount, totalSales };
  });

  // Open Add User dialog
  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '', address: '', role: 'customer' });
    setIsDialogOpen(true);
  };
  
  // Open Edit User dialog
  const handleOpenEdit = (user) => {
    setIsEditing(true);
    setSelectedUserId(user.id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      role: user.role
    });
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => setIsDialogOpen(false);
  const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  // Save Add or Edit
  const handleSaveUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      if (isEditing) {
        await axios.put(`http://localhost:3000/api/users/${selectedUserId}`, formData, config);
      } else {
        await axios.post('http://localhost:3000/api/users/register', formData, config);
      }
      fetchData();
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.response?.data?.message || 'Failed to save user.');
    }
  };
  
  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      await axios.delete(`http://localhost:3000/api/users/${id}`, config);
      fetchData();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user.');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenAdd}>
        + Add User
      </Button>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : users.length === 0 ? (
        <Alert severity="info">No users found. Add a new user to get started.</Alert>
      ) : (
        <Paper elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Orders</TableCell>
                <TableCell align="right">Total Sales ($)</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell align="right">{user.orderCount}</TableCell>
                  <TableCell align="right">{user.totalSales.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" onClick={() => handleOpenEdit(user)}><Edit fontSize="small"/></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}><Delete fontSize="small"/></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleFormChange} fullWidth />
            <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleFormChange} fullWidth />
            <TextField label="Email" name="email" value={formData.email} onChange={handleFormChange} fullWidth />
            {!isEditing && <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleFormChange} fullWidth />}
            <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} fullWidth />
            <TextField label="Address" name="address" value={formData.address} onChange={handleFormChange} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select name="role" value={formData.role} label="Role" onChange={handleFormChange}>
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser}>{isEditing ? 'Save Changes' : 'Create User'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminUsersPage;