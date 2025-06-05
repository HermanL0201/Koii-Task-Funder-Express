import { describe, it, expect, beforeEach } from 'vitest';
import { GameRoom } from '@/models/GameRoom';
import { joinGameRoom } from '@/routes/gameRoomRoutes';
import mongoose from 'mongoose';

describe('Game Room Routes', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = {
      params: { roomId: 'test-room-1' },
      body: { 
        playerId: 'player1', 
        username: 'TestPlayer' 
      }
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  it('should successfully join a game room', async () => {
    // Create a test game room
    const gameRoom = new GameRoom({
      roomId: 'test-room-1',
      name: 'Test Room',
      creatorId: 'creator1',
      players: [],
      maxPlayers: 4
    });
    await gameRoom.save();

    await joinGameRoom(mockReq as any, mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    const updatedRoom = await GameRoom.findOne({ roomId: 'test-room-1' });
    expect(updatedRoom?.players).toHaveLength(1);
    expect(updatedRoom?.players[0]).toEqual(
      expect.objectContaining({
        id: 'player1',
        username: 'TestPlayer'
      })
    );
  });

  it('should reject joining a non-existent room', async () => {
    await joinGameRoom(mockReq as any, mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ 
      message: 'Game room not found' 
    });
  });

  it('should reject joining a full room', async () => {
    // Create a full game room
    const gameRoom = new GameRoom({
      roomId: 'test-room-1',
      name: 'Test Room',
      creatorId: 'creator1',
      players: [
        { id: 'p1', username: 'Player1' },
        { id: 'p2', username: 'Player2' },
        { id: 'p3', username: 'Player3' },
        { id: 'p4', username: 'Player4' }
      ],
      maxPlayers: 4
    });
    await gameRoom.save();

    await joinGameRoom(mockReq as any, mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ 
      message: 'Game room is full' 
    });
  });

  it('should reject joining a room with missing parameters', async () => {
    mockReq.body = {};

    await joinGameRoom(mockReq as any, mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ 
      message: 'Room ID, Player ID, and Username are required' 
    });
  });
});