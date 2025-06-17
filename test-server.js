// Simple test server
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8003;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'YourGPT Backend is running!' });
});

app.get('/', (req, res) => {
  res.json({ message: 'YourGPT Backend Server', status: 'running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
