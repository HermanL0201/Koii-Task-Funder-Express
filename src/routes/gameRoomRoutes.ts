import express, { Request, Response } from 'express';
import { GameRoom } from '../models/GameRoom';

const router = express.Router();

/**
 * Join a game room
 * @route POST /game-rooms/:roomId/join
 * @param {string} roomId - ID of the game room to join
 * @param {string} playerId - ID of the player joining
 * @param {string} username - Username of the player
 */
router.post('/:roomId/join', async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { playerId, username } = req.body;

    // Validate input
    if (!playerId || !username) {
      return res.status(400).json({ 
        message: 'Player ID and username are required' 
      });
    }

    // Find the game room
    const gameRoom = await GameRoom.findOne({ roomId });

    // Check if room exists
    if (!gameRoom) {
      return res.status(404).json({ 
        message: 'Game room not found' 
      });
    }

    // Check if player is already in the room
    const isPlayerAlreadyInRoom = gameRoom.players.some(p => p.id === playerId);
    if (isPlayerAlreadyInRoom) {
      return res.status(400).json({ 
        message: 'Player is already in the room' 
      });
    }

    // Attempt to add player
    const playerAdded = gameRoom.addPlayer({ id: playerId, username });

    if (!playerAdded) {
      return res.status(400).json({ 
        message: 'Cannot join room: Room is full or closed' 
      });
    }

    // Save updated room
    await gameRoom.save();

    // Return updated room details
    res.status(200).json({
      message: 'Successfully joined game room',
      room: gameRoom
    });
  } catch (error) {
    console.error('Error joining game room:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

export default router;