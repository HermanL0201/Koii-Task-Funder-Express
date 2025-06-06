import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../src/utils/password';

describe('Password Utility Functions', () => {
  const validPassword = 'SecurePassword123!';

  it('should successfully hash a valid password', async () => {
    const hashedPassword = await hashPassword(validPassword);
    expect(hashedPassword).toBeTruthy();
    expect(hashedPassword).not.toBe(validPassword);
  });

  it('should generate different hashes for the same password', async () => {
    const hash1 = await hashPassword(validPassword);
    const hash2 = await hashPassword(validPassword);
    expect(hash1).not.toBe(hash2);
  });

  it('should successfully compare a valid password', async () => {
    const hashedPassword = await hashPassword(validPassword);
    const isMatch = await comparePassword(validPassword, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it('should fail to compare with incorrect password', async () => {
    const hashedPassword = await hashPassword(validPassword);
    const isMatch = await comparePassword('WrongPassword', hashedPassword);
    expect(isMatch).toBe(false);
  });

  it('should throw error for empty password during hashing', async () => {
    await expect(hashPassword('')).rejects.toThrow('Password cannot be empty');
  });

  it('should throw error for short password during hashing', async () => {
    await expect(hashPassword('short')).rejects.toThrow('Password must be at least 8 characters long');
  });

  it('should throw error for missing passwords during comparison', async () => {
    await expect(comparePassword('', '')).rejects.toThrow('Both plain and hashed passwords are required');
  });
});