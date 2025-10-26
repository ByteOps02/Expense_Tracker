const NodeCache = require("node-cache");
const cache = new NodeCache();

const clearCache = (key) => {
  if (cache.has(key)) {
    cache.del(key);
    console.log(`Cache cleared for key: ${key}`);
  }
};

module.exports = { cache, clearCache };
