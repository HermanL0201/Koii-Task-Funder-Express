import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import GameRoom, { RoomStatus } from '../GameRoom';

describe('GameRoom Model', () => {
  // Setup an in-memory MongoDB for testing
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    await GameRoom.deleteMany({});
  });

  // Test leaving a room with multiple players
  it('should successfully remove a player from the room', async () => {
    const gameRoom = new GameRoom({
      roomId: 'test-room-1',
      name: 'Test Room',
      creator: { id: 'creator1', username: 'CreatorUser' },
      players: [
        { id: 'creator1', username: 'CreatorUser' },
        { id: 'player2', username: 'Player2' },
        { id: 'player3', username: 'Player3' }
      ],
      maxPlayers: 5,
      status: RoomStatus.WAITING
    });

    await gameRoom.save();

    const updatedRoom = await gameRoom.leaveRoom('player2');

    expect(updatedRoom.players.length).toBe(2);
    expect(updatedRoom.players.some(p => p.id === 'player2')).toBe(false);
    expect(updatedRoom.status).toBe(RoomStatus.WAITING);
  });

  // Test creator leaving the room
  it('should transfer creator status when creator leaves', async () => {
    const gameRoom = new GameRoom({
      roomId: 'test-room-2',
      name: 'Test Room',
      creator: { id: 'creator1', username: 'CreatorUser' },
      players: [
        { id: 'creator1', username: 'CreatorUser' },
        { id: 'player2', username: 'Player2' },
        { id: 'player3', username: 'Player3' }
      ],
      maxPlayers: 5,
      status: RoomStatus.WAITING
    });

    await gameRoom.save();

    const updatedRoom = await gameRoom.leaveRoom('creator1');

    expect(updatedRoom.creator.id).toBe('player2');
    expect(updatedRoom.players.length).toBe(2);
    expect(updatedRoom.status).toBe(RoomStatus.WAITING);
  });

  // Test room closing when last player leaves
  it('should close the room when the last player leaves', async () => {
    const gameRoom = new GameRoom({
      roomId: 'test-room-3',
      name: 'Test Room',
      creator: { id: 'creator1', username: 'CreatorUser' },
      players: [{ id: 'creator1', username: 'CreatorUser' }],
      maxPlayers: 5,
      status: RoomStatus.WAITING
    });

    await gameRoom.save();

    const updatedRoom = await gameRoom.leaveRoom('creator1');

    expect(updatedRoom.players.length).toBe(0);
    expect(updatedRoom.status).toBe(RoomStatus.CLOSED);
  });

  // Test error when trying to leave a room the player is not in
  it('should throw an error when trying to remove a non-existent player', async () => {
    const gameRoom = new GameRoom({
      roomId: 'test-room-4',
      name: 'Test Room',
      creator: { id: 'creator1', username: 'CreatorUser' },
      players: [{ id: 'creator1', username: 'CreatorUser' }],
      maxPlayers: 5,
      status: RoomStatus.WAITING
    });

    await gameRoom.save();

    await expect(gameRoom.leaveRoom('non-existent-player'))
      .rejects
      .toThrow('Player not found in this room');
  });
});