// Load environment variables from .env file
require("dotenv").config();

// Import necessary packages
const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const session = require("express-session");

// Import local modules
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


// Initialize express app
const app = express();

// Enable gzip compression for all responses to reduce bandwidth usage
app.use(compression());

// Enable Cross-Origin Resource Sharing (CORS)
// This allows the frontend to make requests to the backend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Allow requests from the client URL or any origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  }),
);

// Parse incoming JSON requests
app.use(express.json());

// Configure express-session middleware
// This is used for session management, particularly for biometric authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret", // Secret used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true, // Prevent client-side access to the cookie
      maxAge: 1000 * 60 * 10, // Cookie expiration time (10 minutes)
    },
  }),
);

// Define API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// Catch-all for React app (exclude API routes to avoid returning HTML for API 404s)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.resolve(__dirname, "../Frontend/dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }
    
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// Export the app for testing purposes
module.exports = app;