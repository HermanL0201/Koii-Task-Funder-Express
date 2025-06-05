import { describe, it, expect, vi } from 'vitest';
import { verifyRoomCreator } from '../../src/middleware/roomCreatorAuth';
import { GameRoom } from '../../src/models/GameRoom'; // Mocking this model

// Mock Express objects
const createMockRequest = (user: any, params: any, body: any) => ({
  user,
  params,
  body
});

const createMockResponse = () => {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  };
  return res;
};

const createMockNext = vi.fn();

describe('Room Creator Authentication Middleware', () => {
  it('should return 401 if no user is authenticated', async () => {
    const req: any = createMockRequest(null, { roomId: 'room123' }, {});
    const res: any = createMockResponse();
    const next = createMockNext;

    await verifyRoomCreator(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
  });

  it('should return 400 if no room ID is provided', async () => {
    const req: any = createMockRequest({ id: 'user123' }, {}, {});
    const res: any = createMockResponse();
    const next = createMockNext;

    await verifyRoomCreator(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Room ID is required' });
  });

  it('should return 404 if room is not found', async () => {
    vi.spyOn(GameRoom, 'findById').mockResolvedValue(null);

    const req: any = createMockRequest(
      { id: 'user123' }, 
      { roomId: 'room123' }, 
      {}
    );
    const res: any = createMockResponse();
    const next = createMockNext;

    await verifyRoomCreator(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Room not found' });
  });

  it('should return 403 if user is not the room creator', async () => {
    const mockRoom = {
      _id: 'room123',
      creatorId: 'creator456'
    };

    vi.spyOn(GameRoom, 'findById').mockResolvedValue(mockRoom as any);

    const req: any = createMockRequest(
      { id: 'user123' }, 
      { roomId: 'room123' }, 
      {}
    );
    const res: any = createMockResponse();
    const next = createMockNext;

    await verifyRoomCreator(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Only room creator can perform this action' 
    });
  });

  it('should call next if user is the room creator', async () => {
    const mockRoom = {
      _id: 'room123',
      creatorId: 'user123'
    };

    vi.spyOn(GameRoom, 'findById').mockResolvedValue(mockRoom as any);

    const req: any = createMockRequest(
      { id: 'user123' }, 
      { roomId: 'room123' }, 
      {}
    );
    const res: any = createMockResponse();
    const next = createMockNext;

    await verifyRoomCreator(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});