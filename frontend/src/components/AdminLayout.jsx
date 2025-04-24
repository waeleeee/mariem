import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Divider,
  Collapse,
  Button
} from '@mui/material';
import {
    Dashboard, Inventory, Mic, SettingsInputAntenna, Headset, Speaker, Cable, Category,
    Assessment, LockPerson, Chat, Group,
    ReceiptLong, AttachMoney, People,
    ExpandLess, ExpandMore, Logout, Notifications, Language, DarkMode
} from '@mui/icons-material';

const drawerWidth = 260;

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
  },
  typography: {
    fontFamily: 'sans-serif',
    h3: {
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: '#adb5bd',
        padding: '16px 16px 8px 16px',
        textTransform: 'uppercase'
    }
  },
  components: {
    MuiDrawer: {
        styleOverrides: {
            paper: {
                backgroundColor: "#2f2b47",
                color: "#adb5bd",
                borderRight: 'none'
            }
        }
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                paddingLeft: '24px',
                paddingTop: '10px',
                paddingBottom: '10px',
                '& .MuiListItemIcon-root': {
                    minWidth: '40px',
                    color: 'inherit'
                 },
                '&.Mui-selected': {
                    backgroundColor: 'rgba(144, 102, 240, 0.15)',
                    borderLeft: '4px solid #9066f0',
                    paddingLeft: '20px',
                    color: '#ffffff',
                    '& .MuiListItemIcon-root': {
                       color: '#9066f0',
                     },
                },
                 '&:hover': {
                    backgroundColor: 'rgba(144, 102, 240, 0.1)',
                 }
            }
        }
    }
  }
});

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'Admin User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const mainMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Statistics', icon: <Assessment />, path: '/admin/stats' },
    { text: 'Access Control', icon: <LockPerson />, path: '/admin/access' },
    { text: 'Chat', icon: <Chat />, path: '/admin/chat' },
    { text: 'User Management', icon: <Group />, path: '/admin/users' },
  ];

  const equipmentMenuItems = [
    { text: 'Inventory', icon: <Inventory />, path: '/admin/inventory' },
    { text: 'Products', icon: <Category />, path: '/admin/products' },
    { text: 'Microphones', icon: <Mic />, path: '/admin/products/microphones' },
    { text: 'Transmitters', icon: <SettingsInputAntenna />, path: '/admin/products/transmitters' },
    { text: 'Headphones', icon: <Headset />, path: '/admin/products/headphones' },
    { text: 'Speakers', icon: <Speaker />, path: '/admin/products/speakers' },
    { text: 'Cables', icon: <Cable />, path: '/admin/products/cables' },
    { text: 'Accessories', icon: <Category />, path: '/admin/products/accessories' },
  ];

  const salesMenuItems = [
    { text: 'Transactions', icon: <AttachMoney />, path: '/admin/transactions' },
    { text: 'Invoices', icon: <ReceiptLong />, path: '/admin/invoices' },
    { text: 'Customers', icon: <People />, path: '/admin/customers' },
  ];

  const renderMenuItems = (items) => {
    return items.map((item) => (
        <ListItemButton
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path))}
        >
            <ListItemIcon>
                {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
        </ListItemButton>
    ));
  }

  return (
    <ThemeProvider theme={darkTheme}>
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
            position="fixed"
            sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            backgroundColor: 'background.paper',
            boxShadow: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                 <Box /> 
                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" sx={{ mr: 1 }}>
                         <DarkMode />
                    </IconButton>
                     <IconButton color="inherit" sx={{ mr: 1 }}>
                         <Language /> 
                     </IconButton>
                     <Typography variant="body2" sx={{ mr: 2 }}>English</Typography> 

                    <IconButton color="inherit">
                        <Badge badgeContent={0} color="error">
                        <Notifications />
                        </Badge>
                    </IconButton>
                    <Typography variant="body2" sx={{ mx: 1.5, fontWeight: 'bold' }}>
                        {userName}
                    </Typography>
                     <Button variant="contained" size="small" sx={{ mr: 1.5, textTransform: 'none' }}>Website</Button>
                    <Button color="inherit" onClick={handleLogout} startIcon={<Logout />} size="small">Logout</Button>
                </Box>
            </Toolbar>
        </AppBar>
        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar sx={{ display: 'flex', alignItems: 'center', px: [2], justifyContent: 'center', height: '64px' }}>
                 <Typography variant="h6" noWrap component="div" color="primary" fontWeight="bold">
                 RADIO STORE 
                 </Typography>
            </Toolbar>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}/>
            <List component="nav">
                <Typography variant="h3">MAIN</Typography>
                {renderMenuItems(mainMenuItems)}

                <Typography variant="h3">EQUIPMENT DATA</Typography>
                 {renderMenuItems(equipmentMenuItems)}

                 <Typography variant="h3">SALES DATA</Typography>
                 {renderMenuItems(salesMenuItems)}
            </List>
        </Drawer>
        <Box
            component="main"
            sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            height: '100vh',
            overflow: 'auto'
            }}
        >
            <Toolbar /> 
            <Outlet /> 
        </Box>
        </Box>
    </ThemeProvider>
  );
}

export default AdminLayout; 