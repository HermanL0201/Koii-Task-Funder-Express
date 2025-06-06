// Optional global test setup
import { vi } from 'vitest';

// Example of global mocking or setup
vi.mock('../models/User', () => ({
  UserModel: {
    create: vi.fn(),
    deleteMany: vi.fn(),
    findOne: vi.fn(),
  }
}));