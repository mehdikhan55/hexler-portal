app/
  api/
    auth/
      users/
        [userId]/
          route.ts
          status/
            route.ts
          role/
            route.ts
          reset-password/
            route.ts
        route.ts
      roles/
        route.ts

        


<!-- routes for client management in website cms to show clients on company website through portal -->
routes for frontend
/cms/clients - D
/cms/clients/new -D

backend apis
/api/clients : GET - D
/api/clients : POST - D
/api/clients/[id] : GET - D
/api/clients/[id] : DELETE - D


cmsClientsServices.tsx

1- CTO will confirm completion of project in projects list(by getting projects from the following GET api and these will be those who has projectStatus value to COMPLETED) by setting projectStatus value to ALL_STAGES_COMPLETED
APIs:
/api/manage-projects/completion-confirmation : GET
/api/manage-projects/completion-confirmation : PATCH

frontend routes:
/project-completion-confirmation

2- After CTO approval CFO sees that project in project list(by getting projects from the following GET api and these will be those who has projectStatus value to ALL_STAGES_COMPLETED) in Project Payments section where he can update the paymentStatus of project as ["PENDING", "RECIEVED", "NOT_RECIEVED"]
APIs:
/api/manage-projects/payment-status : GET
/api/manage-projects/payment-status : PATCH

frontend routes:
/project-payments


APIs: D

/api/cms/clients : GET - D
/api/cms/clients : POST - D
/api/cms/clients/active-clients : POST - D
/api/cms/clients/[id] : GET - D
/api/cms/clients/[id] : DELETE - D
/api/cms/clients/[id]/display : PATCH - D

/api/manage-projects/completion-confirmation : GET
/api/manage-projects/completion-confirmation : PATCH

/api/manage-projects/payment-status : GET
/api/manage-projects/payment-status : PATCH

/api/manage-projects/closed-projects : GET
/api/manage-projects/closed-projects : PATCH



Frontend Routes:D
/cms/clients 
/cms/clients/new 

/project-completion-confirmation

/project-payments

/closed-projects













'use client'
import React, { useEffect } from 'react';
import { Form, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import CustomFormField, { FormFieldType } from '@/components/Form Reusables/CustomFormField';
import { SelectItem } from '@/components/ui/select';
import DatePicker from "@/components/Expense/date-picker-demo";
import { Employee } from '@/types/Employee';
import { UseFormReturn } from 'react-hook-form';
import {  PayrollAddSchema2 } from '@/lib/validations';
import { z } from 'zod';

interface AddPayrollFormProps {
    employees: Employee[];
    form: UseFormReturn<z.infer<typeof PayrollAddSchema2>>;
    onSubmit: (values: z.infer<typeof PayrollAddSchema2>) => Promise<void>;
    loading: boolean;
}

const EditPayrollForm = ({ employees, form, onSubmit, loading }: AddPayrollFormProps) => {
    // Watch all required values
    const selectedEmployeeId = form.watch('employeeId');
    const baseSalary = form.watch('baseSalary') || 0;
    const bonus = form.watch('bonus') || 0;
    const deductions = form.watch('deductions') || 0;

    // First useEffect: Handle employee selection and base salary
    useEffect(() => {
        if (selectedEmployeeId) {
            const selectedEmployee = employees.find(emp => emp._id === selectedEmployeeId);
            if (selectedEmployee) {
                form.setValue('baseSalary', Number(selectedEmployee.salary), {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                });
            }
        }
    }, [selectedEmployeeId, employees, form]);

    // Second useEffect: Handle total salary calculations
    useEffect(() => {
        const totalSalary = baseSalary + bonus - deductions;
        
        form.setValue('totalSalary', totalSalary, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        });
    }, [baseSalary, bonus, deductions, form]);


    return (
        <div className="w-full max-w-4xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="employeeId"
                            label="Employee"
                            placeholder="Select employee"
                        >
                            {employees?.map((employee) => (
                                <SelectItem key={employee._id} value={employee._id}>
                                    {`${employee.firstName} ${employee.lastName}`}
                                </SelectItem>
                            ))}
                        </CustomFormField>

                        <CustomFormField
                            fieldType={FormFieldType.NUMBER}
                            control={form.control}
                            name="baseSalary"
                            label="Base Salary"
                            placeholder="Enter base salary"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomFormField
                            fieldType={FormFieldType.NUMBER}
                            control={form.control}
                            name="bonus"
                            label="Bonus"
                            placeholder="Enter bonus amount"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.NUMBER}
                            control={form.control}
                            name="deductions"
                            label="Deductions"
                            placeholder="Enter deductions"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium">Pay Date</label>
                            <CustomFormField
                                fieldType={FormFieldType.SKELETON}
                                control={form.control}
                                name="payDate"
                                renderSkeleton={(field) => (
                                    <FormControl>
                                        <DatePicker
                                            selectedDate={field.value ? new Date(field.value) : null}
                                            // @ts-ignore
                                            onDateChange={(date) => {
                                                if (date) {
                                                    // Format date for MongoDB (ISO string)
                                                    field.onChange(date.toISOString());
                                                }
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            id="pay-date-picker"
                                        />
                                    </FormControl>
                                )}
                            />
                        </div>

                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="paymentMethod"
                            label="Payment Method"
                            placeholder="Select payment method"
                        >
                            <SelectItem value="Bank transfer">Bank Transfer</SelectItem>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Cheque">Cheque</SelectItem>
                            <SelectItem value="Direct deposit">Direct Deposit</SelectItem>
                        </CustomFormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomFormField
                            fieldType={FormFieldType.NUMBER}
                            control={form.control}
                            name="payMonth"
                            label="Pay Month (1-12)"
                            placeholder="Enter pay month"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="payYear"
                            label="Pay Year"
                            placeholder="Enter pay year"
                        >
                            {years.map((year) => (
                                <SelectItem key={year.value} value={year.value}>
                                    {year.label}
                                </SelectItem>
                            ))}
                        </CustomFormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomFormField
                            fieldType={FormFieldType.NUMBER}
                            control={form.control}
                            name="attendanceData.hoursWorked"
                            label="Hours Worked"
                            placeholder="Enter hours worked"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.NUMBER}
                            control={form.control}
                            name="totalSalary"
                            label="Total Salary"
                            placeholder="Enter total salary"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name="isPaid"
                            label="Mark as Paid"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Processing...' : 'Update Payroll Record'}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default EditPayrollForm;

const years = [
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" }
];