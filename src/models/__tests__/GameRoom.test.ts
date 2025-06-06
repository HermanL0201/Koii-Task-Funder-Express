import { describe, it, expect, vi } from 'vitest';
import mongoose from 'mongoose';

// Mock mongoose completely
vi.mock('mongoose', () => ({
  default: {
    Schema: vi.fn().mockImplementation((definition) => ({
      definition,
      virtual: vi.fn(),
      set: vi.fn()
    })),
    model: vi.fn().mockImplementation((name, schema) => {
      const modelInstance = {
        name,
        schema,
        create: vi.fn(),
        findOne: vi.fn()
      };
      return modelInstance;
    })
  }
}));

import GameRoom from '../GameRoom';

describe('GameRoom Model', () => {
  it('should create a mongoose model', () => {
    // Force the import to trigger model creation
    expect(GameRoom).toBeDefined();
    expect(mongoose.model).toHaveBeenCalled();
  });

  it('should have correct model methods', () => {
    const gameRoomModel = GameRoom;
    expect(typeof gameRoomModel.create).toBe('function');
    expect(typeof gameRoomModel.findOne).toBe('function');
  });
});