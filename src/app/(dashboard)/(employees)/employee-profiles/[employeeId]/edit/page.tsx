"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Common/Loader';
import { useForm } from 'react-hook-form';
import { EmployeeAddSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Employee } from '@/types/Employee';
import { employeeServices } from '@/services/employeeServices';
import EditEmployee from '@/components/Employee/EditEmployee';



const page = ({ params: { employeeId } }: any) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [imageRemoved, setImageRemoved] = useState(false);
    const router = useRouter();


    const fetchEmployee = async () => {
        setLoading(true);
        const result = await employeeServices.getSingleEmployee(employeeId);
        if (result.success) {
            setEmployee(result.data);
            setLoading(false);
        } else {
            setError(result.message);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchEmployee();
    }, []);


    const onSubmit = async (values: z.infer<typeof EmployeeAddSchema>) => {
        setLoading(true);
        setError(null);

        let formData = new FormData();

        if (values?.profilePhoto && values.profilePhoto[0]) {
            // if new image is uploaded
            const file = values.profilePhoto[0];
            formData.append('updatedImage', file);
            //@ts-ignore
            formData.append('profilePhoto', null);
        } else {
            // if no new image is uploaded
            //@ts-ignore
            formData.append('profilePhoto', employee?.profilePhoto);
            //@ts-ignore
            formData.append('updatedImage', null);
        }

        // if image is removed and no new image is uploaded
        if (imageRemoved && !values?.profilePhoto) {
            formData.delete('profilePhoto');
            formData.delete('updatedImage');
            //@ts-ignore
            formData.append('profilePhoto', null);
            //@ts-ignore
            formData.append('updatedImage', null);
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


        //@ts-ignore
        const { success, data, message } = await employeeServices.updateEmployee(employee?._id, formData);
        if (success) {
            console.log('Update successful:', data);
            toast.success('Employee updated successfully');
            router.push('/employee-profiles');
        } else {
            setError(message);
        }
        setLoading(false);
    };


    return (
        <>
            {loading ? (
                <Loader />
            ) : error ? (
                <div>Employee not found</div>
            ) : (
                <EditEmployee error={error} employee={employee} onSubmit={onSubmit} loading={loading} setImageRemoved={setImageRemoved} />
            )
            }
        </>
    );
}

export default page
