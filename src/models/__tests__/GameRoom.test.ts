import { describe, it, expect, vi } from 'vitest';
import mongoose from 'mongoose';

// Spy on mongoose.model before import
const modelSpy = vi.fn();
vi.mock('mongoose', () => ({
  default: {
    Schema: vi.fn().mockImplementation((definition) => ({
      definition,
      virtual: vi.fn(),
      set: vi.fn()
    })),
    model: modelSpy
  }
}));

// Import after mocking
import GameRoom from '../GameRoom';

describe('GameRoom Model', () => {
  it('should create a mongoose model', () => {
    expect(GameRoom).toBeDefined();
    expect(modelSpy).toHaveBeenCalledWith('GameRoom', expect.any(Object));
  });

  it('should have correct model methods', () => {
    const gameRoomModel = GameRoom;
    expect(typeof gameRoomModel.create).toBe('function');
    expect(typeof gameRoomModel.findOne).toBe('function');
  });
});