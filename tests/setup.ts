// Mock mongoose for testing
const mongoose = {
  set: jest.fn(),
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    dropDatabase: jest.fn().mockResolvedValue(true)
  },
  disconnect: jest.fn().mockResolvedValue(true)
};

export default mongoose;

beforeAll(async () => {
  // Setup mock database connection
  await mongoose.connect('mongodb://localhost:27017/testdb');
});

afterAll(async () => {
  // Cleanup mock database
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});