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
const budgetRoutes = require("./routes/budgetRoutes");


// Initialize express app
const app = express();

// Enable gzip compression for all responses to reduce bandwidth usage
app.use(compression());

// Trust the proxy (required for Vercel/Heroku/etc to pass secure cookies)
app.set("trust proxy", 1);

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

// Root route to check if server is running
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Define API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/budgets", budgetRoutes);

// Serve static files (Optional: mostly for local dev or if you keep backend/frontend together)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// Catch-all for React app - commented out for Vercel deployment as it handles routing
// app.use((req, res, next) => {
//   if (req.path.startsWith('/api')) {
//     return next();
//   }
//   res.sendFile(path.resolve(__dirname, "../Frontend/dist", "index.html"));
// });

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Export the app for Vercel
module.exports = app;

// Only listen if not running in Vercel (local development)
if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Only listen if not running in Vercel (local development)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}