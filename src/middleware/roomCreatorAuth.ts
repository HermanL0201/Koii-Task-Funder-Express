import { Request, Response, NextFunction } from 'express';
import { GameRoom } from '../models/GameRoom'; // Assuming GameRoom model exists

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

/**
 * Middleware to verify that the authenticated user is the creator of the room
 * @param req Express request object
 * @param res Express response object 
 * @param next Express next middleware function
 */
export const verifyRoomCreator = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    const roomId = req.params.roomId || req.body.roomId;

    // Validate room ID
    if (!roomId) {
      return res.status(400).json({ 
        error: 'Room ID is required' 
      });
    }

    // Find the room and check creator
    const room = await GameRoom.findById(roomId);

    // Check if room exists
    if (!room) {
      return res.status(404).json({ 
        error: 'Room not found' 
      });
    }

    // Check if current user is the room creator
    if (room.creatorId.toString() !== req.user.id) {
      return res.status(403).json({ 
        error: 'Only room creator can perform this action' 
      });
    }

    // If all checks pass, proceed to next middleware
    next();
  } catch (error) {
    console.error('Room creator authentication error:', error);
    res.status(500).json({ 
      error: 'Internal server error during room creator verification' 
    });
  }
};