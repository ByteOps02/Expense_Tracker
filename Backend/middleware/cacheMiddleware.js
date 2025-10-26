// Import necessary packages
const NodeCache = require("node-cache");

// Initialize a new NodeCache instance
const cache = new NodeCache();

/**
 * @desc    Function to clear the cache for a specific key
 * @param   {string} key - The key of the cache to clear
 */
const clearCache = (key) => {
  if (cache.has(key)) {
    cache.del(key);
    console.log(`Cache cleared for key: ${key}`);
  }
};

// Export the cache instance and the clearCache function
module.exports = { cache, clearCache };