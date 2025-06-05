import { Request, Response } from 'express';
import GameRoom from './models/GameRoom';
import { validateRoomJoin } from './middleware/validation';

/**
 * Route handler for joining a game room
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with join status
 */
export const joinGameRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { playerId } = req.body;

    // Validate input using middleware or validation function
    const validationError = await validateRoomJoin(roomId, playerId);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    // Find the game room
    const gameRoom = await GameRoom.findById(roomId);
    if (!gameRoom) {
      return res.status(404).json({
        success: false,
        message: 'Game room not found'
      });
    }

    // Check if room is full
    if (gameRoom.players.length >= gameRoom.maxPlayers) {
      return res.status(400).json({
        success: false,
        message: 'Game room is full'
      });
    }

    // Check if player is already in the room
    if (gameRoom.players.some(player => player.id === playerId)) {
      return res.status(400).json({
        success: false,
        message: 'Player is already in the room'
      });
    }

    // Add player to the room
    gameRoom.players.push({ id: playerId });
    await gameRoom.save();

    res.status(200).json({
      success: true,
      message: 'Successfully joined game room',
      room: gameRoom
    });
  } catch (error) {
    console.error('Error joining game room:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};