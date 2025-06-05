import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import GameRoom, { RoomStatus } from '../gameRoom';

describe('GameRoom Model', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Create a new in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Disconnect and stop the in-memory server
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create a valid game room', async () => {
    const gameRoomData = {
      name: 'Test Room',
      creator: 'user123',
      maxPlayers: 5,
      gameType: 'chess',
      currentPlayers: [{
        username: 'player1',
        userId: 'user456'
      }]
    };

    const gameRoom = new GameRoom(gameRoomData);
    const savedGameRoom = await gameRoom.save();

    expect(savedGameRoom.name).toBe(gameRoomData.name);
    expect(savedGameRoom.roomId).toBeDefined();
    expect(savedGameRoom.status).toBe(RoomStatus.WAITING);
    expect(savedGameRoom.currentPlayers[0].username).toBe('player1');
  });

  it('should fail to create a game room with invalid data', async () => {
    const invalidGameRoomData = {
      name: 'a', // Too short
      creator: '',
      maxPlayers: 15, // Exceeds max limit
      gameType: ''
    };

    const gameRoom = new GameRoom(invalidGameRoomData);

    await expect(gameRoom.save()).rejects.toThrow();
  });

  it('should prevent exceeding max players', async () => {
    const gameRoomData = {
      name: 'Overflow Room',
      creator: 'user123',
      maxPlayers: 2,
      gameType: 'chess',
      currentPlayers: [
        { username: 'player1', userId: 'user1' },
        { username: 'player2', userId: 'user2' },
        { username: 'player3', userId: 'user3' }
      ]
    };

    const gameRoom = new GameRoom(gameRoomData);

    await expect(gameRoom.save()).rejects.toThrow();
  });
});