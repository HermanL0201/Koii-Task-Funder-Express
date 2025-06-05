import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import GameRoom, { GameRoomDocument } from '../GameRoom';

describe('GameRoom Model', () => {
  let gameRoom: GameRoomDocument;

  beforeEach(async () => {
    // Use an in-memory MongoDB for testing
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    // Create a sample game room with players
    gameRoom = new GameRoom({
      name: 'Test Room',
      creatorId: 'creator1',
      maxPlayers: 4,
      currentPlayers: [
        { id: 'player1', username: 'John' },
        { id: 'player2', username: 'Jane' }
      ],
      status: 'WAITING'
    });

    await gameRoom.save();
  });

  afterEach(async () => {
    // Clear the database after each test
    await GameRoom.deleteMany({});
    await mongoose.connection.close();
  });

  it('should successfully leave room when player exists', async () => {
    const updatedRoom = await gameRoom.leaveRoom('player1');
    
    expect(updatedRoom.currentPlayers.length).toBe(1);
    expect(updatedRoom.currentPlayers[0].id).toBe('player2');
    expect(updatedRoom.status).toBe('WAITING');
  });

  it('should mark room as completed when last player leaves', async () => {
    const updatedRoom = await gameRoom.leaveRoom('player1');
    const finalRoom = await updatedRoom.leaveRoom('player2');
    
    expect(finalRoom.currentPlayers.length).toBe(0);
    expect(finalRoom.status).toBe('COMPLETED');
  });

  it('should throw error when leaving with non-existent player', async () => {
    await expect(gameRoom.leaveRoom('nonexistent')).rejects.toThrow('Player not found in the room');
  });

  it('should validate room creation constraints', async () => {
    const invalidRoom = new GameRoom({
      name: 'A', // Too short
      creatorId: 'creator1',
      maxPlayers: 15, // Too high
      currentPlayers: []
    });

    await expect(invalidRoom.validate()).rejects.toThrow();
  });
});