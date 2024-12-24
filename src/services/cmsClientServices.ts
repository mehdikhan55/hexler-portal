// /services/cmsClientsServices.ts
import axios from 'axios';

export interface CMSClient {
  _id?: string;
  name: string;
  image: string;
  display: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const cmsClientsServices = {
  // Get all clients
  async getClients() {
    try {
      const response = await axios.get('/api/cms/clients', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.clients) {
        return { success: true, data: response.data.clients };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Get only active clients
  async getActiveClients() {
    try {
      const response = await axios.get('/api/cms/clients/active-clients', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.clients) {
        return { success: true, data: response.data.clients };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Add a new client with image upload
  async addClient(clientData: { name: string, image: File, display?: boolean }) {
    try {
      const formData = new FormData();
      formData.append('name', clientData.name);
      formData.append('image', clientData.image);
      if (clientData.display !== undefined) {
        formData.append('display', String(clientData.display));
      }

      const response = await axios.post('/api/cms/clients', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.client) {
        return { success: true, data: response.data.client };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Get a single client by ID
  async getClient(clientId: string) {
    try {
      const response = await axios.get(`/api/cms/clients/${clientId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.client) {
        return { success: true, data: response.data.client };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Delete a client
  async deleteClient(clientId: string) {
    try {
      const response = await axios.delete(`/api/cms/clients/${clientId}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.data?.client) {
        return { success: true, data: response.data.client };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  },

  // Update client display status
  async updateClientDisplay(clientId: string, display: boolean) {
    try {
      const response = await axios.patch(
        `/api/cms/clients/${clientId}/display`,
        { display },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );

      if (response.data?.client) {
        return { success: true, data: response.data.client };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during the request';
      return { success: false, message: errorMessage };
    }
  }
};