'use client'
import React, { useEffect, useState } from 'react';
import { Pen, Trash2, Mail, Phone, Building2, Eye } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Employee } from '@/types/Employee';
import defaultProfilePhoto from '../../../public/assets/default-profile.jpg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { employeeServices } from '@/services/employeeServices';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface EmployeeCardProps {
  employee: Employee,
  fetchEmployees: () => void;
}

const EmployeeCard = ({ employee, fetchEmployees }: EmployeeCardProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleClickCard = (employeeId: string) => {
    router.push(`/employee-profiles/${employeeId}`)
  };




  // Open delete confirmation modal
  const handleDeleteClick = () => {
    setEmployeeToDelete(employee.firstName); // Set the project name for confirmation
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    console.log(`Project "${employeeToDelete}" has been deleted.`);
    setLoading(true);
    const result = await employeeServices.deleteEmployee(employee._id);
    if (result.success) {
      console.log(result.data);
      toast.success("Employee Deleted Successfully");
      await fetchEmployees();
      setLoading(false);
    } else {
      toast.error(result.message);
      setLoading(false);
    }
    setIsDeleteModalOpen(false); // Close modal
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // Close modal without deleting
  };

  return (
    <>
      <div className="w-full max-w-2xl rounded-xl border dark:bg-gray-800 text-card-foreground shadow-sm hover:shadow-lg transition-shadow duration-200 ">
        <div className="relative p-6 flex gap-4 cursor-pointer">
          <div className="absolute top-4 right-4 flex gap-2">
            <Link href={`/employee-profiles/${employee._id}`}>
              <button
                className="p-2 rounded-full hover:bg-accent transition-colors"
              >
                <Eye color='white' className="w-4 h-4" />
              </button>
            </Link>
            <Link href={`/employee-profiles/${employee._id}/edit`}>
              <button
                className="p-2 rounded-full hover:bg-accent transition-colors"
              >
                <Pen className="w-4 h-4" />
              </button>
            </Link>
            <button
              onClick={() => handleDeleteClick()}
              className="p-2 rounded-full hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>

          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
              {employee.profilePhoto ? (
                <Link href={`/employee-profiles/${employee._id}`} className='no-underline'>
                  <img
                    src={(employee.profilePhoto === "/images/default-profile.jpg") ? "/assets/default-profile.jpg" : employee.profilePhoto}
                    alt={`${employee.firstName} ${employee.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-semibold">
                  {employee.firstName[0]}{employee.lastName[0]}
                </div>
              )}
            </div>
          </div>

          <Link href={`/employee-profiles/${employee._id}`} className='no-underline'>
            <div className="flex-grow">
              <div className="mb-2">
                <h3 className="text-xl font-semibold">{employee.firstName} {employee.lastName}</h3>
                <p className="text-muted-foreground font-medium">{employee.position}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{employee.email}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{employee.phoneNumber}</span>
                </div>

                {employee.department && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">{employee.department}</span>
                  </div>
                )}
              </div>

              {employee.status && (
                <span className={cn(
                  "mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium",
                  {
                    "bg-success/20 text-success": employee.status === 'active',
                    "bg-warning/20 text-warning": employee.status === 'inactive',
                    "bg-destructive/20 text-destructive": employee.status === 'terminated'
                  }
                )}>
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div >

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="light:bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete the project: <strong>{employeeToDelete}</strong>?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )
      }
    </>
  );
};

export default EmployeeCard;