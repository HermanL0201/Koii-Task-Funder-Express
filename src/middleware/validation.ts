import mongoose from 'mongoose';

/**
 * Validate room join parameters
 * @param roomId Room identifier
 * @param playerId Player identifier
 * @returns Error message or null
 */
export const validateRoomJoin = async (roomId: string, playerId: string): Promise<string | null> => {
  // Check roomId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return 'Invalid room ID';
  }

  // Check playerId is provided and not empty
  if (!playerId || playerId.trim() === '') {
    return 'Player ID is required';
  }

  return null;
};