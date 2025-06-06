import { describe, it, expect } from 'vitest';
import { buildProductSearchQuery } from '../src/utils/productSearchQueryBuilder';

describe('Product Search Query Builder', () => {
  it('should create an empty query when no parameters are provided', () => {
    const query = buildProductSearchQuery({});
    expect(query).toEqual({});
  });

  it('should build a query with name partial match (case-insensitive)', () => {
    const query = buildProductSearchQuery({ name: 'lipstick' });
    expect(query.name).toEqual({ $regex: 'lipstick', $options: 'i' });
  });

  it('should build a query with exact brand match', () => {
    const query = buildProductSearchQuery({ brand: 'Sephora' });
    expect(query.brand).toBe('Sephora');
  });

  it('should build a query with exact category match', () => {
    const query = buildProductSearchQuery({ category: 'Makeup' });
    expect(query.category).toBe('Makeup');
  });

  it('should build a query with price range', () => {
    const query = buildProductSearchQuery({ minPrice: 10, maxPrice: 50 });
    expect(query.price).toEqual({ $gte: 10, $lte: 50 });
  });

  it('should build a query with minimum price', () => {
    const query = buildProductSearchQuery({ minPrice: 10 });
    expect(query.price).toEqual({ $gte: 10 });
  });

  it('should build a query with maximum price', () => {
    const query = buildProductSearchQuery({ maxPrice: 50 });
    expect(query.price).toEqual({ $lte: 50 });
  });

  it('should build a query with in-stock filter', () => {
    const query = buildProductSearchQuery({ inStock: true });
    expect(query.inStock).toBe(true);
  });

  it('should combine multiple search parameters', () => {
    const query = buildProductSearchQuery({ 
      name: 'foundation', 
      brand: 'NARS', 
      category: 'Face', 
      minPrice: 20, 
      maxPrice: 60,
      inStock: true 
    });
    expect(query).toEqual({
      name: { $regex: 'foundation', $options: 'i' },
      brand: 'NARS',
      category: 'Face',
      price: { $gte: 20, $lte: 60 },
      inStock: true
    });
  });
});