'use client';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DollarSign, Calendar, FileText, User, EllipsisVertical, Trash, Download } from 'lucide-react';
import { Invoice } from '@/types/Invoice';
import toast from 'react-hot-toast';
import { invoiceServices } from '@/services/invoiceServices';
import LoadingOverlay from '../Common/LoadingOverlay';

const InvoiceCard = ({ invoice, fetchInvoices }: { invoice: Invoice; fetchInvoices: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<null | string>(null);

  // Open delete confirmation modal
  const handleDeleteClick = () => {
    setInvoiceToDelete(invoice.invoiceNumber); // Set the invoice number for confirmation
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    console.log(`Invoice "${invoiceToDelete}" has been deleted.`);
    setLoading(true);
    const result = await invoiceServices.deleteInvoice(invoice._id);
    if (result.success) {
      console.log(result.data);
      toast.success('Invoice Deleted Successfully');
      await fetchInvoices();
      setLoading(false);
    } else {
      toast.error(result.message);
      setLoading(false);
    }
    setIsDeleteModalOpen(false); // Close modal
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // Close modal without deleting
  };

  const handleDownload = async (invoiceId: string) => {
    setLoading(true);
    const result = await invoiceServices.downloadInvoice(invoiceId);
    if (result.success) {
      // toast.success('Invoice Downloaded!');
      setLoading(false);
    } else {
      toast.error(result.message);
      setLoading(false);
    }
  }

  return (
    <div className="">
      {loading && <LoadingOverlay />}
      <Card className="shadow-md relative">
        <div className="absolute top-2 right-2 flex items-center justify-center gap-2">
          <div onClick={() => handleDownload(invoice._id)} className="text-white cursor-pointer w-fit">
            <Download className="w-4 h-4 text-green-500 hover:text-green-600" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className=" text-white">
              <span className="sr-only">Actions</span>
              <EllipsisVertical className="w-5 h-5 text-gray-300 hover:text-blue-500 transition-colors" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute right-0 top-0 bg-gray-800 dark:bg-gray-800 rounded-lg shadow-md">
              <DropdownMenuItem onClick={handleDeleteClick} className="hover:bg-red-600 text-white cursor-pointer">
                <Trash className="mr-2 w-4 h-4 text-red-500" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-t border-gray-700" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-gray-200" />
            <span>{invoice.invoiceNumber}</span>
          </CardTitle>
          <CardDescription>{invoice.clientDetails.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-200" />
              <span className="text-sm text-gray-300">{invoice.clientDetails.company || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-200" />
              <span className="text-sm text-gray-300">
                {new Date(invoice.invoiceDate).toLocaleDateString()}
              </span>
            </div>
            {/* <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-gray-200" />
              <span className="text-sm text-gray-300">SubTotal: {invoice.subTotal ? invoice.subTotal.toFixed(2) : "N/A"}</span>
            </div> */}
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-gray-200" />
              <span className="text-sm text-gray-300">Total: {invoice.total ? invoice.total.toFixed(2) : "N/A"}</span>
            </div>
            <Badge
              className={`text-xs ${invoice.status === 'PAID'
                ? 'bg-green-100 text-green-700'
                : invoice.status === 'OVERDUE'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
                }`}
            >
              {invoice.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="light:bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete the invoice: <strong>{invoiceToDelete}</strong>?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {loading ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceCard;
