const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Connection pooling for better performance
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected with optimized settings");
  } catch (err) {
    console.log("Error connecting to MongoDB", err);
    // Do not exit process in serverless environment
    throw err;
  }
};

module.exports = connectDB;
