import axios from 'axios';
import { headers } from 'next/headers';

export const projectServices = {
  async getProjects() {
    try {
      const response = await axios.get('/api/projects', {
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
    }
    catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  async addProject(projectData: any) {
    try {
      const response = await axios.post('/api/projects/add', projectData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'

        },
      });

      if (response.data?.message === 'Project created successfully') {
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
  // Fetch a single project by its ID
  async getSingleProject(projectId: string) {
    try {
      const response = await axios.get(`/api/projects/${projectId}`, {
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

  // Edit a project (update its data)
  async updateProject(projectId: string, updatedData: any) {
    try {
      const response = await axios.put(`/api/projects/${projectId}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'

        }
      },
        updatedData);

      if (response.data?.project) {
        return { success: true, data: response.data.project };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },
  async deleteProject(projectId: string) {
    try {
      const response = await axios.delete(`/api/projects/${projectId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'

        }
      });

      if (response.data?.project) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || 'Unexpected response from server');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },
};
