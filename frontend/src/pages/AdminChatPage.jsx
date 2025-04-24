import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  TextField, 
  Button, 
  Divider, 
  Grid, 
  Avatar, 
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import { Send as SendIcon, Person as PersonIcon } from '@mui/icons-material';
import axios from 'axios';

function AdminChatPage() {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/chats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Transform the API response to match our UI needs
        const formattedChats = response.data.map(chat => ({
          id: chat.id,
          userId: chat.Users[0].id,
          userName: `${chat.Users[0].firstName} ${chat.Users[0].lastName}`,
          userRole: chat.Users[0].role,
          unreadCount: 0,
          lastMessage: chat.Messages && chat.Messages.length > 0 
            ? chat.Messages[0].content 
            : 'No messages yet',
          timestamp: chat.Messages && chat.Messages.length > 0 
            ? new Date(chat.Messages[0].createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            : ''
        }));
        
        setActiveChats(formattedChats);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError('Failed to load chat data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
    // Set up periodic refresh
    const interval = setInterval(fetchChats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChatSelect = async (chat) => {
    setSelectedChat(chat);
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/chats/${chat.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const formattedMessages = response.data.map(msg => ({
        id: msg.id,
        senderId: msg.userId,
        text: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString(),
        isAdmin: msg.userId === parseInt(localStorage.getItem('userId'))
      }));
      
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom of messages when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // (REMOVE THE DUPLICATE handleChatSelect FUNCTION HERE)

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/api/chats/${selectedChat.id}/messages`, {
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Add the new message to the UI
      const newMsg = {
        id: response.data.id,
        senderId: response.data.userId,
        text: response.data.content,
        timestamp: new Date(response.data.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isAdmin: true
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      // Update the last message in chat list
      setActiveChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                lastMessage: newMessage,
                timestamp: new Date().toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              }
            : chat
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getTotalUnreadCount = () => {
    return activeChats.reduce((total, chat) => total + chat.unreadCount, 0);
  };

  return (
    <Box sx={{ bgcolor: "#181c2f", minHeight: "100vh", color: "#fff" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#fff", pl: 2, pt: 2 }}>
        Support Chat
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          mb: 2,
          pl: 2,
          "& .MuiTabs-indicator": { backgroundColor: "#8f6fff" },
          "& .MuiTab-root": { color: "#bdbdbd" },
          "& .Mui-selected": { color: "#8f6fff !important" }
        }}
      >
        <Tab 
          label={
            <Badge badgeContent={getTotalUnreadCount()} color="error">
              Active Chats
            </Badge>
          } 
        />
        <Tab label="Resolved" />
      </Tabs>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={0} sx={{ height: 'calc(100vh - 120px)' }}>
          {/* Chat List Sidebar */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper sx={{
              height: '100%',
              overflow: 'auto',
              bgcolor: "#23263a",
              borderRadius: "16px 0 0 16px",
              boxShadow: "none"
            }}>
              <List>
                {activeChats.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No active chats" sx={{ color: "#bdbdbd" }} />
                  </ListItem>
                ) : (
                  activeChats.map(chat => (
                    <React.Fragment key={chat.id}>
                      <ListItem 
                        button 
                        selected={selectedChat?.id === chat.id}
                        onClick={() => handleChatSelect(chat)}
                        sx={{ 
                          bgcolor: selectedChat?.id === chat.id ? "#8f6fff" : "transparent",
                          color: selectedChat?.id === chat.id ? "#fff" : "#bdbdbd",
                          borderRadius: "8px",
                          mx: 1,
                          my: 1,
                          "&:hover": { bgcolor: "#2e3350" }
                        }}
                      >
                        <Avatar sx={{ mr: 2, bgcolor: "#181c2f", color: "#8f6fff" }}>
                          <PersonIcon />
                        </Avatar>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body1" component="span" sx={{ color: "inherit" }}>
                                {chat.userName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#bdbdbd" }}>
                                {chat.timestamp}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: "#bdbdbd",
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '120px'
                                }}
                              >
                                {chat.lastMessage}
                              </Typography>
                              {chat.unreadCount > 0 && (
                                <Badge badgeContent={chat.unreadCount} color="error" />
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
          
          {/* Chat Messages Area */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: "#23263a",
              borderRadius: "0 16px 16px 0",
              boxShadow: "none"
            }}>
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: '#2e3350', bgcolor: "#23263a" }}>
                    <Typography variant="h6" sx={{ color: "#fff" }}>
                      {selectedChat.userName}
                    </Typography>
                  </Box>
                  
                  {/* Messages Area */}
                  <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: "#181c2f" }}>
                    {messages.map(message => (
                      <Box 
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent: message.isAdmin ? 'flex-end' : 'flex-start',
                          mb: 2
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: '70%',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: message.isAdmin ? "#8f6fff" : "#23263a",
                            color: "#fff",
                            boxShadow: message.isAdmin ? "0 2px 8px #8f6fff44" : "none"
                          }}
                        >
                          <Typography variant="body1">{message.text}</Typography>
                          <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: "#bdbdbd" }}>
                            {message.timestamp}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    <div ref={messagesEndRef} />
                  </Box>
                  
                  {/* Message Input */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: '#2e3350', display: 'flex', bgcolor: "#23263a" }}>
                    <TextField
                      fullWidth
                      placeholder="Type your message..."
                      variant="outlined"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      size="small"
                      sx={{
                        bgcolor: "#181c2f",
                        borderRadius: "8px",
                        input: { color: "#fff" }
                      }}
                    />
                    <Button 
                      variant="contained" 
                      sx={{
                        ml: 1,
                        bgcolor: "#8f6fff",
                        color: "#fff",
                        "&:hover": { bgcolor: "#7a5be6" }
                      }}
                      endIcon={<SendIcon />}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography color="#bdbdbd">
                    Select a chat to start messaging
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default AdminChatPage;