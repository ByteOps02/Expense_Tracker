const app = require("../server");
const connectDB = require("../config/db"); // Import connectDB

let isConnected = false; // Flag to track connection status

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("Database connected for serverless function.");
    } catch (error) {
      console.error("Failed to connect to database in serverless function:", error);
      // It's crucial to send an error response if the DB connection fails
      return res.status(500).send("Database connection failed.");
    }
  }
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  // Let the Express app handle the request
  return app(req, res);
};