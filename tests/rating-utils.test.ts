import { describe, it, expect } from 'vitest';
import { calculateAggregateRating } from '../src/rating-utils';

describe('calculateAggregateRating', () => {
  it('calculates correct average for multiple reviews', () => {
    const reviews = [
      { rating: 4 },
      { rating: 5 },
      { rating: 3 }
    ];
    expect(calculateAggregateRating(reviews)).toBe(4);
  });

  it('returns 0 for empty reviews', () => {
    expect(calculateAggregateRating([])).toBe(0);
  });

  it('returns 0 for undefined reviews', () => {
    expect(calculateAggregateRating(undefined)).toBe(0);
  });

  it('rounds to 2 decimal places', () => {
    const reviews = [
      { rating: 4.3 },
      { rating: 4.7 }
    ];
    expect(calculateAggregateRating(reviews)).toBe(4.5);
  });

  it('throws error for invalid rating', () => {
    const invalidReviews = [
      { rating: 0 },
      { rating: 6 }
    ];
    expect(() => calculateAggregateRating(invalidReviews)).toThrow('Rating must be between 1 and 5');
  });

  it('throws error for non-numeric rating', () => {
    const invalidReviews = [
      { rating: NaN },
      { rating: 'invalid' as any }
    ];
    expect(() => calculateAggregateRating(invalidReviews)).toThrow('Invalid review rating');
  });
});