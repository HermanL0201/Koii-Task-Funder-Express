import mongoose from 'mongoose';

// Global setup for tests
beforeAll(async () => {
  // Suppress deprecation warnings
  mongoose.set('strictQuery', false);
});

afterAll(async () => {
  // Close mongoose connection after tests
  await mongoose.disconnect();
});