const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/sensor', (req, res) => {
  console.log('Request received:', req.originalUrl);
  res.json({ message: 'Server reached' });
});

app.listen(5000, () => console.log('Test server running on port 5000'));
