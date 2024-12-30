// /services/projectManagementServices.ts
import axios from 'axios';

export interface ProjectModule {
  moduleName: string;
  description: string;
  deadline: Date;
}

export interface Project {
  _id?: string;
  projectName: string;
  projectDescription: string;
  projectStatus: 'PENDING' | 'CANCELLED' | 'ACTIVE' | 'COMPLETED' | 'ALL_STAGES_COMPLETED' | 'INACTIVE';
  paymentStatus?: 'PENDING' | 'RECIEVED' | 'NOT_RECIEVED';
  sendForApproval: boolean;
  budget: {
    amount: number | null;
    currency: string;
  };
  approvedByFinance: boolean;
  modules: ProjectModule[];
  createdAt?: string;
  updatedAt?: string;
}

export const projectManagementServices = {
  // Get all projects with optional filters
  async getProjects(filters?: { isActive?: boolean; projectStatus?: string }) {
    try {
      let url = '/api/manage-projects';
      if (filters) {
        const params = new URLSearchParams();
        if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
        if (filters.projectStatus) params.append('projectStatus', filters.projectStatus);
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.projects) {
        return { success: true, data: response.data.projects };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Add a new project
  async addProject(projectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await axios.post('/api/manage-projects', projectData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.project) {
        return { success: true, data: response.data.project };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Get a single project by ID
  async getProject(projectId: string) {
    try {
      const response = await axios.get(`/api/manage-projects/${projectId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.project) {
        return { success: true, data: response.data.project };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Update a project
  async updateProject(projectId: string, updatedData: Partial<Project>) {
    try {
      const response = await axios.put(`/api/manage-projects/${projectId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.project) {
        return { success: true, data: response.data.project };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Delete a project
  async deleteProject(projectId: string) {
    try {
      const response = await axios.delete(`/api/manage-projects/${projectId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.project) {
        return { success: true, data: response.data.project };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Get projects pending approval
  async getProjectsPendingApproval() {
    try {
      const response = await axios.get('/api/manage-projects/pending-approval', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.projects) {
        return { success: true, data: response.data.projects };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Approve project budget
  async approveProjectBudget(projectId: string, updatedBudget: { amount: number; currency: string } | null) {
    try {
      const response = await axios.patch(`/api/manage-projects/${projectId}/approve-budget`,
        { updatedBudget },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );

      if (response.data?.project) {
        return { success: true, data: response.data.project };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },


  // Get projects pending CTO completion confirmation
  async getProjectsPendingCompletion() {
    try {
      const response = await axios.get('/api/manage-projects/completion-confirmation', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.projects) {
        return { success: true, data: response.data.projects };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  async updateProjectStatus(
    projectId: string,
    projectStatus: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'COMPLETED' | 'ALL_STAGES_COMPLETED'
  ) {
    try {
      const response = await axios.patch(
        '/api/manage-projects/completion-confirmation',
        { projectId, projectStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );

      if (response.data?.project) {
        return { success: true, data: response.data.project };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Get projects pending payment status update (CFO)
  async getProjectsForPaymentStatus() {
    try {
      const response = await axios.get('/api/manage-projects/payment-status', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.projects) {
        return { success: true, data: response.data.projects };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Update project payment status (CFO)
  async updateProjectPaymentStatus(
    projectId: string,
    paymentStatus: 'PENDING' | 'RECIEVED' | 'NOT_RECIEVED'
  ) {
    try {
      const response = await axios.patch(
        '/api/manage-projects/payment-status',
        { projectId, paymentStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );

      if (response.data?.project) {
        return { success: true, data: response.data.project };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  async closeProjectSuccessfully(projectId: string) {
    try {
      const response = await axios.patch(
        '/api/manage-projects/closed-projects',
        {projectId},
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );

      if (response.data?.project) {
        return { success: true, data: response.data.project };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },
  async getClosedProjects() {
    try {
      let url = '/api/manage-projects/closed-projects';
      // if (filters) {
      //   const params = new URLSearchParams();
      //   if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
      //   if (filters.projectStatus) params.append('projectStatus', filters.projectStatus);
      //   url += `?${params.toString()}`;
      // }

      const response = await axios.get(url, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.projects) {
        return { success: true, data: response.data.projects };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  }

};