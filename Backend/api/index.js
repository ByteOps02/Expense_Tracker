const app = require("../server");
const connectDB = require("../config/db");

let isConnected = false;

module.exports = async (req, res) => {
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