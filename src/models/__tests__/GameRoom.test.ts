import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import GameRoom from '../GameRoom';

describe('GameRoom Model', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    await GameRoom.deleteMany({});
  });

  describe('Player Management', () => {
    it('should add a player to the room', async () => {
      const gameRoom = new GameRoom({
        creatorId: 'user1',
        maxPlayers: 4
      });

      gameRoom.addPlayer({ id: 'player1', username: 'John' });
      await gameRoom.save();

      expect(gameRoom.players.length).toBe(1);
      expect(gameRoom.players[0].id).toBe('player1');
    });

    it('should prevent adding more players than maxPlayers', async () => {
      const gameRoom = new GameRoom({
        creatorId: 'user1',
        maxPlayers: 2
      });

      gameRoom.addPlayer({ id: 'player1', username: 'John' });
      gameRoom.addPlayer({ id: 'player2', username: 'Jane' });

      expect(() => {
        gameRoom.addPlayer({ id: 'player3', username: 'Bob' });
      }).toThrow('Room is full');
    });
  });

  describe('removePlayer method', () => {
    it('should remove a player from the room', async () => {
      const gameRoom = new GameRoom({
        creatorId: 'user1',
        players: [
          { id: 'player1', username: 'John' },
          { id: 'player2', username: 'Jane' }
        ]
      });

      gameRoom.removePlayer('player1');

      expect(gameRoom.players.length).toBe(1);
      expect(gameRoom.players[0].id).toBe('player2');
    });

    it('should set room status to COMPLETED when last player leaves', async () => {
      const gameRoom = new GameRoom({
        creatorId: 'user1',
        players: [
          { id: 'player1', username: 'John' }
        ]
      });

      gameRoom.removePlayer('player1');

      expect(gameRoom.players.length).toBe(0);
      expect(gameRoom.status).toBe('completed');
    });

    it('should return the room even if player is not found', async () => {
      const gameRoom = new GameRoom({
        creatorId: 'user1',
        players: [
          { id: 'player1', username: 'John' }
        ]
      });

      const updatedRoom = gameRoom.removePlayer('nonexistent_player');

      expect(updatedRoom.players.length).toBe(1);
    });
  });
});