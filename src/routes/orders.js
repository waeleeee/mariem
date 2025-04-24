const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ 
      message: 'Error fetching orders',
      error: error.message 
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ 
      message: 'Error fetching order',
      error: error.message 
    });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { 
      userId, 
      items, 
      shippingAddress, 
      paymentMethod,
      notes 
    } = req.body;

    // Calculate total amount and validate inventory
    let totalAmount = 0;
    const productUpdates = [];
    
    // Check inventory and calculate price
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      
      if (!product) {
        return res.status(404).json({ 
          message: `Product with ID ${item.productId} not found` 
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name}. Available: ${product.stock}` 
        });
      }
      
      // Calculate subtotal for item
      const subtotal = parseFloat(product.price) * item.quantity;
      totalAmount += subtotal;
      
      // Prepare inventory update
      productUpdates.push({
        product,
        newStock: product.stock - item.quantity
      });
      
      // Add price information to item
      item.priceAtTime = product.price;
      item.subtotal = subtotal;
    }
    
    // Create the order
    const newOrder = await Order.create({
      userId,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes
    });
    
    // Create order items
    const orderItems = [];
    for (const item of items) {
      const orderItem = await OrderItem.create({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: item.priceAtTime,
        subtotal: item.subtotal
      });
      orderItems.push(orderItem);
    }
    
    // Update inventory
    for (const update of productUpdates) {
      await update.product.update({ stock: update.newStock });
    }
    
    // Fetch the complete order with related data
    const completeOrder = await Order.findByPk(newOrder.id, {
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
    
    return res.status(201).json({
      message: 'Order created successfully',
      order: completeOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ 
      message: 'Error creating order',
      error: error.message 
    });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order status
    await order.update({ status });
    
    return res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ 
      message: 'Error updating order status',
      error: error.message 
    });
  }
});

// Update payment status
router.patch('/:id/payment', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update payment status
    await order.update({ paymentStatus });
    
    return res.status(200).json({
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return res.status(500).json({ 
      message: 'Error updating payment status',
      error: error.message 
    });
  }
});

module.exports = router; 