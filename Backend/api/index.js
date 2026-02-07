const app = require("../server");
const connectDB = require("../config/db");

// This is the serverless function handler
module.exports = async (req, res) => {
  try {
    await connectDB();
    
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({
      message: "Server error. Could not connect to the database.",
    });
  }
};