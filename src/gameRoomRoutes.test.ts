import { describe, it, expect, beforeEach, vi } from 'vitest';
import { joinGameRoom } from './gameRoomRoutes';
import GameRoom from './models/GameRoom';
import mongoose from 'mongoose';

// Mock Express request and response
const mockRequest = (params = {}, body = {}) => ({
  params,
  body
});

const mockResponse = () => {
  const res = {} as any;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('joinGameRoom', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully join a game room', async () => {
    const roomId = new mongoose.Types.ObjectId().toString();
    const playerId = 'player1';

    const mockGameRoom = {
      _id: roomId,
      name: 'Test Room',
      players: [],
      maxPlayers: 4,
      status: 'open',
      save: vi.fn()
    };

    vi.spyOn(GameRoom, 'findById').mockResolvedValue(mockGameRoom as any);

    const req = mockRequest({ roomId }, { playerId });
    const res = mockResponse();

    await joinGameRoom(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: 'Successfully joined game room'
    }));
  });

  it('should reject joining a full room', async () => {
    const roomId = new mongoose.Types.ObjectId().toString();
    const playerId = 'player1';

    const mockGameRoom = {
      _id: roomId,
      name: 'Test Room',
      players: [
        { id: 'player2' }, { id: 'player3' }, 
        { id: 'player4' }, { id: 'player5' }
      ],
      maxPlayers: 4,
      status: 'open',
      save: vi.fn()
    };

    vi.spyOn(GameRoom, 'findById').mockResolvedValue(mockGameRoom as any);

    const req = mockRequest({ roomId }, { playerId });
    const res = mockResponse();

    await joinGameRoom(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Game room is full'
    }));
  });

  it('should reject joining a non-existent room', async () => {
    const roomId = new mongoose.Types.ObjectId().toString();
    const playerId = 'player1';

    vi.spyOn(GameRoom, 'findById').mockResolvedValue(null);

    const req = mockRequest({ roomId }, { playerId });
    const res = mockResponse();

    await joinGameRoom(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Game room not found'
    }));
  });
});