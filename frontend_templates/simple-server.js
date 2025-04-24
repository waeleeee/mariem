const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files - make this more explicit to ensure it works
app.use(express.static(path.join(__dirname)));
console.log('Serving static files from:', __dirname);

// Routes
app.get('/', (req, res) => {
  res.redirect('/register.html');
});

app.get('/register', (req, res) => {
  res.redirect('/register.html');
});

app.get('/login', (req, res) => {
  res.redirect('/login.html');
});

// POST routes for API endpoints
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('Registration attempt:', { name, email });
  
  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Return success
  return res.status(201).json({
    message: 'User registered successfully',
    user: { name, email, role: 'user' }
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email });
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Return success for any login
  return res.status(200).json({
    message: 'Login successful',
    user: { 
      id: 1, 
      name: 'Demo User', 
      email: email,
      role: 'user'
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Try accessing: http://localhost:${port}/register.html`);
}); 