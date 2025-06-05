/**
 * Validate game room status
 * @param status Status to validate
 * @returns Boolean indicating if status is valid
 */
export const validateGameRoomStatus = (status: string): boolean => {
  const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
  return validStatuses.includes(status);
};