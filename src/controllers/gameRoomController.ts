import { Request, Response, NextFunction } from 'express';
import GameRoom from '../models/GameRoom';
import { validateGameRoomStatus } from '../utils/validationUtils';

/**
 * Update game room status
 * @param req Express request object
 * @param res Express response object
 * @param next Express next middleware function
 */
export const updateGameRoomStatus = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { roomId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id; // Assuming authMiddleware adds user to request

    // Validate status input
    if (!validateGameRoomStatus(status)) {
      return res.status(400).json({
        message: 'Invalid room status',
        allowedStatuses: ['pending', 'in_progress', 'completed', 'cancelled']
      });
    }

    // Find and update the room
    const updatedRoom = await GameRoom.findOneAndUpdate(
      { 
        _id: roomId, 
        creatorId: userId // Ensure only room creator can update status 
      }, 
      { status }, 
      { new: true, runValidators: true }
    );

    // Check if room was found and updated
    if (!updatedRoom) {
      return res.status(404).json({
        message: 'Room not found or unauthorized to update status'
      });
    }

    // Return updated room
    res.status(200).json({
      message: 'Room status updated successfully',
      room: updatedRoom
    });
  } catch (error) {
    next(error);
  }
};