require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const session = require("express-session");
const connectDB = require("./config/db");
const performanceMiddleware = require("./middleware/performanceMiddleware");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const biometricRoutes = require("./routes/biometricRoutes");

const app = express();

// Enable compression for all responses
app.use(compression());

// Performance monitoring
app.use(performanceMiddleware);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 10, // 10 minutes
    },
  })
);

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/biometric", biometricRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
