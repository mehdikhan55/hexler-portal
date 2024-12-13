import React from 'react';
import { commonServices } from '@/services/commonServices';

const PayrollDetails = ({ payroll }: any) => {
  if (!payroll) return null;

  const employee = payroll.employeeId;
  const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';

  const PayrollSection = ({ title, children }: any) => (
    <div className="border rounded-lg shadow-sm bg-gray-800 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, className = "" }: any) => (
    <div className={`flex justify-between py-2 border-b border-gray-100 ${className}`}>
      <span className="text-gray-200">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{employeeName}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-200">
          <span className="flex items-center">
            <span className="mr-2">●</span>
            ID: {payroll._id}
          </span>
          <span className="flex items-center">
            <span className="mr-2">●</span>
            Status: {payroll.isPaid ? 
              <span className="text-green-600 font-medium">Paid</span> : 
              <span className="text-amber-600 font-medium">Pending</span>
            }
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Salary Details */}
        <PayrollSection title="Salary Information">
          <div className="space-y-2">
            <InfoRow 
              label="Base Salary" 
              value={`$${payroll.baseSalary.toFixed(2)}`} 
            />
            <InfoRow 
              label="Bonus" 
              value={`$${(payroll.bonus || 0).toFixed(2)}`}
              className="text-green-600"
            />
            <InfoRow 
              label="Deductions" 
              value={`$${(payroll.deductions || 0).toFixed(2)}`}
              className="text-red-600"
            />
            <InfoRow 
              label="Total Salary" 
              value={`$${payroll.totalSalary.toFixed(2)}`}
              className="font-bold text-lg pt-2"
            />
          </div>
        </PayrollSection>

        {/* Payment Details */}
        <PayrollSection title="Payment Details">
          <div className="space-y-2">
            <InfoRow 
              label="Payment Method" 
              value={payroll.paymentMethod || 'Not specified'} 
            />
            <InfoRow 
              label="Pay Date" 
              value={payroll.payDate ? commonServices.formatISOToDate(payroll.payDate) : 'Not set'} 
            />
            <InfoRow 
              label="Pay Period" 
              value={`${monthNames[payroll.payMonth - 1]} ${payroll.payYear}`} 
            />
            {payroll.attendanceData && (
              <InfoRow 
                label="Hours Worked" 
                value={`${payroll.attendanceData.hoursWorked || 0} hours`} 
              />
            )}
          </div>
        </PayrollSection>
      </div>

      {/* Additional Information */}
      <PayrollSection title="Additional Details">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <InfoRow 
              label="Employee ID" 
              value={employee?._id || 'N/A'} 
            />
            <InfoRow 
              label="Department" 
              value={employee?.department || 'N/A'} 
            />
          </div>
          <div className="space-y-2">
            <InfoRow 
              label="Position" 
              value={employee?.position || 'N/A'} 
            />
            <InfoRow 
              label="Payment Status" 
              value={payroll.isPaid ? 'Paid' : 'Pending'} 
              className={payroll.isPaid ? 'text-green-600' : 'text-amber-600'}
            />
          </div>
        </div>
      </PayrollSection>
    </div>
  );
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default PayrollDetails;
