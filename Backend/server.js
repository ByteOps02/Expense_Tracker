// Load environment variables from .env file
require("dotenv").config();

// Import necessary packages
const express = require("express");
const cors = require("cors");
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

// Enable gzip compression
app.use(compression());

// Trust the proxy
app.set("trust proxy", 1);

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Parse incoming JSON requests
app.use(express.json());

// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 10,
    },
  }),
);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/budgets", budgetRoutes);

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export the app for Vercel
module.exports = app;

// Only listen if running locally (not in Vercel)
if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}