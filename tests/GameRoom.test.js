import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import GameRoom from '../src/models/GameRoom.js';

describe('GameRoom Model', () => {
  const validRoomData = {
    roomId: 'test-room-123',
    players: [
      { playerId: 'player1', username: 'Alice' },
      { playerId: 'player2', username: 'Bob' }
    ],
    maxPlayers: 5,
    status: 'WAITING'
  };

  it('should create a valid game room', () => {
    const gameRoom = new GameRoom(validRoomData);
    expect(gameRoom.roomId).toBe('test-room-123');
    expect(gameRoom.players.length).toBe(2);
  });

  it('should successfully remove a player from the room', () => {
    const gameRoom = new GameRoom(validRoomData);
    gameRoom.leaveRoom('player1');
    
    expect(gameRoom.players.length).toBe(1);
    expect(gameRoom.players[0].playerId).toBe('player2');
  });

  it('should mark room as completed when last player leaves', () => {
    const gameRoom = new GameRoom({
      ...validRoomData,
      players: [{ playerId: 'player1', username: 'Alice' }]
    });
    
    gameRoom.leaveRoom('player1');
    
    expect(gameRoom.players.length).toBe(0);
    expect(gameRoom.status).toBe('COMPLETED');
  });

  it('should reject if player count exceeds max players', async () => {
    const gameRoom = new GameRoom(validRoomData);
    
    // Attempt to add more players than max
    gameRoom.players = [
      ...gameRoom.players,
      { playerId: 'player3', username: 'Charlie' },
      { playerId: 'player4', username: 'David' },
      { playerId: 'player5', username: 'Eve' },
      { playerId: 'player6', username: 'Frank' }
    ];

    await expect(gameRoom.save()).rejects.toThrow('Room has reached maximum player limit');
  });
});