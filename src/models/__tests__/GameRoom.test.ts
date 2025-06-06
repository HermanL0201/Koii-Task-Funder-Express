import { describe, it, expect, vi } from 'vitest';
import mongoose from 'mongoose';

// Store the original mongoose.model
const originalModel = mongoose.model;

// Spy on mongoose.model
const modelSpy = vi.fn(originalModel);
mongoose.model = modelSpy;

// Import GameRoom after mocking
import GameRoom from '../GameRoom';

describe('GameRoom Model', () => {
  it('should create a mongoose model', () => {
    expect(GameRoom).toBeDefined();
    expect(modelSpy).toHaveBeenCalledWith('GameRoom', expect.any(Object));
  });

  it('should have correct model methods', () => {
    expect(typeof GameRoom.create).toBe('function');
    expect(typeof GameRoom.findOne).toBe('function');
  });

  // Restore original model after tests
  afterAll(() => {
    mongoose.model = originalModel;
  });
});