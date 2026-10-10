import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import { SEED_EXPENSES } from '../data/seedData.js';

dotenv.config();

const seedDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_tracker';
  
  console.log(`Connecting to MongoDB at: ${mongoURI}...`);
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected! Purging existing expense records...');
    await Expense.deleteMany({});

    console.log(`Inserting ${SEED_EXPENSES.length} boutique expenses...`);
    const inserted = await Expense.insertMany(SEED_EXPENSES);

    console.log(`\x1b[32m✔ Successfully seeded ${inserted.length} expense records into database!\x1b[0m`);
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m✖ Seeding failed:\x1b[0m', error.message);
    process.exit(1);
  }
};

seedDB();
