'use client'
import { EmployeeAddSchema, PayrollAddSchema2 } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Employee } from '@/types/Employee';
import { Payroll2 } from '@/types/Payroll';
import EditPayrollForm from './EditPayrollForm';

interface EditPayrollProps {
    onSubmit: (values: z.infer<typeof PayrollAddSchema2>) => Promise<void>;
    loading: boolean;
    payroll: Payroll2 | null;
    error: string | null;
    employees: Employee[];
}

const EditPayroll = ({ onSubmit, loading, payroll, error , employees}: EditPayrollProps) => {

    const form = useForm<z.infer<typeof PayrollAddSchema2>>({
        resolver: zodResolver(PayrollAddSchema2),
        defaultValues: {
            //@ts-ignore
            employeeId: payroll?.employeeId._id || '',
            baseSalary: payroll?.baseSalary || 0,
            bonus: payroll?.bonus || 0,
            deductions: payroll?.deductions || 0,
            totalSalary: payroll?.totalSalary || 0,
            payDate: payroll?.payDate || null,
            payMonth: payroll?.payMonth || 1,
            payYear: payroll?.payYear.toString() || new Date().getFullYear().toString(),
            attendanceData: {
                hoursWorked: payroll?.attendanceData?.hoursWorked || 0
            },
            isPaid: payroll?.isPaid || false,
            paymentMethod: payroll?.paymentMethod || 'Bank transfer'
        }
    });


    return (
        <div>
            <div className="py-2 pb-4">

                <EditPayrollForm
                    form={form}
                    employees={employees}
                    onSubmit={onSubmit}
                    loading={loading}
                />

                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
        </div>
    )
}

export default EditPayroll


/*
const PayrollAddSchema2 = z.object({
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
    payDate: z.string().nullable().optional(),
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

