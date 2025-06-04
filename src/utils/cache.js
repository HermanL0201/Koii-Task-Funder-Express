import NodeCache from 'node-cache';

/**
 * Centralized cache management utility for mock CoinGecko API
 * Provides methods for setting, getting, and deleting cached items
 */
class CacheManager {
  /**
   * Create a new cache instance
   * @param {Object} options - Cache configuration options
   * @param {number} [options.stdTTL=600] - Standard time to live in seconds (default: 10 minutes)
   * @param {number} [options.checkPeriod=620] - Interval to check and delete expired keys
   */
  constructor(options = {}) {
    const defaultOptions = {
      stdTTL: 600, // 10 minutes default cache time
      checkPeriod: 620 // Slightly longer than stdTTL to ensure cleanup
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
   * @returns {boolean} - Whether the set was successful
   */
  set(key, value, ttl) {
    if (!key) {
      throw new Error('Cache key is required');
    }
    return this.cache.set(key, value, ttl);
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key to retrieve
   * @returns {*} - Cached value or undefined
   */
  get(key) {
    if (!key) {
      throw new Error('Cache key is required');
    }
    return this.cache.get(key);
  }

  /**
   * Delete a specific key from the cache
   * @param {string} key - Cache key to delete
   * @returns {number} - Number of keys deleted
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
   * Clear the entire cache
   * @returns {void}
   */
  clear() {
    this.cache.flushAll();
  }
}

// Export a singleton instance for consistent caching across the application
export default new CacheManager();