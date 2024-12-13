import axios from 'axios';

export const payrollServices = {
  // Get all payrolls with optional filters
  async getPayrolls(filters?: { month?: number; year?: number; employee?: string }) {
    try {
      let url = '/api/payroll';
      if (filters) {
        const params = new URLSearchParams();
        if (filters.month) params.append('month', filters.month.toString());
        if (filters.year) params.append('year', filters.year.toString());
        if (filters.employee) params.append('employee', filters.employee);
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.payrolls) {
        return { success: true, data: response.data.payrolls };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Add a new payroll record
  async addPayroll(payrollData: {
    employeeId: string;
    baseSalary: number;
    bonus?: number;
    deductions?: number;
    payDate?: string | null;
    payMonth: number;
    payYear: number;
    attendanceData?: { hoursWorked?: number | null  };
  }) {
    try {
      const response = await axios.post('/api/payroll', payrollData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.message === 'Payroll created successfully') {
        return { success: true, data: response.data.payroll };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Get a single payroll record by ID
  async getSinglePayroll(payrollId: string) {
    try {
      const response = await axios.get(`/api/payroll/${payrollId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.payroll) {
        return { success: true, data: response.data.payroll };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Update a payroll record
  async updatePayroll(payrollId: string, updatedData: any) {
    try {
      const response = await axios.put(`/api/payroll/${payrollId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.payroll) {
        return { success: true, data: response.data.payroll };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Delete a payroll record
  async deletePayroll(payrollId: string) {
    try {
      const response = await axios.delete(`/api/payroll/${payrollId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.message === 'Payroll deleted successfully') {
        return { success: true, data: response.data.payroll };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  }
};