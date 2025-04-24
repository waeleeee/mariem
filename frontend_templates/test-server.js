const express = require('express');
const app = express();
const port = 3003;

// Log all requests
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use(express.static(__dirname));
console.log('Serving static files from:', __dirname);

// Routes
app.get('/', (req, res) => {
  res.redirect('/test.html');
});

// Start server
app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
}); 