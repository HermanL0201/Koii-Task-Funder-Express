import { afterEach } from 'vitest';
import mongoose from 'mongoose';

afterEach(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});