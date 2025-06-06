import { JwtPayload } from 'jsonwebtoken';

// Extended interface to add custom properties to the JWT payload
export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role?: string;
}