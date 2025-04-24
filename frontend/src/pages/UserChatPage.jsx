import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Avatar, 
  CircularProgress,
  Alert
} from '@mui/material';
import { Send as SendIcon, Person as PersonIcon } from '@mui/icons-material';
import axios from 'axios';

function UserChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem('userId');
  // Removed: const userName = localStorage.getItem('userName');
  const [currentChat, setCurrentChat] = useState(null);

  // Fetch chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true);
      try {
        // Fetch or create the user's chat
        const token = localStorage.getItem('token');
        let chatRes = await axios.get('http://localhost:3000/api/chats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        let chat;
        if (chatRes.data.length > 0) {
          chat = chatRes.data[0];
        } else {
          // Create a new chat if none exists
          const createRes = await axios.post('http://localhost:3000/api/chats', { userIds: [] }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          chat = createRes.data;
        }
        setCurrentChat(chat);
        
        // Fetch messages for this chat
        const messagesRes = await axios.get(`http://localhost:3000/api/chats/${chat.id}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(messagesRes.data.map(msg => ({
          id: msg.id,
          senderId: msg.userId,
          text: msg.content,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAdmin: msg.userId !== userId // Adjust this logic as needed
        })));
      } catch (err) {
        console.error('Error fetching chat history:', err);
        setError('Failed to load chat history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    if (userId) {
      fetchChatHistory();
    }
  }, [userId]);

  useEffect(() => {
    // Scroll to bottom of messages when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId || !currentChat) return;
    try {
      const token = localStorage.getItem('token');
      
      // Send the message
      const msgRes = await axios.post(`http://localhost:3000/api/chats/${currentChat.id}/messages`, {
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(prev => [
        ...prev,
        {
          id: msgRes.data.id,
          senderId: msgRes.data.userId,
          text: msgRes.data.content,
          timestamp: new Date(msgRes.data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAdmin: false
        }
      ]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Customer Support
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid 
          container 
          justifyContent="center" 
          sx={{ width: '100%' }}
        >
          <Grid 
            size={{ 
              xs: 12, 
              md: 8, 
              lg: 6 
            }}
          >
            <Paper sx={{ height: 'calc(70vh - 100px)', display: 'flex', flexDirection: 'column' }}>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  Support Chat
                </Typography>
              </Box>
              
              {/* Messages Area */}
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {messages.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="text.secondary">
                      No messages yet. Start a conversation with our support team!
                    </Typography>
                  </Box>
                ) : (
                  messages.map(message => (
                    <Box 
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.isAdmin ? 'flex-start' : 'flex-end',
                        mb: 2
                      }}
                    >
                      {message.isAdmin && (
                        <Avatar sx={{ mr: 1 }}>
                          <PersonIcon />
                        </Avatar>
                      )}
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: message.isAdmin ? 'grey.100' : 'primary.light',
                        }}
                      >
                        <Typography variant="body1">{message.text}</Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="div"  // Changed from p to div
                          sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}
                        >
                          {message.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
                <div ref={messagesEndRef} />
              </Box>
              
              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex' }}>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  variant="outlined"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={handleSendMessage}
                  sx={{ ml: 1 }}
                  disabled={!newMessage.trim()}
                >
                  Send
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default UserChatPage;