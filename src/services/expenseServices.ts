import axios from 'axios';
import { Expense, Category } from '@/types/Expense';

export const expenseServices = {
  // Expense management
  async getExpenses(filters?: { category?: string; startDate?: string; endDate?: string }) {
    try {
      let url = '/api/finance/expenses';
      if (filters) {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.expenses) {
        return { success: true, data: response.data.expenses };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  async addExpense(expenseData: Omit<Expense, '_id'>) {
    try {
      const response = await axios.post('/api/finance/expenses', expenseData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.message === 'Expense created successfully') {
        return { success: true, data: response.data.expense };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  async updateExpense(expenseId: string, updatedData: Partial<Expense>) {
    try {
      const response = await axios.put(`/api/finance/expenses/${expenseId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.expense) {
        return { success: true, data: response.data.expense };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  async deleteExpense(expenseId: string) {
    try {
      const response = await axios.delete(`/api/finance/expenses/${expenseId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.message === 'Expense deleted successfully') {
        return { success: true, data: response.data.expense };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Category management
  async getCategories() {
    try {
      const response = await axios.get('/api/finance/expenses/categories', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.categories) {
        return { success: true, data: response.data.categories };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  async addCategory(categoryData: Omit<Category, '_id'>) {
    try {
      const response = await axios.post('/api/finance/expenses/categories', categoryData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.message === 'Category created successfully') {
        return { success: true, data: response.data.category };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  async updateCategory(categoryId: string, updatedData: Partial<Category>) {
    try {
      const response = await axios.put(`/api/finance/expenses/categories/${categoryId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.category) {
        return { success: true, data: response.data.category };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  async deleteCategory(categoryId: string) {
    try {
      const response = await axios.delete(`/api/finance/expenses/categories/${categoryId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.message === 'Category deleted successfully') {
        return { success: true, data: response.data.category };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },
  async updateExpenseStatus(expenseId: string, status: 'approved' | 'disapproved' | 'pending') {
    try {
      const response = await axios.patch(
        `/api/finance/expenses/${expenseId}/status`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );

      if (response.data?.expense) {
        return { success: true, data: response.data.expense };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  }
};