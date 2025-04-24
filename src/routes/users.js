const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Register a new user
router.post('/register', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, address, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      role
    });

    // Remove password from response
    const userResponse = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      address: newUser.address,
      role: newUser.role
    };

    return res.status(201).json({ 
      message: 'User created successfully', 
      user: userResponse 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: 'Error registering user',
      error: error.message 
    });
  }
});

// Get all users (admin only in the future)
router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ 
      message: 'Error fetching users',
      error: error.message 
    });
  }
});

// Admin-only: Update user
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { firstName, lastName, email, phoneNumber, address, role } = req.body;
    await user.update({ firstName, lastName, email, phoneNumber, address, role });
    const updated = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    return res.status(200).json({ message: 'User updated successfully', user: updated });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Admin-only: Delete user
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router; 