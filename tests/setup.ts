import mongoose from 'mongoose';

// Global setup for tests
beforeAll(async () => {
  // Suppress deprecation warnings
  mongoose.set('strictQuery', false);

  // Connect to a test database (in-memory MongoDB)
  await mongoose.connect('mongodb://localhost:27017/sephora_test_db');
});

afterAll(async () => {
  // Close mongoose connection after tests
  await mongoose.disconnect();
});