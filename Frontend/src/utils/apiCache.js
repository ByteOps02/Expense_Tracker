let cache = {};

/**
 * Retrieves cached data by key.
 * @param {string} key - The cache key (usually the API URL with query params).
 * @returns {*} The cached data or null if not found.
 */
export const getCachedData = (key) => {
  return cache[key] || null;
};

/**
 * Stores data in cache.
 * @param {string} key - The cache key.
 * @param {*} data - The data to cache.
 */
export const setCachedData = (key, data) => {
  cache[key] = data;
};

/**
 * Clears all cached items.
 */
export const clearCache = () => {
  cache = {};
};
