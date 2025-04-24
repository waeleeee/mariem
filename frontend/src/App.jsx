import React from 'react';
import { Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// Layouts
import AdminLayout from './components/AdminLayout';
import PublicLayout from './components/PublicLayout'; // Import Public Layout

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductManagementPage from './pages/ProductManagementPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetail from './pages/ProductDetail'; // Import ProductDetail component
import AdminUsersPage from './pages/AdminUsersPage'; // Import new Admin Users Page
import AdminStatisticsPage from './pages/AdminStatisticsPage';
import AccessControlPage from './pages/AccessControlPage';
import AdminChatPage from './pages/AdminChatPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import UserChatPage from './pages/UserChatPage';
import WishlistPage from './pages/WishlistPage';
// Import other pages as needed
// import HomePage from './pages/HomePage';

// Stub pages for equipment and sales data
const InventoryPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>Inventory</Typography>
    <Typography>Manage stock levels and inventory reports.</Typography>
  </Box>
);
const MicrophonesPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>Microphones</Typography>
    <Typography>View and manage all microphone products.</Typography>
  </Box>
);
const TransmittersPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>Transmitters</Typography>
    <Typography>View and manage all transmitter products.</Typography>
  </Box>
);
const HeadphonesPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>Headphones</Typography>
    <Typography>View and manage all headphone products.</Typography>
  </Box>
);
const SpeakersPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>Speakers</Typography>
    <Typography>View and manage all speaker products.</Typography>
  </Box>
);
const CablesPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>Cables</Typography>
    <Typography>View and manage all cable products.</Typography>
  </Box>
);
const AccessoriesPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>Accessories</Typography>
    <Typography>View and manage all accessory products.</Typography>
  </Box>
);
const TransactionsPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>Transactions</Typography>
    <Typography>Review all orders and transactions.</Typography>
  </Box>
);
const InvoicesPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>Invoices</Typography>
    <Typography>Manage invoice generation and billing.</Typography>
  </Box>
);
const CustomersPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>Customers</Typography>
    <Typography>View user profiles and customer data.</Typography>
  </Box>
);

// Basic CSS reset and global styles
import './index.css'; // Use index.css for reset

// Simple authentication check (replace with context/redux/zustand later)
const useAuth = () => {
  // Check if token and user role exist in localStorage
  // In a real app, you'd also verify the token's validity
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); // Assuming role is stored on login

  return {
    isAuthenticated: !!token, // True if token exists
    isAdmin: userRole === 'admin', // True if role is admin
  };
};

// Protected Route Component for Admins
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    // Redirect non-admins somewhere else, e.g., a public home page or their profile
    return <Navigate to="/shop" replace />; // Redirect non-admin logged-in users to shop
  }
  return children;
};

// Protected Route Component for Logged-in Users (Non-Admin specific)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // Add this line to get authentication state
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Auth Routes - These should be outside PublicLayout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public Routes within PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/shop" element={<ProductListPage />} />
        <Route path="/cart" element={<CartPage />} />
        {/* Add the route for ProductDetail */}
        <Route path="/products/:productId" element={<ProductDetail />} />
        {/* Account page for logged-in users */}
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        {/* Add the new user chat route */}
        <Route path="/support" element={<ProtectedRoute><UserChatPage /></ProtectedRoute>} />
        {/* Add other public routes here (About, Contact, Product Detail etc.) */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
         {/* Root path redirect logic needs adjustment if /shop is the main public view */}
        <Route
           path="/"
           element={
             isAuthenticated
               ? isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/shop" replace />
               : <Navigate to="/shop" replace /> // Redirect non-logged-in users to shop by default
           }
         />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
      </Route>

      {/* Admin Routes - Use AdminLayout */} 
      <Route 
        path="/admin" 
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        {/* Default admin route */} 
        <Route index element={<Navigate to="dashboard" replace />} /> 
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="stats" element={<AdminStatisticsPage />} />
        <Route path="access" element={<AccessControlPage />} />
        <Route path="chat" element={<AdminChatPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="products/microphones" element={<MicrophonesPage />} />
        <Route path="products/transmitters" element={<TransmittersPage />} />
        <Route path="products/headphones" element={<HeadphonesPage />} />
        <Route path="products/speakers" element={<SpeakersPage />} />
        <Route path="products/cables" element={<CablesPage />} />
        <Route path="products/accessories" element={<AccessoriesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="customers" element={<CustomersPage />} />
        {/* Add other admin routes here (e.g., orders, users) */}
        {/* <Route path="orders" element={<AdminOrdersPage />} /> */} 
      </Route>

      {/* Catch-all route for 404 Not Found */}
      <Route path="*" element={<div><h2>404 Not Found</h2><p>Sorry, the page you are looking for does not exist.</p><a href="/">Go Home</a></div>} />

    </Routes>
  );
}

export default App;
