const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
    
    // Log slow requests (over 1 second)
    if (duration > 1000) {
      console.warn(`⚠️  SLOW REQUEST: ${req.method} ${req.originalUrl} took ${duration}ms`);
    }
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

module.exports = performanceMiddleware; 