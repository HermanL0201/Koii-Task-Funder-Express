import { Secret } from 'jsonwebtoken';

interface JWTConfig {
  secret: Secret;
  expiresIn: string;
}

const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || 'fallback_secret_key_for_development',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
};

export default jwtConfig;