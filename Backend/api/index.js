const app = require("../server");
const connectDB = require("../config/db");

module.exports = async (req, res) => {
  try {
    // Ensure database connection is established
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({
      message: "Database connection error",
      error: error.message,
    });
  }

  // Forward the request to the Express app
  app(req, res);
};