import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app'; // Adjust path as needed
import GameRoom from '../src/models/GameRoom'; // Adjust path as needed
import { GameRoomStatus } from '../src/types/GameRoomStatus'; // Adjust path as needed

describe('Game Room Status Update Endpoint', () => {
  let createdRoomId: string;

  // Setup: Create a game room before each test
  beforeEach(async () => {
    // Clear existing rooms
    await GameRoom.deleteMany({});

    // Create a test game room
    const newRoom = new GameRoom({
      name: 'Test Room',
      maxPlayers: 4,
      creator: new mongoose.Types.ObjectId(),
      status: GameRoomStatus.WAITING,
      players: []
    });
    const savedRoom = await newRoom.save();
    createdRoomId = savedRoom._id.toString();
  });

  it('should successfully update room status', async () => {
    const response = await request(app)
      .patch(`/api/game-rooms/${createdRoomId}/status`)
      .send({ 
        status: GameRoomStatus.IN_PROGRESS,
        updatedBy: 'creator_id' // Simulate creator ID
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(GameRoomStatus.IN_PROGRESS);
  });

  it('should return 404 for non-existent room', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .patch(`/api/game-rooms/${fakeId}/status`)
      .send({ 
        status: GameRoomStatus.IN_PROGRESS,
        updatedBy: 'creator_id'
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Room not found');
  });

  it('should prevent invalid status transitions', async () => {
    const response = await request(app)
      .patch(`/api/game-rooms/${createdRoomId}/status`)
      .send({ 
        status: 'INVALID_STATUS',
        updatedBy: 'creator_id'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid status');
  });

  it('should require authorization to update status', async () => {
    const response = await request(app)
      .patch(`/api/game-rooms/${createdRoomId}/status`)
      .send({ 
        status: GameRoomStatus.IN_PROGRESS,
        updatedBy: 'unauthorized_user_id'
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toContain('Not authorized');
  });
});