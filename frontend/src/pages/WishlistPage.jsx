import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Delete, ShoppingCart } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error parsing saved wishlist:', e);
      }
    }
  }, []);

  // Handle removing from wishlist
  const handleRemoveFromWishlist = (product) => {
    const updatedWishlist = wishlist.filter(item => item.id !== product.id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setSnackbarMessage(`${product.name} removed from wishlist!`);
    setSnackbarOpen(true);
  };

  // Handle adding to cart
  const handleAddToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Wishlist
      </Typography>

      {wishlist.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Your wishlist is empty. Browse our <RouterLink to="/shop">products</RouterLink> to add items to your wishlist.
        </Alert>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {wishlist.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  backgroundColor: 'background.paper',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image || `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component={RouterLink} to={`/products/${product.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${parseFloat(product.price).toFixed(2)}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(product)}
                      sx={{ flex: 1, mr: 1 }}
                    >
                      Add to Cart
                    </Button>
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveFromWishlist(product)}
                      sx={{ ml: 1 }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default WishlistPage;