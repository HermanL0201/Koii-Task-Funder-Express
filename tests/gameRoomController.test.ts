import { describe, it, expect, beforeEach, vi } from 'vitest';
import { joinGameRoom } from '../src/gameRoomController';
import GameRoom from '../src/models/GameRoom';
import mongoose from 'mongoose';

// Mock Express request and response
const mockRequest = (params = {}, body = {}) => ({
  params,
  body,
});

const mockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('joinGameRoom', () => {
  let validRoomId: string;
  let validPlayerId: string;

  beforeEach(() => {
    // Generate valid MongoDB ObjectIds
    validRoomId = new mongoose.Types.ObjectId().toString();
    validPlayerId = new mongoose.Types.ObjectId().toString();
  });

  it('should successfully join a game room', async () => {
    // Create a mock game room
    const mockGameRoom = new GameRoom({
      _id: validRoomId,
      name: 'Test Room',
      maxPlayers: 5,
      players: [],
      status: 'waiting'
    });

    // Mock GameRoom.findById to return the mock room
    vi.spyOn(GameRoom, 'findById').mockResolvedValue(mockGameRoom);

    const req = mockRequest({ roomId: validRoomId }, { playerId: validPlayerId });
    const res = mockResponse();

    await joinGameRoom(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Successfully joined the game room'
    }));
  });

  it('should return 404 if room does not exist', async () => {
    // Mock GameRoom.findById to return null
    vi.spyOn(GameRoom, 'findById').mockResolvedValue(null);

    const req = mockRequest({ roomId: validRoomId }, { playerId: validPlayerId });
    const res = mockResponse();

    await joinGameRoom(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Game room not found'
    }));
  });

  it('should return 400 if room is full', async () => {
    // Create a mock game room with max players
    const mockGameRoom = new GameRoom({
      _id: validRoomId,
      name: 'Full Room',
      maxPlayers: 2,
      players: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      status: 'waiting'
    });

    vi.spyOn(GameRoom, 'findById').mockResolvedValue(mockGameRoom);

    const req = mockRequest({ roomId: validRoomId }, { playerId: validPlayerId });
    const res = mockResponse();

    await joinGameRoom(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Game room is already full'
    }));
  });
});