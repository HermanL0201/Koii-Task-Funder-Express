import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { GameRoom } from '../src/models/GameRoom';

describe('Game Room Join Route', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Start a MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Disconnect and stop the server
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear database before each test
    await GameRoom.deleteMany({});
  });

  it('should successfully join an open game room', async () => {
    // Create a test game room
    const gameRoom = new GameRoom({
      roomId: 'test-room-1',
      name: 'Test Room',
      players: [],
      maxPlayers: 4,
      status: 'open',
      createdBy: 'test-user'
    });
    await gameRoom.save();

    // Attempt to join the room
    const result = gameRoom.addPlayer({
      id: 'player-1',
      username: 'TestPlayer'
    });

    expect(result).toBe(true);
    expect(gameRoom.players).toHaveLength(1);
    expect(gameRoom.players[0].id).toBe('player-1');
    expect(gameRoom.players[0].username).toBe('TestPlayer');
  });

  it('should not join a full game room', async () => {
    // Create a game room with max players
    const gameRoom = new GameRoom({
      roomId: 'test-room-2',
      name: 'Full Room',
      players: [
        { id: 'player-1', username: 'Player1' },
        { id: 'player-2', username: 'Player2' },
        { id: 'player-3', username: 'Player3' },
        { id: 'player-4', username: 'Player4' }
      ],
      maxPlayers: 4,
      status: 'open',
      createdBy: 'test-user'
    });

    // Attempt to add another player
    const result = gameRoom.addPlayer({
      id: 'player-5',
      username: 'TestPlayer'
    });

    expect(result).toBe(false);
    expect(gameRoom.players).toHaveLength(4);
  });

  it('should not join a closed game room', async () => {
    // Create a closed game room
    const gameRoom = new GameRoom({
      roomId: 'test-room-3',
      name: 'Closed Room',
      players: [],
      maxPlayers: 4,
      status: 'closed',
      createdBy: 'test-user'
    });

    // Attempt to add a player
    const result = gameRoom.addPlayer({
      id: 'player-1',
      username: 'TestPlayer'
    });

    expect(result).toBe(false);
    expect(gameRoom.players).toHaveLength(0);
  });
});