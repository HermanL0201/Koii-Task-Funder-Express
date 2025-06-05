import { describe, it, expect } from 'vitest';
import { 
  RoomStatus, 
  validateRoomStatusTransition, 
  getValidNextStatuses 
} from '../../src/utils/roomStatusTransitions';

describe('Room Status Transitions', () => {
  describe('validateRoomStatusTransition', () => {
    it('should allow valid status transitions', () => {
      // Test valid transitions from CREATED
      expect(() => validateRoomStatusTransition(RoomStatus.CREATED, RoomStatus.WAITING)).not.toThrow();
      expect(() => validateRoomStatusTransition(RoomStatus.CREATED, RoomStatus.CANCELLED)).not.toThrow();

      // Test valid transitions from WAITING
      expect(() => validateRoomStatusTransition(RoomStatus.WAITING, RoomStatus.IN_PROGRESS)).not.toThrow();
      expect(() => validateRoomStatusTransition(RoomStatus.WAITING, RoomStatus.CANCELLED)).not.toThrow();

      // Test valid transitions from IN_PROGRESS
      expect(() => validateRoomStatusTransition(RoomStatus.IN_PROGRESS, RoomStatus.COMPLETED)).not.toThrow();
      expect(() => validateRoomStatusTransition(RoomStatus.IN_PROGRESS, RoomStatus.CANCELLED)).not.toThrow();
    });

    it('should throw error for invalid status transitions', () => {
      // Test invalid transitions
      expect(() => validateRoomStatusTransition(RoomStatus.CREATED, RoomStatus.IN_PROGRESS)).toThrow();
      expect(() => validateRoomStatusTransition(RoomStatus.COMPLETED, RoomStatus.WAITING)).toThrow();
      expect(() => validateRoomStatusTransition(RoomStatus.CANCELLED, RoomStatus.IN_PROGRESS)).toThrow();
    });
  });

  describe('getValidNextStatuses', () => {
    it('should return correct valid next statuses', () => {
      expect(getValidNextStatuses(RoomStatus.CREATED)).toEqual([RoomStatus.WAITING, RoomStatus.CANCELLED]);
      expect(getValidNextStatuses(RoomStatus.WAITING)).toEqual([RoomStatus.IN_PROGRESS, RoomStatus.CANCELLED]);
      expect(getValidNextStatuses(RoomStatus.IN_PROGRESS)).toEqual([RoomStatus.COMPLETED, RoomStatus.CANCELLED]);
      expect(getValidNextStatuses(RoomStatus.COMPLETED)).toEqual([]);
      expect(getValidNextStatuses(RoomStatus.CANCELLED)).toEqual([]);
    });
  });
});