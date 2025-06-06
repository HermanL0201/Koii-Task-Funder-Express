import { describe, it, expect, vi } from 'vitest';
import mongoose from 'mongoose';
import GameRoom from '../GameRoom';

// Mock mongoose connection
vi.mock('mongoose', () => ({
  default: {
    connect: vi.fn(),
    connection: {
      on: vi.fn(),
      once: vi.fn()
    },
    model: vi.fn()
  }
}));

describe('GameRoom Model', () => {
  it('should create a new game room', () => {
    const gameRoomData = {
      name: 'Test Game Room',
      maxPlayers: 4,
      currentPlayers: 0,
      status: 'waiting'
    };

    const gameRoom = new GameRoom(gameRoomData);

    expect(gameRoom).toBeDefined();
    expect(gameRoom.name).toBe('Test Game Room');
    expect(gameRoom.maxPlayers).toBe(4);
    expect(gameRoom.currentPlayers).toBe(0);
    expect(gameRoom.status).toBe('waiting');
  });

  it('should validate game room fields', () => {
    const invalidGameRoomData = {
      name: '',
      maxPlayers: -1,
      currentPlayers: 5,
      status: 'invalid-status'
    };

    const gameRoom = new GameRoom(invalidGameRoomData);

    // Add specific validation tests based on your schema
    expect(gameRoom.validateSync()).toBeTruthy();
  });

  it('should have correct model methods', () => {
    expect(typeof GameRoom.create).toBe('function');
    expect(typeof GameRoom.findOne).toBe('function');
  });
});