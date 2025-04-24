import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  // Container, // Use Box with sx for padding like container
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  // Slider, // Replaced with TextFields for now like HTML
  Button,
  Paper,
  Drawer, // For mobile filter
  useTheme,
  useMediaQuery,
  Chip,
  Snackbar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Search, FilterList, ShoppingCart, AddShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
// Removed nested PublicLayout import

const drawerWidth = 280;

// Filter Sidebar Component - Styled to look like the HTML filter card
const FilterSidebar = ({ categories, brands, filters, onFilterChange, onPriceChange }) => {
    const theme = useTheme();
    return (
        <Paper elevation={0} sx={{ 
            // Mimic filter-card style from HTML
            backgroundColor: 'white',
            borderRadius: '10px', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden', // Match HTML
            mb: 2.5 // Match HTML margin-bottom: 20px;
        }}>
            {/* Mimic filter-header style */}
            <Box sx={{ 
                backgroundColor: '#f5f7fa', 
                p: '15px',
                borderBottom: '1px solid #eee'
            }}>
                <Typography variant="h6" component="h3" sx={{ fontSize: '16px', color: '#333', margin: 0 }}>
                    Filter Products
                </Typography>
            </Box>
            {/* Mimic filter-body style */}
            <Box sx={{ p: '15px' }}>
                {/* Mimic filter-group style */}
                <Box sx={{ mb: 2.5 }}> 
                     <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 1.25, color: '#333', fontSize: '15px' }}>
                         Category
                     </Typography>
                     {/* Mimic filter-checkbox style */}
                     <FormGroup>
                         {categories.map(category => (
                             <FormControlLabel
                                 key={category}
                                 control={<Checkbox checked={filters.categories.includes(category)} onChange={onFilterChange} name="categories" value={category} size="small" sx={{ mr: 1, p: '4px' }} />} // Adjust spacing
                                 label={category.charAt(0).toUpperCase() + category.slice(1)}
                                 sx={{ mb: 0.5, '& .MuiTypography-root': { fontSize: '14px', color: '#555' } }} // Adjust spacing and label style
                             />
                         ))}
                     </FormGroup>
                </Box>

                 {/* Mimic filter-group style */}
                 <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 1.25, color: '#333', fontSize: '15px' }}>
                          Brand
                      </Typography>
                      {/* Mimic filter-checkbox style */}
                      <FormGroup>
                          {brands.map(brand => (
                              <FormControlLabel
                                  key={brand}
                                  control={<Checkbox checked={filters.brands.includes(brand)} onChange={onFilterChange} name="brands" value={brand} size="small" sx={{ mr: 1, p: '4px' }} />}
                                  label={brand}
                                  sx={{ mb: 0.5, '& .MuiTypography-root': { fontSize: '14px', color: '#555' } }}
                              />
                          ))}
                      </FormGroup>
                 </Box>

                 {/* Mimic filter-group style & price-range */}
                 <Box sx={{ mb: 2.5 }}>
                     <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 1.25, color: '#333', fontSize: '15px' }}>
                         Price Range
                     </Typography>
                     <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField 
                            label="Min $"
                            name="minPrice"
                            type="number"
                            size="small"
                            variant="outlined"
                            value={filters.priceRange[0]}
                            onChange={(e) => onPriceChange([Number(e.target.value) || 0, filters.priceRange[1]])}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' }, input: { p: '8px' } }} // Mimic price-range input
                        />
                         <Typography sx={{ color: 'text.secondary' }}>-</Typography>
                        <TextField 
                            label="Max $"
                            name="maxPrice"
                            type="number"
                            size="small"
                            variant="outlined"
                            value={filters.priceRange[1] === Infinity ? '' : filters.priceRange[1]}
                            onChange={(e) => onPriceChange([filters.priceRange[0], Number(e.target.value) || Infinity])}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' }, input: { p: '8px' } }} // Mimic price-range input
                        />
                     </Box>
                 </Box>

                {/* Mimic filter-group style & filter-checkbox */}
                <Box>
                    <FormControlLabel
                        control={<Checkbox checked={filters.inStockOnly} onChange={onFilterChange} name="inStockOnly" size="small" sx={{ mr: 1, p: '4px' }} />}
                        label="In Stock Only"
                        sx={{ '& .MuiTypography-root': { fontSize: '14px', color: '#555' } }}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

