// Import necessary packages
const jwt = require("jsonwebtoken");

/**
 * @desc    Middleware to protect routes by verifying JWT token
 * @param   {object} req - Express request object
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware function
 */
const Protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and has the correct format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID to the request object
    req.user = { id: decoded.id };

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { Protect };