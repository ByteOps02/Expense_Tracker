require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");

const app = express();

// Enable compression for all responses
app.use(compression());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Simple test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`📊 Performance optimizations enabled:`);
  console.log(`   - Compression middleware`);
  console.log(`   - CORS configured`);
  console.log(`   - Express JSON parsing`);
  console.log(`\n🚀 Try accessing: http://localhost:${PORT}/test`);
}); 