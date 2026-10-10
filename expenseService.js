import apiClient from './api';
import { INITIAL_EXPENSES } from './mockData';

const STORAGE_KEY = 'ledgerly_expenses_cache_v2';

// Local storage helper functions
const getStoredExpenses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse localStorage, resetting to seed data', err);
    return INITIAL_EXPENSES;
  }
};

const setStoredExpenses = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save expenses to localStorage', err);
  }
};

export const expenseService = {
  /**
   * Check if Express backend is running and reachable
   */
  async checkHealth() {
    try {
      const response = await apiClient.get('/health', { timeout: 3000 });
      return {
        online: true,
        database: response.data.database || 'connected',
      };
    } catch {
      return {
        online: false,
        database: 'disconnected',
      };
    }
  },

  /**
   * Fetch all expenses with optional filtering query params
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/expenses', { params });
      // Express returns array or { expenses: [...] }
      const data = response.data.expenses || (Array.isArray(response.data) ? response.data : []);
      // Sync local store cache
      if (data.length > 0) {
        setStoredExpenses(data);
      }
      return { data, source: response.data.source || 'api' };
    } catch (err) {
      console.info('Backend unreachable, serving from local store:', err.userMessage || err.message);
      const localData = getStoredExpenses();
      return { data: localData, source: 'local' };
    }
  },

  /**
   * Fetch aggregate statistics
   */
  async getStats() {
    try {
      const response = await apiClient.get('/expenses/stats');
      return { data: response.data.stats, source: response.data.source || 'api' };
    } catch {
      return null;
    }
  },

  /**
   * Create a new expense record
   */
  async create(expenseData) {
    try {
      const response = await apiClient.post('/expenses', expenseData);
      const created = response.data.expense || response.data;
      
      // Sync local store
      const local = getStoredExpenses();
      setStoredExpenses([created, ...local]);
      return { data: created, source: 'api' };
    } catch (err) {
      console.info('Falling back to local storage for creation');
      const newRecord = {
        _id: 'exp-' + Date.now(),
        ...expenseData,
        amount: parseFloat(expenseData.amount),
        createdAt: new Date().toISOString(),
      };
      const local = getStoredExpenses();
      const updated = [newRecord, ...local];
      setStoredExpenses(updated);
      return { data: newRecord, source: 'local' };
    }
  },

  /**
   * Update an existing expense record by ID
   */
  async update(id, expenseData) {
    try {
      const response = await apiClient.put(`/expenses/${id}`, expenseData);
      const updatedItem = response.data.expense || response.data;

      // Sync local store
      const local = getStoredExpenses();
      const next = local.map((item) => (item._id === id ? updatedItem : item));
      setStoredExpenses(next);
      return { data: updatedItem, source: 'api' };
    } catch (err) {
      console.info('Falling back to local storage for update');
      const local = getStoredExpenses();
      const updatedItem = {
        ...expenseData,
        _id: id,
        amount: parseFloat(expenseData.amount),
        updatedAt: new Date().toISOString(),
      };
      const next = local.map((item) => (item._id === id ? { ...item, ...updatedItem } : item));
      setStoredExpenses(next);
      return { data: updatedItem, source: 'local' };
    }
  },

  /**
   * Delete an expense record by ID
   */
  async delete(id) {
    try {
      await apiClient.delete(`/expenses/${id}`);
      const local = getStoredExpenses();
      setStoredExpenses(local.filter((item) => item._id !== id));
      return { success: true, source: 'api' };
    } catch (err) {
      console.info('Falling back to local storage for deletion');
      const local = getStoredExpenses();
      setStoredExpenses(local.filter((item) => item._id !== id));
      return { success: true, source: 'local' };
    }
  },

  /**
   * Bulk delete expense records
   */
  async bulkDelete(ids = []) {
    try {
      await apiClient.post('/expenses/bulk-delete', { ids });
      const local = getStoredExpenses();
      setStoredExpenses(local.filter((item) => !ids.includes(item._id)));
      return { success: true, source: 'api' };
    } catch {
      const local = getStoredExpenses();
      setStoredExpenses(local.filter((item) => !ids.includes(item._id)));
      return { success: true, source: 'local' };
    }
  },

  /**
   * Reset local storage and backend back to default demo seeds
   */
  async resetToSeeds() {
    try {
      const response = await apiClient.post('/expenses/seed');
      const expenses = response.data.expenses || INITIAL_EXPENSES;
      setStoredExpenses(expenses);
      return { data: expenses, source: 'api' };
    } catch {
      setStoredExpenses(INITIAL_EXPENSES);
      return { data: INITIAL_EXPENSES, source: 'local' };
    }
  },
};
