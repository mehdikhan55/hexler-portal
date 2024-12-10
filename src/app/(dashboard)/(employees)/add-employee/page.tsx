'use client';
import { EmployeeAddSchema } from '@/lib/validations';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';

import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Common/Loader';
import AddEmployeeForm from '@/components/Employee/AddEmployeeForm';
import { employeeServices } from '@/services/employeeServices';



const Page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof EmployeeAddSchema>>({
    resolver: zodResolver(EmployeeAddSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      profilePhoto: null,
      phoneNumber: '',
      dateOfBirth: '',
      hireDate: '',
      position: '',
      status: 'active',
      address: {
        street: '',
        city: '',
        state: '',
        zip: ''
      },
      department: '',
      salary: 0
    }
  });


  const onSubmit = async (values: z.infer<typeof EmployeeAddSchema>) => {
    setLoading(true);
    setError(null);
    console.log('Submitting employee:', values);

    let formData = new FormData();

    // Handle profile photo
    if (values.profilePhoto && values.profilePhoto[0]) {
      formData.append('profilePhoto', values.profilePhoto[0]);
    }

    // Append required fields
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('email', values.email);
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('hireDate', values.hireDate);
    formData.append('position', values.position);
    formData.append('status', values.status);
    formData.append('salary', values.salary.toString());

    // Handle optional fields - explicitly pass 'null' if empty
    formData.append('dateOfBirth', values.dateOfBirth || 'null');
    formData.append('department', values.department || 'null');

    // Handle address object - pass 'null' for empty values
    formData.append('address[street]', values.address?.street || 'null');
    formData.append('address[city]', values.address?.city || 'null');
    formData.append('address[state]', values.address?.state || 'null');
    formData.append('address[zip]', values.address?.zip || 'null');


    const { success, data, message } = await employeeServices.addEmployee(formData);

    if (success) {
      console.log('Upload successful:', data);
      toast.success('Employee added successfully');
      form.reset();
      router.push('/employee-profiles');
    } else {
      setError(message);
    }

    setLoading(false);
  };


  return (
    <div className="py-2 pb-4">
      <h1>Add New Employee</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <AddEmployeeForm form={form} onSubmit={onSubmit} loading={loading} />
      )}

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};
export default Page;
