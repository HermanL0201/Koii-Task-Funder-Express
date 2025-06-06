import { describe, it, expect } from 'vitest';
import { searchValidationRules, validateSearchQuery } from '../src/middleware/searchValidation';
import { Request, Response, NextFunction } from 'express';

describe('Search Query Validation', () => {
  // Mock request, response, and next function
  const createMockReq = (query: any) => ({
    query
  } as Request);

  const mockRes = {
    status: function(statusCode: number) {
      this.statusCode = statusCode;
      return this;
    },
    json: function(body: any) {
      this.body = body;
      return this;
    }
  } as unknown as Response;

  const mockNext = (() => {}) as NextFunction;

  it('should pass validation for valid search query', () => {
    const req = createMockReq({
      q: 'lipstick',
      category: 'makeup',
      minPrice: '10.00',
      maxPrice: '50.00',
      page: '1',
      limit: '20'
    });

    validateSearchQuery(req, mockRes, mockNext);
    expect(mockRes.statusCode).toBeUndefined();
  });

  it('should reject search query with invalid category', () => {
    const req = createMockReq({
      category: 'invalid-category'
    });

    validateSearchQuery(req, mockRes, mockNext);
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes.body.errors[0].field).toBe('category');
  });

  it('should reject search query with negative prices', () => {
    const req = createMockReq({
      minPrice: '-10',
      maxPrice: '-5'
    });

    validateSearchQuery(req, mockRes, mockNext);
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes.body.errors.length).toBeGreaterThan(0);
  });

  it('should reject search query with max price less than min price', () => {
    const req = createMockReq({
      minPrice: '50',
      maxPrice: '20'
    });

    validateSearchQuery(req, mockRes, mockNext);
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes.body.errors[0].message).toContain('Maximum price must be greater');
  });

  it('should reject search query with overly long search term', () => {
    const req = createMockReq({
      q: 'a'.repeat(101)
    });

    validateSearchQuery(req, mockRes, mockNext);
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes.body.errors[0].field).toBe('q');
  });

  it('should reject search query with invalid page or limit', () => {
    const req = createMockReq({
      page: '-1',
      limit: '0'
    });

    validateSearchQuery(req, mockRes, mockNext);
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes.body.errors.length).toBeGreaterThan(0);
  });
});