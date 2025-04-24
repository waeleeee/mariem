const express = require('express');
const router = express.Router();
const { Chat, Message, User } = require('../models');
const { authenticate } = require('../middleware/auth');

// Get all chats for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const chats = await Chat.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        },
        {
          model: Message,
          order: [['createdAt', 'DESC']],
          limit: 1
        }
      ]
    });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get messages for a chat
router.get('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { chatId: req.params.chatId },
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'role']
      }],
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create a new chat
router.post('/', authenticate, async (req, res) => {
  try {
    const chat = await Chat.create();
    await chat.addUser(req.user.id);
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Send a message
router.post('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const message = await Message.create({
      chatId: req.params.chatId,
      userId: req.user.id,
      content: req.body.content
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;