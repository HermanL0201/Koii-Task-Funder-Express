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
    model: vi.fn().mockImplementation((name, schema) => ({
      name,
      schema,
      create: vi.fn(),
      findOne: vi.fn()
    }))
  }
}));

import GameRoom from '../GameRoom';

describe('GameRoom Model', () => {
  it('should create a mongoose model', () => {
    expect(GameRoom).toBeDefined();
    expect(mongoose.model).toHaveBeenCalled();
  });

  it('should have correct model methods', () => {
    expect(typeof GameRoom.create).toBe('function');
    expect(typeof GameRoom.findOne).toBe('function');
  });
});