// Enum of possible room statuses
export enum RoomStatus {
  CREATED = 'CREATED',
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Valid status transition matrix
const VALID_STATUS_TRANSITIONS: Record<RoomStatus, RoomStatus[]> = {
  [RoomStatus.CREATED]: [RoomStatus.WAITING, RoomStatus.CANCELLED],
  [RoomStatus.WAITING]: [RoomStatus.IN_PROGRESS, RoomStatus.CANCELLED],
  [RoomStatus.IN_PROGRESS]: [RoomStatus.COMPLETED, RoomStatus.CANCELLED],
  [RoomStatus.COMPLETED]: [],
  [RoomStatus.CANCELLED]: []
};

/**
 * Validates room status transition
 * @param currentStatus Current room status
 * @param newStatus Proposed new room status
 * @returns Boolean indicating if transition is valid
 * @throws Error if transition is invalid
 */
export function validateRoomStatusTransition(
  currentStatus: RoomStatus, 
  newStatus: RoomStatus
): boolean {
  // Check if the transition is invalid
  if (!VALID_STATUS_TRANSITIONS[currentStatus].includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
  }

  // Additional specific transition rules can be added here
  return true;
}

/**
 * Get valid next statuses for a given current status
 * @param currentStatus Current room status
 * @returns Array of valid next statuses
 */
export function getValidNextStatuses(currentStatus: RoomStatus): RoomStatus[] {
  return VALID_STATUS_TRANSITIONS[currentStatus] || [];
}