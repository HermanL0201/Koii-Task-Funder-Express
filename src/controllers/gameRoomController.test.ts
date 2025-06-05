import { describe, it, expect, vi } from 'vitest';
import { updateGameRoomStatus } from './gameRoomController';
import GameRoom from '../models/GameRoom';

// Mock mongoose and GameRoom
vi.mock('../models/GameRoom', () => ({
  default: {
    findOneAndUpdate: vi.fn()
  }
}));

describe('updateGameRoomStatus', () => {
  it('should update room status successfully', async () => {
    const mockRoom = { 
      _id: 'room123', 
      creatorId: 'user123', 
      status: 'in_progress' 
    };

    const mockFindOneAndUpdate = vi.mocked(GameRoom.findOneAndUpdate);
    mockFindOneAndUpdate.mockResolvedValue(mockRoom);

    const mockReq: any = {
      params: { roomId: 'room123' },
      body: { status: 'in_progress' },
      user: { id: 'user123' }
    };

    const mockRes: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    const mockNext = vi.fn();

    await updateGameRoomStatus(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Room status updated successfully',
      room: expect.objectContaining({ status: 'in_progress' })
    });
  });

  it('should return 400 for invalid status', async () => {
    const mockReq: any = {
      params: { roomId: 'room123' },
      body: { status: 'invalid_status' },
      user: { id: 'user123' }
    };

    const mockRes: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    const mockNext = vi.fn();

    await updateGameRoomStatus(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid room status'
      })
    );
  });
});