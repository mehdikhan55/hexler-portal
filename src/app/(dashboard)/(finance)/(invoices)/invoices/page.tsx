'use client';
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import InvoiceCard from '@/components/invoice/InvoiceCard';
import { invoiceServices } from '@/services/invoiceServices';
import { Invoice } from '@/types/Invoice';
import React, { useEffect, useState } from 'react';

import toast from 'react-hot-toast';

const Page = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async (): Promise<void> => {
    try {
      const result = await invoiceServices.getInvoices();
      if (result.success) {
        setInvoices(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch invoices');
      }
    } catch (error) {
      toast.error('Error fetching invoices');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {invoices.map((invoice: Invoice,index) => (
       <InvoiceCard key={index} invoice={invoice} fetchInvoices={fetchInvoices} />
      ))}
    </div>
  );
};

export default Page;
