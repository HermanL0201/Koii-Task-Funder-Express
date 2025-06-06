import express from 'express';

export const app = express();

app.use(express.json());

app.post('/login', (req, res) => {
  // Placeholder login logic
  res.status(200).json({ token: 'dummy-token' });
});