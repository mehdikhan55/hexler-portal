'use client';
import { PayrollAddSchema2 } from '@/lib/validations';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';

import { useRouter } from 'next/navigation';
import Loader from '@/components/Common/Loader';
import { employeeServices } from '@/services/employeeServices';
import { payrollServices } from '@/services/payrollServices';
import toast from 'react-hot-toast';
import EditPayroll from '@/components/Payroll/EditPayroll';


// /payroll/edit/[payrollId]
const Page = ({ params: { payrollId } }: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [payroll, setPayroll] = useState(null);
  const [payrollError, setPayrollError] = useState(null);
  const [employeeError, setEmployeeError] = useState(null);

  const fetchPayroll = async () => {
    setLoading(true)
    const result = await payrollServices.getSinglePayroll(payrollId);
    if (result.success) {
      setPayroll(result.data);
      console.log("Fetched payroll", result.data);
      await fetchEmployees();
    } else {
      console.log('Error fetching payroll', result.message);
      setPayrollError(result.message);
    }
    setLoading(false);
  };

  const fetchEmployees = async () => {
    const result = await employeeServices.getEmployees();
    if (result.success) {
      setEmployees(result.data);
      console.log("Fetched employees", result.data);
    } else {
      setEmployeeError(result.message);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);




  const onSubmit = async (values: z.infer<typeof PayrollAddSchema2>) => {
    setLoading(true);
    setError(null);
    console.log('Submitting payroll:', values);

    const payrollData = {
      ...values,
      payYear: parseInt(values.payYear)
    }

    const { success, data, message } = await payrollServices.updatePayroll(payrollId, payrollData);
    if (success) {
      console.log('Upload successful:', data);
      toast.success('Payroll Updated successfully');
      router.push('/payroll');
    } else {
      setError(message);
    }
    setLoading(false);
  };


  return (
    <div className="py-2 pb-4">
      <h1>Edit Payroll Record: {payrollId}</h1>
      {loading ? (
        <Loader />
      ) : (
        payrollError ? (
          <p className="text-red-600">Error getting payroll data </p>
        ) : (
          employeeError ? (
            <p className="text-red-600">Error getting employees data</p>
          ) : (
            <>
              <EditPayroll error={error} payroll={payroll} employees={employees} onSubmit={onSubmit} loading={loading} />
            </>
          )
        )
      )
      }

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};
export default Page;

