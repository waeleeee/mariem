const sequelize = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

// Define model associations
User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

async function seedDatabase() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models (recreate tables)
    await sequelize.sync({ force: true });
    console.log('Database models synchronized with force: true.');
    
    // Create test user
    let testUser;
    try {
      testUser = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phoneNumber: '1234567890',
        address: '123 Test Street',
        role: 'admin'
      });
      console.log('Test user created:', testUser.id);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        console.log('User already exists, fetching existing user');
        testUser = await User.findOne({ where: { email: 'test@example.com' } });
        console.log('Fetched existing user:', testUser.id);
      } else {
        throw error;
      }
    }
    
    // Create test products
    let products = [];
    try {
      products = await Product.bulkCreate([
        {
          name: 'Professional Microphone',
          description: 'High-quality studio microphone for professional recording',
          price: 299.99,
          stock: 25,
          category: 'microphones',
          brand: 'AudioPro',
          model: 'AP-200',
          specifications: {
            frequency: '20Hz-20kHz',
            pattern: 'Cardioid',
            connectivity: 'XLR'
          }
        },
        {
          name: 'Wireless Microphone',
          description: 'Reliable wireless microphone for stage performances',
          price: 199.50,
          stock: 15,
          category: 'microphones',
          brand: 'SoundMax',
          model: 'SM-100W',
          specifications: {
            frequency: '50Hz-15kHz',
            range: '100m',
            batteryLife: '8 hours'
          }
        },
        {
          name: 'Studio Headphones',
          description: 'Closed-back studio headphones for monitoring',
          price: 149.99,
          stock: 30,
          category: 'accessories',
          brand: 'AudioPro',
          model: 'AP-H300',
          specifications: {
            frequency: '10Hz-25kHz',
            impedance: '64 ohms',
            cableLength: '3m'
          }
        }
      ]);
      console.log('Test products created:', products.length);
    } catch (error) {
      console.error('Error creating products:', error);
      products = await Product.findAll();
      console.log('Using existing products:', products.length);
    }
    
    // Create a test order
    let testOrder;
    try {
      testOrder = await Order.create({
        userId: testUser.id,
        totalAmount: 499.48,
        shippingAddress: '123 Test Street, Test City, Test Country',
        paymentMethod: 'credit_card',
        status: 'processing',
        paymentStatus: 'completed'
      });
      console.log('Test order created:', testOrder.id);
      
      // Create order items
      await OrderItem.bulkCreate([
        {
          orderId: testOrder.id,
          productId: products[0].id,
          quantity: 1,
          priceAtTime: products[0].price,
          subtotal: products[0].price
        },
        {
          orderId: testOrder.id,
          productId: products[1].id,
          quantity: 1,
          priceAtTime: products[1].price,
          subtotal: products[1].price
        }
      ]);
      console.log('Test order items created');
    } catch (error) {
      console.error('Error creating order:', error);
    }
    
    console.log('Database seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error: error.message };
  } finally {
    // Close the database connection
    process.exit(0);
  }
}

// Run the seed function
seedDatabase(); 