import express from 'express';

export const app = express();

// Middleware
app.use(express.json());

// Authentication Routes (to be implemented)
app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ message: 'Registration stub' });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({ message: 'Login stub' });
});