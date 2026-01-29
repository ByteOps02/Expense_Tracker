const mongoose = require("mongoose");

const connectDB = async () => {
  // Check if we have a connection to the database
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false, // Important for serverless environments
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Throw the error to be handled by the caller, instead of exiting the process
    throw new Error("Database connection failed.");
  }
};

module.exports = connectDB;
