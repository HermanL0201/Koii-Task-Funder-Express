import { Request, Response } from 'express';
import GameRoom from './models/GameRoom';
import { validateRoomJoin } from './middleware/validationMiddleware';

/**
 * Handles joining a game room
 * @route POST /game-rooms/:roomId/join
 */
export const joinGameRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { playerId } = req.body;

    // Validate input 
    if (!roomId || !playerId) {
      return res.status(400).json({ 
        error: 'Room ID and Player ID are required' 
      });
    }

    // Find the game room
    const gameRoom = await GameRoom.findById(roomId);

    // Check if room exists
    if (!gameRoom) {
      return res.status(404).json({ 
        error: 'Game room not found' 
      });
    }

    // Check if room is full
    if (gameRoom.players.length >= gameRoom.maxPlayers) {
      return res.status(400).json({ 
        error: 'Game room is already full' 
      });
    }

    // Check if player is already in the room
    const isPlayerAlreadyInRoom = gameRoom.players.some(
      player => player.toString() === playerId
    );

    if (isPlayerAlreadyInRoom) {
      return res.status(400).json({ 
        error: 'Player is already in the room' 
      });
    }

    // Add player to the room
    gameRoom.players.push(playerId);
    await gameRoom.save();

    res.status(200).json({ 
      message: 'Successfully joined the game room', 
      room: gameRoom 
    });
  } catch (error) {
    console.error('Error joining game room:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};