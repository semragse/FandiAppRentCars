const express = require('express');
const cors = require('cors');

const PORT = 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});

// Keep the process running
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  process.exit(0);
});
