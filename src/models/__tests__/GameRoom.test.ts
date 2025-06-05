import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import GameRoom, { RoomStatus } from '../GameRoom';

describe('GameRoom Model', () => {
  beforeAll(async () => {
    // Use an in-memory MongoDB server for testing
    await mongoose.connect('mongodb://localhost:27017/gameroom_test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a valid game room', async () => {
    const gameRoomData = {
      name: 'Test Room',
      creator: {
        id: 'user123',
        username: 'testuser',
        isCreator: true
      },
      players: [{
        id: 'user123',
        username: 'testuser',
        isCreator: true
      }],
      maxPlayers: 5
    };

    const gameRoom = new GameRoom(gameRoomData);
    const savedGameRoom = await gameRoom.save();

    expect(savedGameRoom).toBeTruthy();
    expect(savedGameRoom.name).toBe('Test Room');
    expect(savedGameRoom.status).toBe(RoomStatus.WAITING);
    expect(savedGameRoom.roomId).toBeTruthy();
    expect(savedGameRoom.currentPlayerCount).toBe(1);
  });

  it('should not create a game room with invalid player count', async () => {
    const gameRoomData = {
      name: 'Invalid Room',
      creator: {
        id: 'user123',
        username: 'testuser',
        isCreator: true
      },
      players: Array(11).fill({
        id: 'user',
        username: 'player',
        isCreator: false
      }),
      maxPlayers: 10
    };

    const gameRoom = new GameRoom(gameRoomData);

    await expect(gameRoom.save()).rejects.toThrow();
  });

  it('should not create a game room with short name', async () => {
    const gameRoomData = {
      name: 'A',
      creator: {
        id: 'user123',
        username: 'testuser',
        isCreator: true
      },
      players: [{
        id: 'user123',
        username: 'testuser',
        isCreator: true
      }],
      maxPlayers: 5
    };

    const gameRoom = new GameRoom(gameRoomData);

    await expect(gameRoom.save()).rejects.toThrow();
  });
});