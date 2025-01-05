// services/invoiceServices.ts
import { Invoice } from '@/types/Invoice';
import axios from 'axios';



export const invoiceServices = {
  // Create new invoice
  async generateInvoice(Invoice: Partial<Invoice>) {
    try {
      const response = await axios.post('/api/invoices', Invoice, {
        responseType: 'blob', // Important for receiving PDF data
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        }
      });

      // Create a URL for the PDF blob
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(pdfBlob);

      // Create an anchor tag to trigger the download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = response.headers['content-disposition'].split('filename=')[1].replace(/"/g, ''); // Use filename from headers
      document.body.appendChild(link); // Append the link to the body
      link.click(); // Trigger the download
      document.body.removeChild(link); // Clean up

      // Revoke the object URL after the download is triggered
      window.URL.revokeObjectURL(pdfUrl);

      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during invoice generation';
      return { success: false, message: errorMessage };
    }
  },

  // Get all invoices
  async getInvoices(filters?: { status?: 'PENDING' | 'PAID' | 'OVERDUE' }) {
    try {
      let url = '/api/invoices';
      if (filters?.status) {
        url += `?status=${filters.status}`;
      }

      const response = await axios.get(url);

      if (response.data?.invoices) {
        return { success: true, data: response.data.invoices };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while fetching invoices';
      return { success: false, message: errorMessage };
    }
  },

  // Get single invoice
  async getInvoice(invoiceId: string) {
    try {
      const response = await axios.get(`/api/invoices/${invoiceId}`);

      if (response.data?.invoice) {
        return { success: true, data: response.data.invoice };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while fetching the invoice';
      return { success: false, message: errorMessage };
    }
  },

  // Update invoice
  async updateInvoice(invoiceId: string, updateData: Partial<Invoice>) {
    try {
      const response = await axios.put(`/api/invoices/${invoiceId}`, updateData);

      if (response.data?.invoice) {
        return { success: true, data: response.data.invoice };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while updating the invoice';
      return { success: false, message: errorMessage };
    }
  },

  // Delete invoice
  async deleteInvoice(invoiceId: string) {
    try {
      const response = await axios.delete(`/api/invoices/${invoiceId}`);

      if (response.data?.message) {
        return { success: true, data: response.data.invoice };
      }
      throw new Error(response.data?.message || 'Unexpected response from server');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while deleting the invoice';
      return { success: false, message: errorMessage };
    }
  },

  // Download invoice PDF
  async downloadInvoice(invoiceId: string) {
    try {
      const response = await axios.get(`/api/invoices/${invoiceId}/pdf`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });

      // Create a URL for the PDF blob
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(pdfBlob);

      // Trigger download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(pdfUrl);

      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred while downloading the invoice';
      return { success: false, message: errorMessage };
    }
  }
};