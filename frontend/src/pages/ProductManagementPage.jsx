import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Dialog, // For Add/Edit Modals
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

// Placeholder for Add/Edit Product Form Component (or use Dialogs)
// import ProductForm from '../components/ProductForm';

function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for Add/Edit Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'microphones', // Default category
    brand: '',
    model: '',
    specifications: '{}', // Store as JSON string in form
    isActive: true
  });

  // State for Delete Confirmation Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const productCategories = [
      'microphones',
      'speakers',
      'transmitters',
      'receivers',
      'antennas',
      'accessories'
    ];

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      // TODO: Add auth token if needed for fetching products
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Dialog Functions --- 
  const handleOpenAddDialog = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
    setFormData({ // Reset form for adding
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'microphones',
        brand: '',
        model: '',
        specifications: '{}',
        isActive: true
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (product) => {
    setIsEditMode(true);
    setCurrentProduct(product);
    setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        brand: product.brand,
        model: product.model || '',
        specifications: JSON.stringify(product.specifications || {}, null, 2),
        isActive: product.isActive
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
    setError(''); // Clear dialog errors
  };

  const handleDialogChange = (event) => {
     const { name, value, type, checked } = event.target;
     setFormData(prev => ({
       ...prev,
       [name]: type === 'checkbox' ? checked : value
     }));
   };

  const handleDialogSubmit = async () => {
    setError('');
    let specificationsObject;
    try {
        specificationsObject = JSON.parse(formData.specifications);
    } catch (e) {
        setError('Specifications must be valid JSON.');
        return;
    }

    const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        specifications: specificationsObject
    };

    try {
      let response;
      // TODO: Add Authorization header with token
      const config = {
        // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };

      if (isEditMode && currentProduct) {
        response = await axios.put(`http://localhost:3000/api/products/${currentProduct.id}`, productData, config);
        console.log('Product updated:', response.data);
      } else {
        response = await axios.post('http://localhost:3000/api/products', productData, config);
        console.log('Product added:', response.data);
      }
      handleCloseDialog();
      fetchProducts(); // Refresh the product list
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} product:`, err);
      setError(`Failed to ${isEditMode ? 'update' : 'add'} product. ${err.response?.data?.message || 'Please try again.'}`);
    }
  };

  // --- Delete Dialog Functions ---
  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      // TODO: Add Authorization header with token
      const config = {
        // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };
      await axios.delete(`http://localhost:3000/api/products/${productToDelete.id}`, config);
      console.log('Product deleted:', productToDelete.id);
      handleCloseDeleteDialog();
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
       handleCloseDeleteDialog(); // Close dialog even on error
    }
  };

  // --- Render Logic ---
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
        >
          Add Product
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper'}}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {product.name}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell align="right">${parseFloat(product.price).toFixed(2)}</TableCell>
                <TableCell align="right">{product.stock}</TableCell>
                <TableCell align="center">
                    <Chip 
                        label={product.isActive ? 'Active' : 'Inactive'} 
                        color={product.isActive ? 'success' : 'error'}
                        size="small"
                    />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleOpenEditDialog(product)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDeleteDialog(product)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

       {/* Add/Edit Product Dialog */}
       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
           <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
           <DialogContent>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} 
              <Box component="form">
                <Grid container spacing={2}>
                  <Grid xs={6}>
                    <TextField name="name" label="Name" value={formData.name} onChange={handleDialogChange} fullWidth />
                  </Grid>
                  <Grid xs={6}>
                    <TextField name="brand" label="Brand" value={formData.brand} onChange={handleDialogChange} fullWidth />
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select name="category" value={formData.category} label="Category" onChange={handleDialogChange}>
                        {productCategories.map(cat => (
                          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={6}>
                    <FormControlLabel
                      control={<Checkbox name="isActive" checked={formData.isActive} onChange={handleDialogChange} />}
                      label="Active"
                    />
                  </Grid>
                </Grid>
                <TextField
                   margin="dense"
                   name="description"
                   label="Description"
                   type="text"
                   fullWidth
                   variant="outlined"
                   multiline
                   rows={3}
                   value={formData.description}
                   onChange={handleDialogChange}
                   required
               />
               <Grid container spacing={2}>
                   <Grid xs={6}>
                       <TextField
                           margin="dense"
                           name="price"
                           label="Price"
                           type="number"
                           fullWidth
                           variant="outlined"
                           value={formData.price}
                           onChange={handleDialogChange}
                           required
                       />
                   </Grid>
                   <Grid xs={6}>
                       <TextField
                           margin="dense"
                           name="stock"
                           label="Stock Quantity"
                           type="number"
                           fullWidth
                           variant="outlined"
                           value={formData.stock}
                           onChange={handleDialogChange}
                           required
                       />
                   </Grid>
               </Grid>
                <TextField
                   margin="dense"
                   name="model"
                   label="Model (Optional)"
                   type="text"
                   fullWidth
                   variant="outlined"
                   value={formData.model}
                   onChange={handleDialogChange}
               />
               <TextField
                    margin="dense"
                    name="specifications"
                    label="Specifications (JSON format)"
                    type="text"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formData.specifications}
                    onChange={handleDialogChange}
                    helperText='Enter as valid JSON, e.g., {"key": "value"}'
                />
           </Box>
           </DialogContent>
           <DialogActions>
               <Button onClick={handleCloseDialog}>Cancel</Button>
               <Button onClick={handleDialogSubmit} variant="contained">{isEditMode ? 'Save Changes' : 'Add Product'}</Button>
           </DialogActions>
       </Dialog>

       {/* Delete Confirmation Dialog */}
       <Dialog
         open={openDeleteDialog}
         onClose={handleCloseDeleteDialog}
       >
         <DialogTitle>Confirm Delete</DialogTitle>
         <DialogContent>
           <DialogContentText>
             Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
           </DialogContentText>
         </DialogContent>
         <DialogActions>
           <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
           <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
         </DialogActions>
       </Dialog>

    </Box>
  );
}

export default ProductManagementPage;