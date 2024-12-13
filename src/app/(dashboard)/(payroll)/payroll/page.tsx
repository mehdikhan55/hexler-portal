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

// /payroll

const Page = () => {
  const [data, setData] = useState<Payroll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayrollData, setShowPayrollData] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
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
  }

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
    </div>
  )
}

export default Page;
