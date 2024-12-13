// types/expense.ts

export type Payroll = {
    employeeId: string; // Refers to the Employee's ObjectId
    baseSalary: number; // Base salary of the employee (minimum 0)
    bonus?: number; // Additional bonus amount (default: 0, minimum: 0)
    deductions?: number; // Deductions from the salary (default: 0, minimum: 0)
    totalSalary: number; // Total salary after calculations
    payDate?: Date | null; // Date when payment is made (default: null)
    payMonth: number; // Month of payment (1-12)
    payYear: number; // Year of payment
    attendanceData?: {
        hoursWorked: number; // Number of hours worked by the employee
    };
    isPaid?: boolean; // Payment status (default: false)
    paymentMethod?: 'Bank transfer' | 'Cash' | 'Cheque' | 'Direct deposit'; // Method of payment (default: 'Bank transfer')
};
export type Payroll2 = {
    employeeId: string; // Refers to the Employee's ObjectId
    baseSalary: number; // Base salary of the employee (minimum 0)
    bonus?: number; // Additional bonus amount (default: 0, minimum: 0)
    deductions?: number; // Deductions from the salary (default: 0, minimum: 0)
    totalSalary: number; // Total salary after calculations
    payDate?: string | null; // Date when payment is made (default: null)
    payMonth: number; // Month of payment (1-12)
    payYear: number; // Year of payment
    attendanceData?: {
        hoursWorked: number; // Number of hours worked by the employee
    };
    isPaid?: boolean; // Payment status (default: false)
    paymentMethod?: 'Bank transfer' | 'Cash' | 'Cheque' | 'Direct deposit'; // Method of payment (default: 'Bank transfer')
};