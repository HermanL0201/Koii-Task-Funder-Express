import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import GameRoom from '../src/models/GameRoom';
import { GameRoomStatus } from '../src/types/GameRoomStatus';

// Mock mongoose and database operations
vi.mock('mongoose', () => ({
  default: {
    connect: vi.fn(),
    Types: {
      ObjectId: class {
        constructor(id?: string) {
          return id || new String('mockObjectId');
        }
        toString() {
          return 'mockObjectId';
        }
      }
    }
  }
}));

// Stub GameRoom methods
vi.mock('../src/models/GameRoom', () => ({
  default: {
    findById: vi.fn(),
    deleteMany: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    prototype: {
      save: vi.fn()
    }
  }
}));

describe('Game Room Status Update Endpoint', () => {
  const mockRoomId = 'room123';
  const mockCreatorId = 'creator123';

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock implementation for findById
    (GameRoom.findById as any).mockResolvedValue({
      _id: mockRoomId,
      name: 'Test Room',
      creator: mockCreatorId,
      status: GameRoomStatus.WAITING,
      save: vi.fn().mockResolvedValue(true)
    });

    // Setup mock implementation for findByIdAndUpdate
    (GameRoom.findByIdAndUpdate as any).mockResolvedValue({
      _id: mockRoomId,
      status: GameRoomStatus.IN_PROGRESS
    });
  });

  it('should successfully update room status', async () => {
    const response = await request(app)
      .patch(`/api/game-rooms/${mockRoomId}/status`)
      .send({ 
        status: GameRoomStatus.IN_PROGRESS,
        updatedBy: mockCreatorId
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(GameRoomStatus.IN_PROGRESS);
  });

  it('should return 404 for non-existent room', async () => {
    // Mock findById to return null for non-existent room
    (GameRoom.findById as any).mockResolvedValue(null);

    const nonExistentRoomId = 'nonexistent123';
    const response = await request(app)
      .patch(`/api/game-rooms/${nonExistentRoomId}/status`)
      .send({ 
        status: GameRoomStatus.IN_PROGRESS,
        updatedBy: mockCreatorId
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Room not found');
  });

  it('should prevent invalid status transitions', async () => {
    const response = await request(app)
      .patch(`/api/game-rooms/${mockRoomId}/status`)
      .send({ 
        status: 'INVALID_STATUS',
        updatedBy: mockCreatorId
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid status');
  });

  it('should require authorization to update status', async () => {
    const response = await request(app)
      .patch(`/api/game-rooms/${mockRoomId}/status`)
      .send({ 
        status: GameRoomStatus.IN_PROGRESS,
        updatedBy: 'unauthorized_user_id'
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toContain('Not authorized');
  });
});