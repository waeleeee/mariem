import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  Link as MuiLink,
  IconButton
} from '@mui/material';
import { ShoppingCart, AccountCircle, Chat, Favorite } from '@mui/icons-material';

// Reusing the theme
import { createTheme, ThemeProvider } from '@mui/material/styles';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9066f0',
    },
    background: {
      default: '#28243d',
      paper: '#2f2b47',
    },
    text: {
      primary: '#ffffff',
      secondary: '#adb5bd',
    },
  }
});

function PublicLayout() {
    // Simple check for login state (replace with context/state management later)
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName')

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        window.location.reload(); // Simple way to refresh state
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                 <AppBar position="static" sx={{ backgroundColor: 'background.paper', boxShadow: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                    <Container maxWidth="lg">
                        <Toolbar disableGutters>
                            {/* Logo */}
                            <Typography
                                variant="h6"
                                noWrap
                                component={RouterLink}
                                to="/shop" // Link logo to shop page
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontWeight: 700,
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                }}
                            >
                                RADIO STORE
                            </Typography>

                            {/* Main Nav Links */}
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                <Button sx={{ my: 2, color: 'text.primary', display: 'block' }} component={RouterLink} to="/shop">Products</Button>
                                {token && (
                                    <Button sx={{ my: 2, color: 'text.primary', display: 'block' }} component={RouterLink} to="/support">Support</Button>
                                )}
                                {/* Add About Us, Contact links later if needed */}
                                {/* <Button sx={{ my: 2, color: 'text.primary', display: 'block' }} component={RouterLink} to="/about">About Us</Button> */} 
                                {/* <Button sx={{ my: 2, color: 'text.primary', display: 'block' }} component={RouterLink} to="/contact">Contact</Button> */} 
                            </Box>

                            {/* Right Side Actions */}
                            <Box sx={{ flexGrow: 0 }}>
                                {token ? (
                                    // Logged In State
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <IconButton color="inherit" component={RouterLink} to="/cart">
                                            <ShoppingCart />
                                            {/* Add Badge for cart count later */}
                                        </IconButton>
                                        <IconButton color="inherit" component={RouterLink} to="/wishlist">
                                            <Favorite />
                                        </IconButton>
                                        <IconButton color="inherit" component={RouterLink} to="/support">
                                            <Chat />
                                        </IconButton>
                                        <Button
                                            startIcon={<AccountCircle />}
                                            color="inherit"
                                            sx={{ textTransform: 'none' }}
                                            // onClick={handleOpenUserMenu} // Add dropdown menu later
                                         >
                                             {userName || 'Account'}
                                         </Button>
                                         <Button color="inherit" onClick={handleLogout}>Logout</Button>
                                    </Box>
                                ) : (
                                    // Logged Out State
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button variant="outlined" color="inherit" component={RouterLink} to="/login">Login</Button>
                                        <Button variant="contained" color="primary" component={RouterLink} to="/register">Register</Button>
                                    </Box>
                                )}
                            </Box>
                            {/* Add Mobile Menu Toggle/Drawer later */}
                        </Toolbar>
                    </Container>
                </AppBar>
                
                {/* Main Content Area */}
                <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                    <Outlet /> {/* Child routes will render here */} 
                </Container>
                
                {/* Footer */}
                <Box component="footer" sx={{ p: 3, mt: 'auto', backgroundColor: 'background.paper', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                    <Container maxWidth="lg">
                         <Typography variant="body2" color="text.secondary" align="center">
                            Radio Store © {new Date().getFullYear()}
                         </Typography>
                          {/* Add footer links/social icons later */}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default PublicLayout;