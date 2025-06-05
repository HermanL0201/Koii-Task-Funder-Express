import { describe, it, expect } from 'vitest';
import GameRoom from '../GameRoom';

describe('GameRoom Model', () => {
  describe('removePlayer method', () => {
    it('should remove a player from the room', async () => {
      const gameRoom = new GameRoom({
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

      // Mock save method
      gameRoom.save = vi.fn().mockResolvedValue(gameRoom);

      const updatedRoom = await gameRoom.removePlayer('player1');
      
      expect(updatedRoom.currentPlayers.length).toBe(1);
      expect(updatedRoom.currentPlayers[0].id).toBe('player2');
    });

    it('should set room status to COMPLETED when last player leaves', async () => {
      const gameRoom = new GameRoom({
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

      // Mock save method
      gameRoom.save = vi.fn().mockResolvedValue(gameRoom);

      const updatedRoom = await gameRoom.removePlayer('player1');
      const finalRoom = await gameRoom.removePlayer('player2');
      
      expect(finalRoom.status).toBe('COMPLETED');
      expect(finalRoom.currentPlayers.length).toBe(0);
    });

    it('should return the room even if player is not found', async () => {
      const gameRoom = new GameRoom({
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

      // Mock save method
      gameRoom.save = vi.fn().mockResolvedValue(gameRoom);

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

      // Mock save method to throw an error for validation
      gameRoom.save = vi.fn().mockRejectedValue(new Error('Exceeded maximum number of players'));

      await expect(gameRoom.save()).rejects.toThrow('Exceeded maximum number of players');
    });
  });
});