import NodeCache from 'node-cache';

/**
 * CacheManager provides a clean interface for caching operations
 * with configurable settings and error handling.
 */
class CacheManager {
  /**
   * Create a new cache instance
   * @param {Object} options - Cache configuration options
   * @param {number} [options.stdTTL=600] - Default time to live in seconds
   * @param {number} [options.checkPeriod=120] - Period for checking expired keys
   */
  constructor(options = {}) {
    const defaultOptions = {
      stdTTL: 600, // 10 minutes default
      checkPeriod: 120 // Check for expired keys every 2 minutes
    };

    this.cache = new NodeCache({
      ...defaultOptions,
      ...options
    });
  }

  /**
   * Set a value in the cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} [ttl] - Optional time to live in seconds
   * @returns {boolean} - Whether the value was successfully set
   */
  set(key, value, ttl) {
    if (!key) {
      throw new Error('Cache key is required');
    }

    return this.cache.set(key, value, ttl);
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {*} - Cached value or undefined
   */
  get(key) {
    if (!key) {
      throw new Error('Cache key is required');
    }

    return this.cache.get(key);
  }

  /**
   * Delete a key from the cache
   * @param {string} key - Cache key to delete
   * @returns {number} - Number of deleted keys
   */
  delete(key) {
    if (!key) {
      throw new Error('Cache key is required');
    }

    return this.cache.del(key);
  }

  /**
   * Check if a key exists in the cache
   * @param {string} key - Cache key to check
   * @returns {boolean} - Whether the key exists
   */
  has(key) {
    if (!key) {
      throw new Error('Cache key is required');
    }

    return this.cache.has(key);
  }

  /**
   * Clear entire cache
   * @returns {void}
   */
  clear() {
    this.cache.flushAll();
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  stats() {
    return this.cache.getStats();
  }
}

export default CacheManager;