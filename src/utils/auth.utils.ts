import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.config';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

export const generateToken = (payload: object): string => {
  try {
    return jwt.sign(payload, jwtConfig.secret, { 
      expiresIn: jwtConfig.expiresIn 
    });
  } catch (error) {
    throw new Error('Error generating token');
  }
};

export const verifyToken = (token: string): object | null => {
  try {
    return jwt.verify(token, jwtConfig.secret) as object;
  } catch (error) {
    return null;
  }
};