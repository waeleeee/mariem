const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ 
      message: 'Error fetching products',
      error: error.message 
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ 
      message: 'Error fetching product',
      error: error.message 
    });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      stock, 
      category, 
      brand, 
      model, 
      imageUrls, 
      specifications 
    } = req.body;

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      brand,
      model,
      imageUrls,
      specifications
    });

    return res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ 
      message: 'Error creating product',
      error: error.message 
    });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      stock,
      category,
      brand,
      model,
      imageUrls,
      specifications,
      isActive
    } = req.body;

    await product.update({
      name,
      description,
      price,
      stock,
      category,
      brand,
      model,
      imageUrls,
      specifications,
      isActive
    });

    return res.status(200).json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ 
      message: 'Error updating product',
      error: error.message 
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ 
      message: 'Error deleting product',
      error: error.message 
    });
  }
});

module.exports = router; 