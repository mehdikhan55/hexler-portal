"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useState, useEffect } from 'react'
import { fetchExpenses } from '@/lib/utils/fetchExpenses'
import { Button } from "@/components/ui/button";
import PayrollTable from "@/components/Payroll/PayrollTable";
import { Payroll } from "@/types/Payroll";
import { payrollServices } from "@/services/payrollServices";
import { useRouter } from "next/navigation";
import PayrollDetails from "@/components/Payroll/PayrollDetails";
import toast from "react-hot-toast";

// /payroll

const Page = () => {
  const [data, setData] = useState<Payroll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayrollData, setShowPayrollData] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [payrollToDelete, setPayrollToDelete] = useState<null | string>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  // Fetch initial data
  const loadData = async () => {
    setIsLoading(true);
    const result = await payrollServices.getPayrolls();

    if (result.success) {
      //@ts-ignore
      setData(result.data);
      console.log("Fetched payrolls", result.data);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePayrollClose = () => setShowPayrollData(false);
  const handlePayrollShow = (payroll: any) => {
    setSelectedPayroll(payroll);
    setShowPayrollData(true);
  };
  const handleAddRecord = () => {
    router.push("payroll/create")
  }

  const handleEditPayroll = (payrollId: string) => {
    router.push(`payroll/edit/${payrollId}`)
  }

  const handleDeletePayroll = async (payrollId: string) => {
    setPayrollToDelete(payrollId); // Set the project name for confirmation
    setIsDeleteModalOpen(true);
  }

  // Confirm delete
  const handleConfirmDelete = async () => {
    console.log(`Payroll "${payrollToDelete}" has been deleted.`);
    setLoading(true);
    // @ts-ignore
    const result = await payrollServices.deletePayroll(payrollToDelete);
    if (result.success) {
      console.log(result.data);
      toast.success("Payroll Deleted Successfully");
      await loadData();
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

  return (
    <div>
      <h1>Payroll</h1>
      <div className="text-end">
        <Button onClick={handleAddRecord} className="bg-green-500">
          Add New Record
        </Button>
      </div>
      <PayrollTable
        data={data}
        isLoading={isLoading}
        handlePayrollShow={handlePayrollShow}
        handleEditPayroll={handleEditPayroll}
        handleDeletePayroll={handleDeletePayroll}
      />

      <Dialog open={showPayrollData} onOpenChange={handlePayrollClose} >
        <DialogContent className="max-w-full max-h-[80vh] sm:max-w-5xl overflow-y-auto z-50">
          <DialogHeader>
            <DialogTitle>Payroll Details</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="spinner spinner-primary"></div>
            </div>
          ) : (
            <PayrollDetails payroll={selectedPayroll} />
          )}
        </DialogContent>
      </Dialog>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="light:bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete the payroll: <strong>{payrollToDelete}</strong>?
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
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page;
