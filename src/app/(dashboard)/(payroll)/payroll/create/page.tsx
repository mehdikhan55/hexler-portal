'use client';
import {  PayrollAddSchema, PayrollAddSchema2 } from '@/lib/validations';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';

import { useRouter } from 'next/navigation';
import Loader from '@/components/Common/Loader';
import { employeeServices } from '@/services/employeeServices';
import AddPayrollForm from '@/components/Payroll/AddPayrollForm';
import { payrollServices } from '@/services/payrollServices';
import toast from 'react-hot-toast';


// /payroll/create
const Page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeeError, setEmployeeError] = useState(null);

  const form = useForm<z.infer<typeof PayrollAddSchema2>>({
    resolver: zodResolver(PayrollAddSchema2),
    defaultValues: {
      employeeId: '',
      baseSalary: 0,
      bonus: 0,
      deductions: 0,
      totalSalary: 0,
      payDate: null,
      payMonth: 1,
      payYear: new Date().getFullYear().toString(),
      attendanceData: {
        hoursWorked: null
      },
      isPaid: false,
      paymentMethod: 'Bank transfer'
    }
  });


  const fetchEmployees = async () => {
    const result = await employeeServices.getEmployees();
    if (result.success) {
      setEmployees(result.data);
      console.log("Fetched employees", result.data);
    } else {
      setEmployeeError(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);


  const onSubmit = async (values: z.infer<typeof PayrollAddSchema2>) => {
    setLoading(true);
    setError(null);
    console.log('Submitting payroll:', values);

    const payrollData={
      ...values,
      payYear: parseInt(values.payYear)
    }

    const { success, data, message } = await payrollServices.addPayroll(payrollData);
    if (success) {
      console.log('Upload successful:', data);
      toast.success('Payroll added successfully');
      form.reset();
      router.push('/payroll');
    } else {
      setError(message);
    }
    setLoading(false);
  };


  return (
    <div className="py-2 pb-4">
      <h1>Add New Payroll Record</h1>
      {isLoading ? (
        <Loader />
      ) : (
        employeeError ? (
          <p className="text-red-600">Error getting employees: {employeeError}</p>
        ) : (
          <>
            <AddPayrollForm
              form={form}
              onSubmit={onSubmit}
              loading={loading}
              employees={employees}
            />
          </>
        )
      )
      }

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};
export default Page;

/*
const PayrollAddSchema = z.object({
    employeeId: z.string().uuid('Invalid employee ID format'),
    baseSalary: z.number()
        .min(0, 'Base salary must be at least 0'),
    bonus: z.number()
        .min(0, 'Bonus must not be negative')
        .default(0),
    deductions: z.number()
        .min(0, 'Deductions must not be negative')
        .default(0),
    totalSalary: z.number()
        .min(0, 'Total salary must be at least 0'),
    payDate: z.date().nullable().optional(),
    payMonth: z.number()
        .min(1, 'Pay month must be between 1 and 12')
        .max(12, 'Pay month must be between 1 and 12'),
    payYear: z.number()
        .min(1900, 'Pay year must be a valid year')
        .max(new Date().getFullYear(), 'Pay year cannot be in the future'),
    attendanceData: z.object({
        hoursWorked: z.number()
            .min(0, 'Hours worked must not be negative')
    }).optional(),
    isPaid: z.boolean().default(false),
    paymentMethod: z.enum(['Bank transfer', 'Cash', 'Cheque', 'Direct deposit'])
        .default('Bank transfer')
});
*/
