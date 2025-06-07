import { describe, it, expect, vi } from 'vitest';
import { validateHeroName, validateHeroSearch } from './heroValidation';

describe('Hero Validation Middleware', () => {
  describe('validateHeroName', () => {
    it('should pass for valid hero names', () => {
      const mockReq: any = { params: { name: 'Spider-Man' } };
      const mockRes: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockNext = vi.fn();

      validateHeroName(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject names with special characters', () => {
      const mockReq: any = { params: { name: 'Spider-Man!' } };
      const mockRes: any = { 
        status: vi.fn().mockReturnThis(), 
        json: vi.fn() 
      };
      const mockNext = vi.fn();

      validateHeroName(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Invalid hero name'
      }));
    });

    it('should reject very short names', () => {
      const mockReq: any = { params: { name: 'A' } };
      const mockRes: any = { 
        status: vi.fn().mockReturnThis(), 
        json: vi.fn() 
      };
      const mockNext = vi.fn();

      validateHeroName(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Invalid hero name'
      }));
    });
  });

  describe('validateHeroSearch', () => {
    it('should pass for valid search queries', () => {
      const mockReq: any = { query: { q: 'Spider Man' } };
      const mockRes: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockNext = vi.fn();

      validateHeroSearch(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should pass if no query is provided', () => {
      const mockReq: any = { query: {} };
      const mockRes: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const mockNext = vi.fn();

      validateHeroSearch(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject search queries with special characters', () => {
      const mockReq: any = { query: { q: 'Spider-Man!' } };
      const mockRes: any = { 
        status: vi.fn().mockReturnThis(), 
        json: vi.fn() 
      };
      const mockNext = vi.fn();

      validateHeroSearch(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Invalid search query'
      }));
    });
  });
});