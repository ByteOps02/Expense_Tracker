// Load environment variables from .env file
require("dotenv").config();

// Import necessary packages
const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

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

// Apply Helmet middleware for security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Enable Cross-Origin Resource Sharing (CORS) early
// This allows the frontend to make requests to the backend, including preflight OPTIONS requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow requests from the client URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"], // Allowed headers
    credentials: true, // Allow credentials
  }),
);

// Rate limiting for general API endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting
app.use(generalLimiter);

// Trust the proxy (required for Vercel/Heroku/etc to pass secure cookies)
app.set("trust proxy", 1);

// Parse incoming JSON requests
app.use(express.json());

// Configure express-session middleware
// This is used for session management and CSRF protection
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production", // Secret used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true, // Prevent client-side access to the cookie
      maxAge: 1000 * 60 * 10, // Cookie expiration time (10 minutes)
      sameSite: "strict", // CSRF protection
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

// Connect to MongoDB
connectDB();

// Export the app for Vercel
module.exports = app;

// Only listen if not running in Vercel (local development)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}