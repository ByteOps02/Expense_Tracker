/**
 * Query validation utilities for MongoDB operations
 * Prevents injection attacks through explicit type validation
 */

const mongoose = require('mongoose');
const AppError = require('./AppError');

/**
 * Validate and cast MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @param {string} paramName - The parameter name (for error messages)
 * @returns {ObjectId} - Valid MongoDB ObjectId
 * @throws {AppError} - If ID is invalid
 */
const validateObjectId = (id, paramName = 'ID') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${paramName} format`, 400);
  }
  return new mongoose.Types.ObjectId(id);
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {string} - Validated email
 * @throws {AppError} - If email is invalid
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400);
  }
  return email.trim().toLowerCase();
};

/**
 * Sanitize string input
 * @param {string} input - The string to sanitize
 * @param {string} fieldName - The field name (for error messages)
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized string
 * @throws {AppError} - If input is invalid
 */
const sanitizeString = (input, fieldName = 'input', maxLength = 500) => {
  if (typeof input !== 'string') {
    throw new AppError(`${fieldName} must be a string`, 400);
  }
  
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw new AppError(`${fieldName} cannot be empty`, 400);
  }
  
  if (trimmed.length > maxLength) {
    throw new AppError(`${fieldName} exceeds maximum length of ${maxLength}`, 400);
  }
  
  return trimmed;
};

/**
 * Sanitize numeric input
 * @param {*} input - The number to sanitize
 * @param {string} fieldName - The field name (for error messages)
 * @returns {number} - Validated number
 * @throws {AppError} - If input is invalid
 */
const sanitizeNumber = (input, fieldName = 'number') => {
  const num = Number(input);
  if (isNaN(num) || num < 0) {
    throw new AppError(`${fieldName} must be a positive number`, 400);
  }
  return num;
};

/**
 * Validate query object for MongoDB operations
 * @param {object} queryObj - The query object to validate
 * @returns {object} - Validated query object
 */
const validateQueryObject = (queryObj) => {
  if (typeof queryObj !== 'object' || queryObj === null) {
    throw new AppError('Query object must be a valid object', 400);
  }
  return queryObj;
};

module.exports = {
  validateObjectId,
  validateEmail,
  sanitizeString,
  sanitizeNumber,
  validateQueryObject,
};
