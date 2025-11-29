// Import necessary packages
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");



// Define the User schema
const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    is2FAEnabled: { type: Boolean, default: false },
    twoFASecret: { type: String, default: null },
    twoFARecoveryCodes: { type: [String], default: [] },
    recentLoginActivities: [
      {
        timestamp: { type: Date, default: Date.now },
        ipAddress: { type: String },
        userAgent: { type: String },
        status: { type: String }, // e.g., "Successful", "Failed"
      },
    ],

  },
  // Enable timestamps (createdAt and updatedAt)
  { timestamps: true },
);

// Middleware to hash the password before saving the user
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();
  // Hash the password with a salt factor of 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare a candidate password with the user's hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
module.exports = mongoose.model("User", UserSchema);