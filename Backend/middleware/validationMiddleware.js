/**
 * Validation middleware for user inputs
 * Provides input validation and sanitization to prevent injection attacks
 */

const { body, validationResult, param } = require("express-validator");

/**
 * Middleware to check validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation errors:", errors.array());
    return res.status(400).json({ 
      message: "Validation errors", 
      errors: errors.array() 
    });
  }
  next();
};

/**
 * Middleware to sanitize MongoDB query parameters
 * Prevents NoSQL injection attacks
 */
const sanitizeMongoParams = (req, res, next) => {
  // Sanitize req.params
  Object.keys(req.params).forEach((key) => {
    if (typeof req.params[key] === 'string') {
      req.params[key] = req.params[key].trim();
    }
  });

  Object.keys(req.query).forEach((key) => {
    if (typeof req.query[key] === 'string') {
      req.query[key] = req.query[key].trim();
    }
  });
  
  next();
};

/**
 * Income validation rules
 */
const validateIncome = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 255 }).withMessage("Title must not exceed 255 characters")
    .escape(),
  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isFloat({ min: 0 }).withMessage("Amount must be a positive number"),
  body("source")
    .trim()
    .notEmpty().withMessage("Source is required")
    .isLength({ max: 255 }).withMessage("Source must not exceed 255 characters")
    .escape(),
  body("category")
    .trim()
    .notEmpty().withMessage("Category is required")
    .isLength({ max: 255 }).withMessage("Category must not exceed 255 characters")
    .escape(),
  body("date")
    .optional()
    .isISO8601().withMessage("Date must be a valid date"),
  body("note")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Note must not exceed 500 characters")
    .escape(),
  body("icon")
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage("Icon must not exceed 100 characters"),
];

/**
 * Expense validation rules
 */
const validateExpense = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 255 }).withMessage("Title must not exceed 255 characters")
    .escape(),
  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isFloat({ min: 0 }).withMessage("Amount must be a positive number"),
  body("category")
    .trim()
    .notEmpty().withMessage("Category is required")
    .isLength({ max: 255 }).withMessage("Category must not exceed 255 characters")
    .escape(),
  body("date")
    .optional()
    .isISO8601().withMessage("Date must be a valid date"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description must not exceed 500 characters")
    .escape(),
  body("icon")
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage("Icon must not exceed 100 characters"),
];

/**
 * Budget validation rules
 */
const validateBudget = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 255 }).withMessage("Title must not exceed 255 characters")
    .escape(),
  body("category")
    .trim()
    .notEmpty().withMessage("Category is required")
    .isLength({ max: 255 }).withMessage("Category must not exceed 255 characters")
    .escape(),
  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isFloat({ min: 0 }).withMessage("Amount must be a positive number"),
  body("startDate")
    .notEmpty().withMessage("Start date is required")
    .isISO8601().withMessage("Start date must be a valid date"),
  body("endDate")
    .notEmpty().withMessage("End date is required")
    .isISO8601().withMessage("End date must be a valid date"),
  body("isRecurring")
    .optional()
    .isBoolean().withMessage("isRecurring must be a boolean"),
  body("recurrenceType")
    .optional()
    .trim()
    .isIn(["daily", "weekly", "monthly", "yearly"]).withMessage("Invalid recurrence type"),
];

/**
 * Auth validation rules
 */
const validateRegister = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 2, max: 255 }).withMessage("Full name must be between 2 and 255 characters")
    .escape(),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  body("profileImageUrl")
    .optional()
    .trim()
    .isURL().withMessage("Profile image URL must be a valid URL"),
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required"),
];

const validateChangePassword = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("New password must be at least 8 characters"),
];

const validateUpdateUser = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage("Full name must be between 2 and 255 characters")
    .escape(),
  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Must be a valid email")
    .normalizeEmail(),
  body("profileImageUrl")
    .optional()
    .trim()
    .isURL().withMessage("Profile image URL must be a valid URL"),
];

/**
 * ID validation rules
 */
const validateMongoId = [
  param("id")
    .isMongoId().withMessage("Invalid ID format"),
];

module.exports = {
  handleValidationErrors,
  sanitizeMongoParams,
  validateIncome,
  validateExpense,
  validateBudget,
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateUpdateUser,
  validateMongoId,
};
