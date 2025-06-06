import bcrypt from 'bcrypt';

/**
 * Number of salt rounds for password hashing
 * Higher rounds increase security but also increase hashing time
 */
const SALT_ROUNDS = 12;

/**
 * Hash a plain text password
 * @param password Plain text password to hash
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  // Input validation
  if (!password) {
    throw new Error('Password cannot be empty');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    throw new Error('Password hashing failed');
  }
}

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword Plain text password to compare
 * @param hashedPassword Stored hashed password to compare against
 * @returns Boolean indicating if passwords match
 */
export async function comparePassword(
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> {
  // Input validation
  if (!plainPassword || !hashedPassword) {
    throw new Error('Both plain and hashed passwords are required');
  }

  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
}