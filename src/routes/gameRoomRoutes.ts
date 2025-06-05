import { Request, Response } from 'express';
import { GameRoom, Player } from '../models/GameRoom';

export async function joinGameRoom(req: Request, res: Response) {
  try {
    const { roomId } = req.params;
    const { playerId, username } = req.body;

    // Validate input
    if (!roomId || !playerId || !username) {
      return res.status(400).json({ 
        message: 'Room ID, Player ID, and Username are required' 
      });
    }

    // Find the game room
    const gameRoom = await GameRoom.findOne({ roomId });
    if (!gameRoom) {
      return res.status(404).json({ message: 'Game room not found' });
    }

    // Check if room is full
    if (gameRoom.players.length >= gameRoom.maxPlayers) {
      return res.status(400).json({ message: 'Game room is full' });
    }

    // Check if player is already in the room
    const playerExists = gameRoom.players.some(p => p.id === playerId);
    if (playerExists) {
      return res.status(400).json({ message: 'Player already in the room' });
    }

    // Add player to the room
    const newPlayer: Player = { id: playerId, username };
    gameRoom.players.push(newPlayer);

    // Save updated game room
    await gameRoom.save();

    res.status(200).json({
      message: 'Player joined game room successfully',
      room: gameRoom
    });
  } catch (error) {
    console.error('Error joining game room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}