import { describe, it, expect } from 'vitest';
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  verifyToken 
} from '../auth.utils';

describe('Authentication Utilities', () => {
  const testPassword = 'testPassword123!';

  it('should hash a password', async () => {
    const hashedPassword = await hashPassword(testPassword);
    expect(hashedPassword).not.toBe(testPassword);
    expect(hashedPassword.length).toBeGreaterThan(0);
  });

  it('should compare passwords correctly', async () => {
    const hashedPassword = await hashPassword(testPassword);
    const isMatch = await comparePassword(testPassword, hashedPassword);
    const isNotMatch = await comparePassword('wrongPassword', hashedPassword);
    
    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  it('should generate and verify JWT token', () => {
    const payload = { userId: '123', role: 'user' };
    const token = generateToken(payload);
    
    expect(token).toBeTruthy();
    
    const verifiedPayload = verifyToken(token);
    expect(verifiedPayload).toBeTruthy();
    expect(verifiedPayload).toMatchObject(payload);
  });

  it('should return null for invalid token', () => {
    const invalidToken = 'invalid.token.here';
    const verifiedPayload = verifyToken(invalidToken);
    
    expect(verifiedPayload).toBeNull();
  });
});