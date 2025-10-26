/**
 * @desc    Middleware to log the duration of each request and identify slow requests
 * @param   {object} req - Express request object
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware function
 */
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();

  // Override the res.end method to calculate the duration
  const originalEnd = res.end;
  res.end = function (chunk, encoding) {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);

    // Log a warning for requests that take longer than 1 second
    if (duration > 1000) {
      console.warn(
        `⚠️  SLOW REQUEST: ${req.method} ${req.originalUrl} took ${duration}ms`,
      );
    }

    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = performanceMiddleware;