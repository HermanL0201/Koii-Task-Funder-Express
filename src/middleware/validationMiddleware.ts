import { Request, Response, NextFunction } from 'express';

/**
 * Validate room join request
 * @param req Express request object
 * @param res Express response object
 * @param next Next middleware function
 */
export const validateRoomJoin = (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.params;
  const { playerId } = req.body;

  // Validate room ID format (assuming it's a MongoDB ObjectId)
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  
  if (!roomId || !objectIdRegex.test(roomId)) {
    return res.status(400).json({ 
      error: 'Invalid Room ID format' 
    });
  }

  // Validate player ID
  if (!playerId || !objectIdRegex.test(playerId)) {
    return res.status(400).json({ 
      error: 'Invalid Player ID format' 
    });
  }

  next();
};