import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email 
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
};