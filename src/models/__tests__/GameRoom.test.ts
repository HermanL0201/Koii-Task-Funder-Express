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

  it('should create a new game room', async () => {
    const gameRoomData = {
      creatorId: 'user123',
      status: 'pending'
    };

    const gameRoom = new GameRoom(gameRoomData);
    const savedGameRoom = await gameRoom.save();

    expect(savedGameRoom.creatorId).toBe(gameRoomData.creatorId);
    expect(savedGameRoom.status).toBe(gameRoomData.status);
  });

  it('should not allow invalid status', async () => {
    const gameRoomData = {
      creatorId: 'user456',
      status: 'invalid_status' as any
    };

    const gameRoom = new GameRoom(gameRoomData);

    await expect(gameRoom.save()).rejects.toThrow();
  });
});