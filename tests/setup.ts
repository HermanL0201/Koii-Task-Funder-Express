import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Use an in-memory mock for MongoDB connection
const mongod = {
  getUri: () => 'mongodb://localhost:27017/testdb',
  stop: async () => {}
};

const mongoUri = mongod.getUri();

// Configuration to use in-memory database
mongoose.set('strictQuery', false);

beforeAll(async () => {
  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongod.stop();
  } catch (error) {
    console.error('Teardown error:', error);
  }
});

export { mongod };