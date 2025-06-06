import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  }
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);

// Mock functions for testing
export const mockUserModel = {
  create: vi.fn(),
  findOne: vi.fn(),
  deleteMany: vi.fn(),
};