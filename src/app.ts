import express from 'express';
import mongoose from 'mongoose';
import GameRoom from './models/GameRoom';
import { GameRoomStatus } from './types/GameRoomStatus';

const app = express();

// Middleware
app.use(express.json());

// Status update endpoint
app.patch('/api/game-rooms/:roomId/status', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { status, updatedBy } = req.body;

    // Validate status
    if (!Object.values(GameRoomStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the room
    const room = await GameRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Authorization check
    if (room.creator.toString() !== updatedBy) {
      return res.status(403).json({ message: 'Not authorized to update room status' });
    }

    // Update room status
    const updatedRoom = await GameRoom.findByIdAndUpdate(
      roomId, 
      { status }, 
      { new: true }
    );

    res.status(200).json({ 
      status: updatedRoom?.status, 
      message: 'Room status updated successfully' 
    });
  } catch (error) {
    console.error('Room status update error:', error);
    res.status(500).json({ message: 'Error updating room status' });
  }
});

export default app;