// services/authServices.ts
import axios from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions?: string[];
}

interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions: string[];
}

export const authServices = {
  // Login user
  async login(credentials: LoginCredentials) {
    try {
      const response = await axios.post('/api/auth/login', credentials, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.user) {
        return { success: true, data: response.data.user };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during login';
      return { success: false, message: errorMessage };
    }
  },

  // Register new user (admin only)
  async registerUser(userData: RegisterUserData) {
    try {
      const response = await axios.post('/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.user) {
        return { success: true, data: response.data.user };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during registration';
      return { success: false, message: errorMessage };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.user) {
        return { success: true, data: response.data.user };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while fetching user data';
      return { success: false, message: errorMessage };
    }
  },

  // Logout user
  async logout() {
    try {
      const response = await axios.post('/api/auth/logout', {}, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.message === 'Logout successful') {
        return { success: true };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during logout';
      return { success: false, message: errorMessage };
    }
  },

  // Update user status (active/inactive)
  async updateUserStatus(userId: string, isActive: boolean) {
    try {
      const response = await axios.patch(`/api/auth/users/${userId}/status`,
        { isActive },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );

      if (response.data?.user) {
        return { success: true, data: response.data.user };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while updating user status';
      return { success: false, message: errorMessage };
    }
  },

  // Update user role
  async updateUserRole(userId: string, roleId: string) {
    try {
      const response = await axios.patch(`/api/auth/users/${userId}/role`,
        { roleId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );

      if (response.data?.user) {
        return { success: true, data: response.data.user };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while updating user role';
      return { success: false, message: errorMessage };
    }
  },

  // Reset password (admin only)
  async resetUserPassword(userId: string, newPassword: string) {
    try {
      const response = await axios.post(`/api/auth/users/${userId}/reset-password`,
        { password: newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );

      if (response.data?.message === 'Password reset successful') {
        return { success: true };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while resetting password';
      return { success: false, message: errorMessage };
    }
  },

  // Get all users (admin only)
  async getUsers() {
    try {
      const response = await axios.get('/api/auth/users', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.users) {
        return { success: true, data: response.data.users };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while fetching users';
      return { success: false, message: errorMessage };
    }
  },
  // Get user by ID (admin only)
  async getUserById(userId: string) {
    try {
      const response = await axios.get(`/api/auth/users/${userId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.user) {
        return { success: true, data: response.data.user };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while fetching user data';
      return { success: false, message: errorMessage };
    }
  },
  // Update user data (admin only)
  async updateUser(userId: string, userData: User) {
    try {
      const response = await axios.patch(`/api/auth/users/${userId}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.user) {
        return { success: true, data: response.data.user };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while updating user data';
      return { success: false, message: errorMessage };
    }
  },
  // Delete user (admin only)
  async deleteUser(userId: string) {
    try {
      const response = await axios.delete(`/api/auth/users/${userId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.message === 'User deleted') {
        return { success: true };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while deleting user';
      return { success: false, message: errorMessage };
    }
  },
  // Get available roles (admin only)
  async getRoles() {
    try {
      const response = await axios.get('/api/auth/roles', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.roles) {
        return { success: true, data: response.data.roles };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while fetching roles';
      return { success: false, message: errorMessage };
    }
  },

  // Get single role
  async getRole(roleId: string) {
    try {
      const response = await axios.get(`/api/auth/roles/${roleId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.role) {
        return { success: true, data: response.data.role };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while fetching role';
      return { success: false, message: errorMessage };
    }
  },

  // Create new role
  async createRole(roleData: Omit<Role, '_id'>) {
    try {
      const response = await axios.post('/api/auth/roles', roleData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.role) {
        return { success: true, data: response.data.role };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while creating role';
      return { success: false, message: errorMessage };
    }
  },

  // Update role
  async updateRole(roleId: string, roleData: Partial<Role>) {
    try {
      const response = await axios.put(`/api/auth/roles/${roleId}`, roleData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.role) {
        return { success: true, data: response.data.role };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while updating role';
      return { success: false, message: errorMessage };
    }
  },

  // Delete role
  async deleteRole(roleId: string) {
    try {
      const response = await axios.delete(`/api/auth/roles/${roleId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.message === 'Role deleted successfully') {
        return { success: true, data: response.data.role };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while deleting role';
      return { success: false, message: errorMessage };
    }
  },

  // Update role permissions
  async updateRolePermissions(roleId: string, permissions: string[]) {
    try {
      const response = await axios.put(`/api/auth/roles/${roleId}`,
        { permissions },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );

      if (response.data?.role) {
        return { success: true, data: response.data.role };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while updating role permissions';
      return { success: false, message: errorMessage };
    }
  },

  // Check if role name is available
  async checkRoleNameAvailability(name: string) {
    try {
      const response = await axios.get(`/api/auth/roles/check-name/${encodeURIComponent(name)}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      return { success: true, data: response.data.available };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while checking role name';
      return { success: false, message: errorMessage };
    }
  },

  // Get all permissions
  async getPermissions() {
    try {
      const response = await axios.get('/api/auth/permissions', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.permissions) {
        return { success: true, data: response.data.permissions };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while fetching permissions';
      return { success: false, message: errorMessage };
    }
  },

  // Get single permission
  async getPermissionById(permissionId: string) {
    try {
      const response = await axios.get(`/api/auth/permissions/${permissionId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.permission) {
        return { success: true, data: response.data.permission };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while fetching permission';
      return { success: false, message: errorMessage };
    }
  },

  // Create new permission
  async createPermission(permissionData: {
    name: string;
    description?: string;
  }) {
    try {
      const response = await axios.post('/api/auth/permissions', permissionData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.permission) {
        return { success: true, data: response.data.permission };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while creating permission';
      return { success: false, message: errorMessage };
    }
  },

  // Update permission
  async updatePermission(permissionId: string, updateData: {
    name?: string;
    description?: string;
  }) {
    try {
      const response = await axios.put(`/api/auth/permissions/${permissionId}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.permission) {
        return { success: true, data: response.data.permission };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while updating permission';
      return { success: false, message: errorMessage };
    }
  },

  // Delete permission
  async deletePermission(permissionId: string) {
    try {
      const response = await axios.delete(`/api/auth/permissions/${permissionId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.message === 'Permission deleted successfully') {
        return { success: true, data: response.data.permission };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while deleting permission';
      return { success: false, message: errorMessage };
    }
  },


};