function ProductListPage() {
  // State for products and filters
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [filters, setFilters] = useState({ categories: [], brands: [], priceRange: [0, Infinity], inStockOnly: false });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  // Cart state
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:3000/api/products');
        const products = res.data;
        setAllProducts(products);
        setFilteredProducts(products);
        setCategories([...new Set(products.map(p => p.category))]);
        setBrands([...new Set(products.map(p => p.brand))]);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Dynamic filtering and sorting
  useEffect(() => {
    let result = [...allProducts];
    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term));
    }
    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }
    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }
    // Price range filter
    result = result.filter(p => {
      const price = parseFloat(p.price);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    // In-stock filter
    if (filters.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }
    // Sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // featured or others: no change
        break;
    }
    setFilteredProducts(result);
  }, [searchTerm, sortOption, filters, allProducts]);

  const handleFilterChange = (event) => {
    const { name, value, checked } = event.target;
    setFilters(prev => {
      if (name === 'inStockOnly') {
        return { ...prev, inStockOnly: checked };
      }
      const list = prev[name]; // categories or brands
      if (checked) {
        return { ...prev, [name]: [...list, value] };
      } else {
        return { ...prev, [name]: list.filter(item => item !== value) };
      }
    });
  };

  const handlePriceFilterChange = (newRange) => {
    setFilters(prev => ({ ...prev, priceRange: newRange }));
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    console.log("Sort changed (disabled for testing)", event.target.value);
  };

  const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
      console.log("Search term changed (disabled for testing)", event.target.value);
  };

  const toggleMobileFilters = () => {
     setMobileFiltersOpen(!mobileFiltersOpen);
   };

  // Add to cart functionality
  const handleAddToCart = (product) => {
    // Check if the product is already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Update quantity if already in cart
      const updatedCart = cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    // Save to localStorage
    const updatedCart = existingItem 
      ? cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...product, quantity: 1 }];
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Show success message
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarOpen(true);
    
    console.log('Cart updated:', updatedCart);
  };
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing saved cart:', e);
      }
    }
  }, []);
  
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
  
  // Handle adding/removing from wishlist
  const handleWishlistToggle = (product) => {
    // Check if the product is already in wishlist
    const isInWishlist = wishlist.some(item => item.id === product.id);
    let updatedWishlist;
    
    if (isInWishlist) {
      // Remove from wishlist
      updatedWishlist = wishlist.filter(item => item.id !== product.id);
      setSnackbarMessage(`${product.name} removed from wishlist!`);
    } else {
      // Add to wishlist
      updatedWishlist = [...wishlist, product];
      setSnackbarMessage(`${product.name} added to wishlist!`);
    }
    
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setSnackbarOpen(true);
  };
  
  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Cart display below summary
  const CartPreview = () => (
    cart.length > 0 && (
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Your Cart</Typography>
        {cart.map(item => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">{item.name} x {item.quantity}</Typography>
            <Typography variant="body2">${(parseFloat(item.price) * item.quantity).toFixed(2)}</Typography>
          </Box>
        ))}
      </Paper>
    )
  );

  // --- Render Logic --- 
  if (error) {
    return (
      <>
        <Box sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
           <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        </Box>
      </>
    );
  }

  const filterSidebarContent = (
     <FilterSidebar 
         categories={categories}
         brands={brands}
         filters={filters}
         onFilterChange={handleFilterChange}
         onPriceChange={handlePriceFilterChange}
      />
  );

  return (
    <>
      {/* Main content section */}
      <Box sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}> 
          {/* Mimic products-header */} 
          <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2.5, 
              flexWrap: 'wrap', // Handle wrapping like HTML
              gap: 1
          }}>
              <Typography variant="h4" component="h1" sx={{ fontSize: '28px', color: 'text.primary', margin: 0 }}>
                  Browse Our Radio Equipment
              </Typography>
              {/* Mimic products-count */}
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '16px' }}> 
                  Showing <Box component="span" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>{filteredProducts.length}</Box> of {allProducts.length} products
              </Typography>
          </Box>

          {/* Add cart summary */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button 
              component={RouterLink}
              to="/cart"
              startIcon={<ShoppingCart />}
              color="primary"
              variant="outlined"
              sx={{ borderRadius: '6px' }}
            >
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)} items)
            </Button>
          </Box>

          {/* Show cart items preview */}
          <CartPreview />

          {/* Mimic products-controls */} 
           <Box sx={{ 
               display: 'flex', 
               justifyContent: 'space-between', 
               alignItems: 'center', 
               mb: 2.5, 
               flexWrap: 'wrap', 
               gap: 2 
           }}>
             {/* Mimic products-search */} 
             <TextField
                 placeholder="Search products..."
                 variant="outlined"
                 size="small"
                 value={searchTerm}
                 onChange={handleSearchChange}
                 InputProps={{
                   startAdornment: (
                     <InputAdornment position="start">
                       <Search />
                     </InputAdornment>
                   ),
                   sx: { borderRadius: '6px', fontSize: '14px', pr: 0 } // Match border radius and remove padding for button
                 }}
                 sx={{ 
                     maxWidth: { xs: '100%', sm: 450 }, // Match HTML max-width
                     flexGrow: 1, 
                     '& .MuiOutlinedInput-root': { // Style root for better control
                        paddingRight: 0, // Remove padding for adjacent button feel
                        backgroundColor: 'white'
                     },
                    '& .MuiOutlinedInput-input': {
                        padding: '10px 15px' // Match HTML padding
                    }
                 }} 
               />
               {/* Add a search button visually attached (optional, can just rely on input change) */}
              {/* 
              <Button 
                variant="contained" 
                sx={{ 
                    height: '40px', // Match TextField small height
                    boxShadow: 'none', 
                    borderTopLeftRadius: 0, 
                    borderBottomLeftRadius: 0, 
                    ml: '-1px' // Overlap border slightly
                }}
                >
                  <Search />
              </Button> 
              */}

             {/* Mimic products-sort */} 
             <FormControl size="small" sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: '6px' }}>
               <InputLabel id="sort-select-label" sx={{ fontSize: '14px' }}>Sort by</InputLabel>
               <Select
                 labelId="sort-select-label"
                 id="sort-select"
                 value={sortOption}
                 label="Sort by"
                 onChange={handleSortChange}
                 sx={{ borderRadius: '6px', fontSize: '14px', '.MuiSelect-select': { py: '10px', px: '15px' } }} // Match HTML padding/style
               >
                 <MenuItem value="featured">Featured</MenuItem>
                 <MenuItem value="price-low">Price: Low to High</MenuItem>
                 <MenuItem value="price-high">Price: High to Low</MenuItem>
                 <MenuItem value="name-asc">Name: A to Z</MenuItem>
                 <MenuItem value="name-desc">Name: Z to A</MenuItem>
               </Select>
             </FormControl>
           </Box>

            {/* Mimic filter-toggle Button */} 
            {isMobile && (
                <Button 
                    startIcon={<FilterList />} 
                    onClick={toggleMobileFilters} 
                    variant="contained" 
                    sx={{ 
                        mb: 2, 
                        display: { xs: 'flex', md: 'none' },
                        fontWeight: 600,
                        py: '10px',
                        px: '15px'
                    }}
                >
                    Filter Products
                </Button>
            )}

           {/* Mimic products-grid (Main Grid with Sidebar and Products) */} 
          <Grid container spacing={3.75}> {/* Match HTML gap: 30px */} 
              {/* Filter Sidebar (Desktop) - Mimic filter-sidebar */}
              <Grid xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' }, width: '250px', flexShrink: 0 }}>
                 {filterSidebarContent}
              </Grid>

               {/* Mobile Filter Drawer - Styled similar to sidebar */}
               <Drawer
                 anchor="left"
                 open={mobileFiltersOpen}
                 onClose={toggleMobileFilters}
                 sx={{ display: { xs: 'block', md: 'none' } }}
                 PaperProps={{
                   sx: { width: drawerWidth, p: '15px', backgroundColor: 'white', boxShadow: 'none', border: 'none' } // Style like HTML sidebar
                 }}
               >
                  <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                     <Typography variant="h6">Filters</Typography>
                     <Button onClick={toggleMobileFilters}>Close</Button>
                 </Box>
                 {filterSidebarContent} {/* Reuse the styled sidebar content */}
               </Drawer>

              {/* Products Content - Mimic products-content */} 
              <Grid xs={12} md={9} sx={{ flex: 1 }}>
                  {loading ? (
                       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
                   ) : filteredProducts.length === 0 ? (
                       /* Mimic no-products */
                       <Paper elevation={0} sx={{ textAlign: 'center', p: 5, backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', color: 'text.secondary', fontSize: '16px' }}>
                           No products match your current filters.
                       </Paper>
                   ) : (
                      /* Mimic products-grid-view */
                      <Grid container spacing={3.125}> {/* Match HTML gap: 25px */} 
                          {filteredProducts.map((product) => (
                              <Grid key={product.id} xs={12} sm={6} md={6} lg={4}> 
                                  {/* Mimic product-card */}
                                  <Card sx={{ 
                                      height: '100%', 
                                      display: 'flex', 
                                      flexDirection: 'column', 
                                      backgroundColor: 'white', 
                                      borderRadius: '10px', 
                                      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
                                      transition: 'transform 0.2s, box-shadow 0.2s',
                                      '&:hover': { 
                                          transform: 'translateY(-5px)',
                                          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                                          '& .product-image img': { // Target image on hover
                                               transform: 'scale(1.05)'
                                          }
                                      }
                                  }}>
                                      {/* Mimic product-image */} 
                                      <Box sx={{ position: 'relative', height: '220px', overflow: 'hidden' }} className="product-image">
                                          <CardMedia
                                              component="img"
                                              // height="220" // Set height via sx on Box
                                              image={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : `https://via.placeholder.com/300x220.png?text=${product.name.replace(/\s+/g, '')}`}
                                              alt={product.name}
                                              sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                          />
                                          {/* Add wishlist button */}
                                          <IconButton
                                              onClick={(e) => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  handleWishlistToggle(product);
                                              }}
                                              sx={{
                                                  position: 'absolute',
                                                  top: 10,
                                                  left: 10,
                                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                  '&:hover': {
                                                      backgroundColor: 'rgba(255, 255, 255, 1)'
                                                  }
                                              }}
                                          >
                                              {isInWishlist(product.id) ? 
                                                  <Favorite color="error" /> : 
                                                  <FavoriteBorder />
                                              }
                                          </IconButton>
                                          {/* Mimic product-category */} 
                                           <Chip 
                                              label={product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                                              size="small" 
                                              sx={{ 
                                                  position: 'absolute', 
                                                  top: '10px', 
                                                  right: '10px', 
                                                  backgroundColor: 'rgba(0,0,0,0.6)', 
                                                  color: 'white', 
                                                  borderRadius: '5px', // Match HTML
                                                  fontSize: '12px',
                                                  fontWeight: 500,
                                                  height: 'auto', // Adjust height based on content
                                                  '& .MuiChip-label': { px: '10px', py: '4px' } // Match HTML padding
                                               }}
                                          />
                                      </Box>
                                      {/* Mimic product-info */} 
                                      <CardContent sx={{ flexGrow: 1, p: 2.5 }}> {/* Match HTML padding 20px */}
                                          {/* Mimic product title style */}
                                          <Typography 
                                            gutterBottom 
                                            variant="h6" 
                                            component="h3" 
                                            sx={{ 
                                                mb: 1.25, // Match HTML margin
                                                fontSize: '18px',
                                                lineHeight: 1.4,
                                                color: '#333',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                height: '50px' // Fixed height for 2 lines
                                            }}
                                          >
                                              {product.name}
                                          </Typography>
                                          {/* Mimic product-description */} 
                                          <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: 'text.secondary', 
                                                fontSize: '14px', 
                                                lineHeight: 1.6, 
                                                mb: 1.875, // Match HTML margin
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                height: '67px' // Fixed height for 3 lines (14px * 1.6 * 3)
                                            }}
                                            >
                                             {product.description}
                                          </Typography>
                                          {/* Mimic product-meta */} 
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.875 }}>
                                              {/* Mimic product-price */}
                                              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main, fontSize: '20px' }}>
                                                  ${parseFloat(product.price).toFixed(2)}
                                              </Typography>
                                              {/* Mimic product-stock */} 
                                              <Chip 
                                                 label={product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                                                 size="small"
                                                 sx={{
                                                    color: product.stock > 0 ? theme.palette.primary.main : theme.palette.error.main,
                                                    backgroundColor: product.stock > 0 ? '#e8f4ff' : theme.palette.error.lighter, // Adjust colors
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    height: 'auto',
                                                    '& .MuiChip-label': { px: '10px', py: '4px' }
                                                 }}
                                                 // variant={product.stock > 0 ? 'outlined' : 'filled'} // Using background color instead
                                              />
                                          </Box>
                                      </CardContent>
                                      {/* Mimic view-details-btn area (using Add to Cart for now) */} 
                                      <Box sx={{ p: 2.5, pt: 0 }}> {/* Match HTML padding */}
                                          {/* Button row with both View Details and Add to Cart */}
                                          <Box sx={{ display: 'flex', gap: 1 }}>
                                              <Button 
                                                  component={RouterLink} 
                                                  to={`/products/${product.id}`} 
                                                  variant="outlined" 
                                                  color="primary" 
                                                  size="small" 
                                                  sx={{ 
                                                      flexGrow: 1,
                                                      fontWeight: 600,
                                                      py: '10px',
                                                      borderRadius: '6px'
                                                  }}
                                              >
                                                  View Details
                                              </Button>
                                              <Button 
                                                  variant="contained" 
                                                  color="primary"
                                                  disabled={product.stock <= 0}
                                                  onClick={() => handleAddToCart(product)}
                                                  sx={{ 
                                                      fontWeight: 600,
                                                      py: '10px',
                                                      borderRadius: '6px',
                                                      minWidth: 'auto'
                                                  }}
                                              >
                                                  <AddShoppingCart />
                                              </Button>
                                          </Box>
                                      </Box>
                                  </Card>
                              </Grid>
                          ))}
                      </Grid>
                  )}
              </Grid>
          </Grid>
      </Box>

      {/* Notification for adding items to cart */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        sx={{ bottom: { xs: 70, sm: 0 } }}
      />
    </>
  );
}

export default ProductListPage;
