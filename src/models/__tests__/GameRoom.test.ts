import { describe, it, expect, vi } from 'vitest';

// Mock mongoose before importing GameRoom
vi.mock('mongoose', () => ({
  default: {
    Schema: vi.fn().mockImplementation((definition) => ({
      definition,
      virtual: vi.fn(),
      set: vi.fn()
    })),
    model: vi.fn().mockReturnValue({
      create: vi.fn(),
      findOne: vi.fn()
    })
  }
}));

// Import GameRoom after mocking
import GameRoom from '../GameRoom';
import mongoose from 'mongoose';

describe('GameRoom Model', () => {
  it('should create a mongoose model', () => {
    expect(GameRoom).toBeDefined();
    expect(mongoose.model).toHaveBeenCalledWith('GameRoom', expect.any(Object));
  });

  it('should have correct model methods', () => {
    expect(typeof GameRoom.create).toBe('function');
    expect(typeof GameRoom.findOne).toBe('function');
  });
});