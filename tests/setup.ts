import mongoose from 'mongoose';

// Set up connection to a test database before running tests
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/sephora_test_db');
});

// Close database connection after tests complete
afterAll(async () => {
  await mongoose.connection.close();
});