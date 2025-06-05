import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Status update endpoint (placeholder)
app.patch('/api/game-rooms/:roomId/status', async (req, res) => {
  try {
    // Simulate room status update logic
    res.status(200).json({ 
      status: req.body.status, 
      message: 'Room status updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating room status' });
  }
});

export default app;