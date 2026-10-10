import mongoose from 'mongoose';

export const VALID_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing & Rent',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Investment',
  'Travel',
  'Miscellaneous',
];

export const VALID_PAYMENT_METHODS = [
  'UPI / GPay',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Cash',
];

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Expense description is required'],
      trim: true,
      minlength: [2, 'Description must be at least 2 characters'],
      maxlength: [120, 'Description cannot exceed 120 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: VALID_CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
      default: 'Miscellaneous',
    },
    date: {
      type: Date,
      required: [true, 'Expense date is required'],
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: VALID_PAYMENT_METHODS,
        message: '{VALUE} is not a valid payment method',
      },
      default: 'UPI / GPay',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for high-speed queries on date, category, and text search
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ description: 'text', notes: 'text' });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
