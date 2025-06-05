import express from 'express';
import { GameRoom } from '../models/GameRoom.js';

const router = express.Router();

router.post('/:roomId/join', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { playerId } = req.body;

    // Validate input
    if (!playerId) {
      return res.status(400).json({ 
        error: 'Player ID is required' 
      });
    }

    // Find the game room
    const gameRoom = await GameRoom.findOne({ roomId });

    // Check if room exists
    if (!gameRoom) {
      return res.status(404).json({ 
        error: 'Game room not found' 
      });
    }

    // Check if room is full
    if (gameRoom.players.length >= gameRoom.maxPlayers) {
      return res.status(400).json({ 
        error: 'Game room is full' 
      });
    }

    // Check if player is already in the room
    if (gameRoom.players.includes(playerId)) {
      return res.status(400).json({ 
        error: 'Player is already in the room' 
      });
    }

    // Add player to the room
    gameRoom.players.push(playerId);

    // Save updated room
    await gameRoom.save();

    res.status(200).json({
      message: 'Player joined successfully',
      room: gameRoom
    });
  } catch (error) {
    console.error('Error joining game room:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router;