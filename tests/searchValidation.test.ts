import { describe, it, expect } from 'vitest';
import { query } from 'express-validator';
import { searchValidationRules, validateSearchQuery } from '../src/middleware/searchValidation';

describe('Search Query Validation', () => {
  // Custom mock validation function
  const runValidation = async (rules: any[], data: any) => {
    const req = { query: data } as any;
    const res = {
      status: function(code: number) {
        this.statusCode = code;
        return this;
      },
      json: function(body: any) {
        this.body = body;
        return this;
      }
    } as any;
    const next = () => {};

    for (const rule of rules) {
      await rule.run(req);
    }

    validateSearchQuery(req, res, next);
    return res;
  };

  it('should pass validation for valid search query', async () => {
    const res = await runValidation(searchValidationRules, {
      q: 'lipstick',
      category: 'makeup',
      minPrice: '10.00',
      maxPrice: '50.00',
      page: '1',
      limit: '20'
    });
    expect(res.statusCode).toBeUndefined();
  });

  it('should reject search query with invalid category', async () => {
    const res = await runValidation(searchValidationRules, {
      category: 'invalid-category'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].field).toBe('category');
  });

  it('should reject search query with negative prices', async () => {
    const res = await runValidation(searchValidationRules, {
      minPrice: '-10',
      maxPrice: '-5'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should reject search query with max price less than min price', async () => {
    const res = await runValidation(searchValidationRules, {
      minPrice: '50',
      maxPrice: '20'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].message).toContain('Maximum price must be greater');
  });

  it('should reject search query with overly long search term', async () => {
    const res = await runValidation(searchValidationRules, {
      q: 'a'.repeat(101)
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].field).toBe('q');
  });

  it('should reject search query with invalid page or limit', async () => {
    const res = await runValidation(searchValidationRules, {
      page: '-1',
      limit: '0'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});