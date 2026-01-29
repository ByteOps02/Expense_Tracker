const app = require("../server");
const connectDB = require("../config/db");

// This is the serverless function handler
module.exports = async (req, res) => {
  try {
    // Ensure there is a database connection before handling the request
    await connectDB();
    
    // Pass the request to the express app
    return app(req, res);
  } catch (error) {
    // If the database connection fails, return a 500 error
    console.error("Handler error:", error);
    res.status(500).json({
      message: "Server error. Could not connect to the database.",
    });
  }
};