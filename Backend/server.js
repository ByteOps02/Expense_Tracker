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
const performanceMiddleware = require("./middleware/performanceMiddleware");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


// Initialize express app
const app = express();

// Enable gzip compression for all responses to reduce bandwidth usage
app.use(compression());

// Custom middleware to monitor the performance of requests
// app.use(performanceMiddleware);

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

// Connect to the MongoDB database
connectDB();

// Define API routes
// All authentication-related routes are prefixed with /api/v1/auth
app.use("/api/v1/auth", authRoutes);
// All expense-related routes are prefixed with /api/v1/expense
app.use("/api/v1/expense", expenseRoutes);
// All income-related routes are prefixed with /api/v1/income
app.use("/api/v1/income", incomeRoutes);
// All dashboard-related routes are prefixed with /api/v1/dashboard
app.use("/api/v1/dashboard", dashboardRoutes);


// Serve static files from the "uploads" directory
// This is used to serve user-uploaded profile images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend static files from the build directory
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// Any remaining requests are sent to the React app's index.html
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "../Frontend/dist", "index.html"));
});

// Define the port for the server
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export the app for testing purposes
module.exports = app;