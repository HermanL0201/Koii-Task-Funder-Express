import { describe, it, expect, beforeEach } from 'vitest';
import CacheManager from './cache.js';

describe('CacheManager', () => {
  let cacheManager;

  beforeEach(() => {
    cacheManager = new CacheManager({
      stdTTL: 1, // Short TTL for testing
      checkPeriod: 0.1
    });
  });

  it('should set and get a value correctly', () => {
    const key = 'testKey';
    const value = { data: 'test' };

    cacheManager.set(key, value);
    const retrievedValue = cacheManager.get(key);

    expect(retrievedValue).toEqual(value);
  });

  it('should throw error when setting/getting without a key', () => {
    expect(() => cacheManager.set()).toThrow('Cache key is required');
    expect(() => cacheManager.get()).toThrow('Cache key is required');
  });

  it('should delete a key from cache', () => {
    const key = 'deleteKey';
    cacheManager.set(key, 'value');
    
    const deletedCount = cacheManager.delete(key);
    expect(deletedCount).toBe(1);
    expect(cacheManager.get(key)).toBeUndefined();
  });

  it('should check key existence', () => {
    const key = 'existenceKey';
    cacheManager.set(key, 'value');

    expect(cacheManager.has(key)).toBe(true);
    expect(cacheManager.has('nonexistentKey')).toBe(false);
  });

  it('should clear entire cache', () => {
    cacheManager.set('key1', 'value1');
    cacheManager.set('key2', 'value2');

    cacheManager.clear();
    expect(cacheManager.get('key1')).toBeUndefined();
    expect(cacheManager.get('key2')).toBeUndefined();
  });

  it('should return cache statistics', () => {
    const stats = cacheManager.stats();
    expect(stats).toHaveProperty('keys');
    expect(stats).toHaveProperty('hits');
    expect(stats).toHaveProperty('misses');
  });
});