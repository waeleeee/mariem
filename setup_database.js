const sequelize = require('./src/config/database');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');
const OrderItem = require('./src/models/OrderItem');

// Define model associations
User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

async function setupDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Force sync to drop existing tables and recreate them
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully.');
    
    return { success: true };
  } catch (error) {
    console.error('Error setting up database:', error);
    return { success: false, error: error.message };
  } finally {
    process.exit(0);
  }
}

setupDatabase(); 