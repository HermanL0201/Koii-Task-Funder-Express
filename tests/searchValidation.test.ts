import { describe, it, expect } from 'vitest';
import { validationResult } from 'express-validator';
import { searchValidationRules } from '../src/middleware/searchValidation';

describe('Search Query Validation', () => {
  // Custom validation function
  const validateQuery = async (query: any) => {
    const req = { query } as any;
    
    for (const rule of searchValidationRules) {
      await rule.run(req);
    }
    
    return validationResult(req);
  };

  it('should pass validation for valid search query', async () => {
    const result = await validateQuery({
      q: 'lipstick',
      category: 'makeup',
      minPrice: '10.00',
      maxPrice: '50.00',
      page: '1',
      limit: '20'
    });
    expect(result.isEmpty()).toBe(true);
  });

  it('should reject search query with invalid category', async () => {
    const result = await validateQuery({
      category: 'invalid-category'
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors[0].msg).toBe('Invalid category');
  });

  it('should reject search query with negative prices', async () => {
    const result = await validateQuery({
      minPrice: '-10',
      maxPrice: '-5'
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some(e => e.msg === 'Minimum price must be a non-negative number')).toBe(true);
  });

  it('should reject search query with max price less than min price', async () => {
    const result = await validateQuery({
      minPrice: '50',
      maxPrice: '20'
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors[0].msg).toBe('Maximum price must be greater than or equal to minimum price');
  });

  it('should reject search query with overly long search term', async () => {
    const result = await validateQuery({
      q: 'a'.repeat(101)
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors[0].msg).toBe('Search query must be between 1 and 100 characters');
  });

  it('should reject search query with invalid page or limit', async () => {
    const result = await validateQuery({
      page: '-1',
      limit: '0'
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some(e => 
      e.msg === 'Page must be a positive integer' || 
      e.msg === 'Limit must be between 1 and 100'
    )).toBe(true);
  });
});