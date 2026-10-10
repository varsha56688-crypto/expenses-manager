import { VALID_CATEGORIES, VALID_PAYMENT_METHODS } from '../models/Expense.js';

export const validateExpensePayload = (req, res, next) => {
  const { description, amount, category, date, paymentMethod } = req.body;

  const errors = [];

  // Description
  if (!description || typeof description !== 'string' || description.trim().length < 2) {
    errors.push('Description is required and must be at least 2 characters long.');
  }

  // Amount
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    errors.push('Amount must be a positive number greater than 0.');
  }

  // Category
  if (category && !VALID_CATEGORIES.includes(category)) {
    errors.push(`Invalid category. Allowed: ${VALID_CATEGORIES.join(', ')}`);
  }

  // Date
  if (date && isNaN(Date.parse(date))) {
    errors.push('Invalid date format provided.');
  }

  // Payment Method
  if (paymentMethod && !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    errors.push(`Invalid payment method. Allowed: ${VALID_PAYMENT_METHODS.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Normalize amount to float
  req.body.amount = numAmount;
  next();
};
