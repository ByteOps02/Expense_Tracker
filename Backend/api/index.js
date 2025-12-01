const app = require("../server");
const connectDB = require("../config/db");

let isConnected = false;

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Connect to database if not already connected
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("Database connected for serverless function.");
    } catch (error) {
      console.error("Failed to connect to database:", error);
      return res.status(500).json({ 
        message: "Database connection failed",
        error: error.message 
      });
    }
  }

  console.log(`Incoming Request: ${req.method} ${req.url}`);
  
  // Let Express handle the request
  return app(req, res);
};