import { Request, Response, NextFunction } from 'express';

export const validateGameRoomInput = (req: Request, res: Response, next: NextFunction) => {
  const { roomId, status } = req.body;

  // Basic input validation
  if (!roomId || typeof roomId !== 'string') {
    return res.status(400).json({ message: 'Invalid room ID' });
  }

  if (!status || typeof status !== 'string') {
    return res.status(400).json({ message: 'Invalid room status' });
  }

  next();
};