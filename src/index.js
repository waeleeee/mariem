const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const chatRoutes = require('./routes/chats');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

// Import middleware
const { authenticate, authorizeAdmin } = require('./middleware/auth');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Define model associations
User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chats', chatRoutes);

// Test route
app.get('/', (req, res) => {
  const diagnosticInfo = {
    message: 'Welcome to Radio Equipment Store API',
    serverTime: new Date().toISOString(),
    nodeVersion: process.version,
    endpoints: {
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      auth: '/api/auth/login'
    },
    clientInfo: {
      ip: req.ip,
      headers: req.headers
    }
  };
  
  res.json(diagnosticInfo);
});

// Direct test route for products (for debugging)
app.get('/test-products', async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({ 
      message: 'Test products route',
      products: products 
    });
  } catch (error) {
    console.error('Error in test products route:', error);
    return res.status(500).json({ 
      message: 'Error fetching products',
      error: error.message 
    });
  }
});

// Protected route example
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Admin route example
app.get('/api/admin', authenticate, authorizeAdmin, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Try also: http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();