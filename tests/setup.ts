import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test_db');
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});