let mongoose = require("mongoose");

let cachedPromise = null;

let connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (cachedPromise) {
    await cachedPromise;
    return;
  }

  try {
    let options = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    cachedPromise = mongoose.connect(process.env.MONGO_URI, options);

    await cachedPromise;
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    cachedPromise = null;
    throw new Error("Database connection failed.");
  }
};

module.exports = connectDB;
