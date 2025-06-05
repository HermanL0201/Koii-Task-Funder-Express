import mongoose from 'mongoose';
import GameRoom, { GameRoomDocument } from '../GameRoom';

describe('GameRoom Model', () => {
  beforeEach(async () => {
    // Create an in-memory Mongoose connection
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      serverSelectionTimeoutMS: 5000
    });
  });

  afterEach(async () => {
    // Disconnect from the in-memory database
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  describe('removePlayer method', () => {
    let gameRoom: GameRoomDocument;

    beforeEach(async () => {
      gameRoom = new GameRoom({
        roomId: 'test-room-1',
        name: 'Test Room',
        maxPlayers: 4,
        currentPlayers: [
          { id: 'player1', username: 'Alice' },
          { id: 'player2', username: 'Bob' }
        ],
        status: 'IN_PROGRESS',
        createdBy: 'player1'
      });
      await gameRoom.save();
    });

    it('should remove a player from the room', async () => {
      const updatedRoom = await gameRoom.removePlayer('player1');
      
      expect(updatedRoom.currentPlayers.length).toBe(1);
      expect(updatedRoom.currentPlayers[0].id).toBe('player2');
    });

    it('should set room status to COMPLETED when last player leaves', async () => {
      const updatedRoom = await gameRoom.removePlayer('player1');
      const finalRoom = await updatedRoom.removePlayer('player2');
      
      expect(finalRoom.status).toBe('COMPLETED');
      expect(finalRoom.currentPlayers.length).toBe(0);
    });

    it('should return the room even if player is not found', async () => {
      const updatedRoom = await gameRoom.removePlayer('non-existent-player');
      
      expect(updatedRoom.currentPlayers.length).toBe(2);
    });
  });

  describe('Player count validation', () => {
    it('should prevent adding more players than maxPlayers', async () => {
      const gameRoom = new GameRoom({
        roomId: 'test-room-2',
        name: 'Full Room',
        maxPlayers: 2,
        currentPlayers: [
          { id: 'player1', username: 'Alice' },
          { id: 'player2', username: 'Bob' },
          { id: 'player3', username: 'Charlie' }
        ],
        status: 'WAITING',
        createdBy: 'player1'
      });

      await expect(gameRoom.save()).rejects.toThrow('Exceeded maximum number of players');
    });
  });
});