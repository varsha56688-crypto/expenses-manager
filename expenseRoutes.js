import express from 'express';
import {
  getExpenses,
  getExpenseStats,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  bulkDeleteExpenses,
  seedExpenses,
} from '../controllers/expenseController.js';
import { validateExpensePayload } from '../middleware/validate.js';

const router = express.Router();

// Stats overview route (must come before /:id)
router.get('/stats', getExpenseStats);

// Seed or reset sample demo data
router.post('/seed', seedExpenses);

// Bulk delete
router.post('/bulk-delete', bulkDeleteExpenses);

// Main collection routes
router.route('/')
  .get(getExpenses)
  .post(validateExpensePayload, createExpense);

// Single resource routes
router.route('/:id')
  .get(getExpenseById)
  .put(validateExpensePayload, updateExpense)
  .delete(deleteExpense);

export default router;
