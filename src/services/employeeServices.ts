import axios from 'axios';

//employeeServices.ts
export const employeeServices = {
    async getEmployees() {
        try {
            const response = await axios.get('/api/employees', {
                headers: {
                    'Cache-Control': 'no-store',
                    'Pragma': 'no-cache',
                    'Expires': '0'

                }
            });
            if (response.data?.employees) {
                return { success: true, data: response.data.employees };
            }
            throw new Error(response.data?.message || 'Unexpected response from server');
        }
        catch (error: any) {
            const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
            return { success: false, message: errorMessage };
        }
    },
    async addEmployee(employeeData: any) {
        try {
            const response = await axios.post('/api/employees/add', employeeData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Cache-Control': 'no-store',
                    'Pragma': 'no-cache',
                    'Expires': '0'

                },
            });

            if (response.data?.message === 'Employee created successfully') {
                return { success: true, data: response.data };
            } else {
                throw new Error(response.data?.message || 'Unexpected response from server');
            }
        } catch (error: any) {
            // Handle specific errors
            const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
            return { success: false, message: errorMessage };
        }
    },
    async getSingleEmployee(employeeId: string) {
        try {
            const response = await axios.get(`/api/employees/${employeeId}`, {
                headers: {
                    'Cache-Control': 'no-store',
                    'Pragma': 'no-cache',
                    'Expires': '0'

                }
            });

            if (response.data?.employee) {
                return { success: true, data: response.data.employee };
            }
            throw new Error(response.data?.message || 'Unexpected response from server');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
            return { success: false, message: errorMessage };
        }
    },
    async updateEmployee(employeeId: string, updatedData: any) {
        try {
            const response = await axios.put(`/api/employees/${employeeId}`, updatedData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Cache-Control': 'no-store',
                    'Pragma': 'no-cache',
                    'Expires': '0'

                }
            });

            if (response.data?.employee) {
                return { success: true, data: response.data.employee };
            }
            throw new Error(response.data?.message || 'Unexpected response from server');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
            return { success: false, message: errorMessage };
        }
    },
    async deleteEmployee(employeeId: string) {
        try {
            const response = await axios.delete(`/api/employees/${employeeId}`, {
                headers: {
                    'Cache-Control': 'no-store',
                    'Pragma': 'no-cache',
                    'Expires': '0'

                }
            });

            if (response.data?.employee) {
                return { success: true, data: response.data.employee };
            } else {
                throw new Error(response.data?.message || 'Unexpected response from server');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
            return { success: false, message: errorMessage };
        }
    },
}