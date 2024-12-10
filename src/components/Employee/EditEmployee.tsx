'use client'
import { EmployeeAddSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import EditEmployeeForm from './EditEmployeeForm';
import { Employee } from '@/types/Employee';

interface EditEmployeeProps {
    onSubmit: (values: z.infer<typeof EmployeeAddSchema>) => Promise<void>;
    loading: boolean;
    employee: Employee | null;
    error: string | null;
    setImageRemoved: (value: boolean) => void;
  }

const EditEmployee = ({ onSubmit, loading, employee, error, setImageRemoved }: EditEmployeeProps) => {
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

    useEffect(() => {
        //@ts-ignore
        setProfilePhoto(employee?.profilePhoto);
    }, []);

    const form = useForm<z.infer<typeof EmployeeAddSchema>>({
        resolver: zodResolver(EmployeeAddSchema),
        defaultValues: {
            firstName: employee?.firstName || '',
            lastName: employee?.lastName || '',
            email: employee?.email || '',
            profilePhoto: null,
            //@ts-ignore
            updatedImage: null,
            phoneNumber: employee?.phoneNumber || '',
            dateOfBirth: employee?.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '',
            hireDate: employee?.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
            position: employee?.position || '',
            status: employee?.status || 'active',
            address: {
                street: employee?.address?.street || '',
                city: employee?.address?.city || '',
                state: employee?.address?.state || '',
                zip: employee?.address?.zip || ''
            },
            department: employee?.department || '',
            salary: employee?.salary || 0
        }
    });


    return (
        <div>
            <div className="py-2 pb-4">
                <h1>Edit Employee: {employee?.firstName} {employee?.lastName}</h1>

                <EditEmployeeForm
                    form={form}
                    onSubmit={onSubmit}
                    loading={loading}
                    buttonText="Update"
                    profilePhoto={profilePhoto}
                    setProfilePhoto={setProfilePhoto}
                    setImageRemoved={setImageRemoved} />

                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
        </div>
    )
}

export default EditEmployee
