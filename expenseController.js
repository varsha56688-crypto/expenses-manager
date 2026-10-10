import Expense from '../models/Expense.js';
import { getDBStatus } from '../config/db.js';
import { SEED_EXPENSES } from '../data/seedData.js';

// In-Memory Storage Fallback if MongoDB is not connected
let inMemoryExpenses = SEED_EXPENSES.map((item, index) => ({
  _id: `mem-${Date.now()}-${index}`,
  ...item,
  createdAt: item.date,
  updatedAt: item.date,
}));

/**
 * @desc Get all expenses with filters and sorting
 * @route GET /api/expenses
 */
export const getExpenses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'date_desc',
      page,
      limit,
    } = req.query;

    const isDbConnected = getDBStatus();

    if (isDbConnected) {
      // MongoDB / Mongoose Query
      const query = {};

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ description: regex }, { notes: regex }, { tags: regex }];
      }

      if (category && category !== 'ALL') {
        query.category = category;
      }

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate + (endDate.includes('T') ? '' : 'T23:59:59.999Z'));
      }

      if (minAmount || maxAmount) {
        query.amount = {};
        if (minAmount) query.amount.$gte = Number(minAmount);
        if (maxAmount) query.amount.$lte = Number(maxAmount);
      }

      // Sort criteria
      let sortOptions = { date: -1 };
      if (sortBy === 'date_asc') sortOptions = { date: 1 };
      else if (sortBy === 'amount_desc') sortOptions = { amount: -1 };
      else if (sortBy === 'amount_asc') sortOptions = { amount: 1 };
      else if (sortBy === 'category_asc') sortOptions = { category: 1 };

      let queryExec = Expense.find(query).sort(sortOptions);

      const totalCount = await Expense.countDocuments(query);

      if (page && limit) {
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;
        queryExec = queryExec.skip(skip).limit(limitNum);

        const expenses = await queryExec;
        return res.json({
          success: true,
          count: expenses.length,
          total: totalCount,
          page: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          source: 'mongodb',
          expenses,
        });
      }

      const expenses = await queryExec;
      return res.json({
        success: true,
        count: expenses.length,
        total: totalCount,
        source: 'mongodb',
        expenses,
      });
    }

    // In-Memory Fallback
    let results = [...inMemoryExpenses];

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.description?.toLowerCase().includes(q) ||
          item.notes?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'ALL') {
      results = results.filter((item) => item.category === category);
    }

    if (startDate) {
      const start = new Date(startDate);
      results = results.filter((item) => new Date(item.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate + (endDate.includes('T') ? '' : 'T23:59:59.999Z'));
      results = results.filter((item) => new Date(item.date) <= end);
    }

    if (minAmount) {
      results = results.filter((item) => item.amount >= Number(minAmount));
    }

    if (maxAmount) {
      results = results.filter((item) => item.amount <= Number(maxAmount));
    }

    // Sort
    results.sort((a, b) => {
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      if (sortBy === 'category_asc') return (a.category || '').localeCompare(b.category || '');
      return new Date(b.date) - new Date(a.date);
    });

    const totalCount = results.length;

    if (page && limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const start = (pageNum - 1) * limitNum;
      const paginated = results.slice(start, start + limitNum);

      return res.json({
        success: true,
        count: paginated.length,
        total: totalCount,
        page: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        source: 'in-memory',
        expenses: paginated,
      });
    }

    return res.json({
      success: true,
      count: results.length,
      total: totalCount,
      source: 'in-memory',
      expenses: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Compute statistical overview & category analytics
 * @route GET /api/expenses/stats
 */
export const getExpenseStats = async (req, res, next) => {
  try {
    const isDbConnected = getDBStatus();
    let allExpenses = [];

    if (isDbConnected) {
      allExpenses = await Expense.find().lean();
    } else {
      allExpenses = inMemoryExpenses;
    }

    const totalSpend = allExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalCount = allExpenses.length;
    const avgExpense = totalCount > 0 ? totalSpend / totalCount : 0;
    const highestExpense = allExpenses.reduce((max, item) => Math.max(max, Number(item.amount) || 0), 0);

    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = now.getMonth();
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
    const prevYear = currMonth === 0 ? currYear - 1 : currYear;

    let currentMonthSpend = 0;
    let previousMonthSpend = 0;
    const categoryMap = {};

    allExpenses.forEach((item) => {
      const amt = Number(item.amount) || 0;
      const d = new Date(item.date);

      if (d.getFullYear() === currYear && d.getMonth() === currMonth) {
        currentMonthSpend += amt;
      } else if (d.getFullYear() === prevYear && d.getMonth() === prevMonth) {
        previousMonthSpend += amt;
      }

      const cat = item.category || 'Miscellaneous';
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    });

    let monthlyChangePercent = 0;
    if (previousMonthSpend > 0) {
      monthlyChangePercent = ((currentMonthSpend - previousMonthSpend) / previousMonthSpend) * 100;
    }

    const categoryDistribution = Object.entries(categoryMap)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalSpend > 0 ? (amount / totalSpend) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return res.json({
      success: true,
      stats: {
        totalSpend,
        totalCount,
        avgExpense,
        highestExpense,
        currentMonthSpend,
        previousMonthSpend,
        monthlyChangePercent,
        categoryDistribution,
      },
      source: isDbConnected ? 'mongodb' : 'in-memory',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single expense by ID
 * @route GET /api/expenses/:id
 */
export const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDbConnected = getDBStatus();

    if (isDbConnected) {
      const expense = await Expense.findById(id);
      if (!expense) {
        return res.status(404).json({ success: false, message: 'Expense record not found' });
      }
      return res.json({ success: true, expense });
    }

    const expense = inMemoryExpenses.find((item) => item._id === id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }
    return res.json({ success: true, expense });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new expense
 * @route POST /api/expenses
 */
export const createExpense = async (req, res, next) => {
  try {
    const { description, amount, category, date, paymentMethod, notes, tags } = req.body;
    const isDbConnected = getDBStatus();

    const expenseData = {
      description,
      amount: Number(amount),
      category: category || 'Miscellaneous',
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'UPI / GPay',
      notes: notes || '',
      tags: tags || [],
    };

    if (isDbConnected) {
      const newExpense = await Expense.create(expenseData);
      return res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        expense: newExpense,
      });
    }

    const newRecord = {
      _id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...expenseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryExpenses.unshift(newRecord);

    return res.status(201).json({
      success: true,
      message: 'Expense created successfully (in-memory mode)',
      expense: newRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update existing expense
 * @route PUT /api/expenses/:id
 */
export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, amount, category, date, paymentMethod, notes, tags } = req.body;
    const isDbConnected = getDBStatus();

    const updates = {
      description,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : undefined,
      paymentMethod,
      notes,
      tags,
    };

    // Clean undefined fields
    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    if (isDbConnected) {
      const updatedExpense = await Expense.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedExpense) {
        return res.status(404).json({ success: false, message: 'Expense record not found' });
      }

      return res.json({
        success: true,
        message: 'Expense updated successfully',
        expense: updatedExpense,
      });
    }

    const index = inMemoryExpenses.findIndex((item) => item._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    inMemoryExpenses[index] = {
      ...inMemoryExpenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return res.json({
      success: true,
      message: 'Expense updated successfully',
      expense: inMemoryExpenses[index],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete expense by ID
 * @route DELETE /api/expenses/:id
 */
export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDbConnected = getDBStatus();

    if (isDbConnected) {
      const deleted = await Expense.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Expense record not found' });
      }
      return res.json({
        success: true,
        message: 'Expense record permanently deleted',
        deletedId: id,
      });
    }

    const index = inMemoryExpenses.findIndex((item) => item._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    inMemoryExpenses.splice(index, 1);
    return res.json({
      success: true,
      message: 'Expense record permanently deleted',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Bulk delete expenses
 * @route POST /api/expenses/bulk-delete
 */
export const bulkDeleteExpenses = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Valid array of IDs required' });
    }

    const isDbConnected = getDBStatus();

    if (isDbConnected) {
      const result = await Expense.deleteMany({ _id: { $in: ids } });
      return res.json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} expense records`,
        deletedCount: result.deletedCount,
      });
    }

    const initialLength = inMemoryExpenses.length;
    inMemoryExpenses = inMemoryExpenses.filter((item) => !ids.includes(item._id));
    const deletedCount = initialLength - inMemoryExpenses.length;

    return res.json({
      success: true,
      message: `Successfully deleted ${deletedCount} expense records`,
      deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Reset or seed demo expenses
 * @route POST /api/expenses/seed
 */
export const seedExpenses = async (req, res, next) => {
  try {
    const isDbConnected = getDBStatus();

    if (isDbConnected) {
      await Expense.deleteMany({});
      const seeded = await Expense.insertMany(SEED_EXPENSES);
      return res.json({
        success: true,
        message: `Successfully seeded database with ${seeded.length} boutique expenses`,
        count: seeded.length,
        expenses: seeded,
      });
    }

    inMemoryExpenses = SEED_EXPENSES.map((item, index) => ({
      _id: `mem-${Date.now()}-${index}`,
      ...item,
      createdAt: item.date,
      updatedAt: item.date,
    }));

    return res.json({
      success: true,
      message: `Successfully seeded in-memory store with ${inMemoryExpenses.length} boutique expenses`,
      count: inMemoryExpenses.length,
      expenses: inMemoryExpenses,
    });
  } catch (error) {
    next(error);
  }
};
