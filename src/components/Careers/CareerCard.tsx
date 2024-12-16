// /components/Careers/CareerCard.tsx

'use client'
import { Edit, EllipsisVertical, Trash } from 'lucide-react';
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { careerServices } from '@/services/careerServices';
import toast from 'react-hot-toast';
import { Career } from '@/types/Career';

interface CareerCardProps {
  career: Career;
  fetchCareers: () => void;
}

const CareerCard: React.FC<CareerCardProps> = ({ career, fetchCareers }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [careerToDelete, setCareerToDelete] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  // Open delete confirmation modal
  const handleDeleteClick = () => {
    setCareerToDelete(career.name); // Set the career name for confirmation
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    console.log(`Career "${careerToDelete}" has been deleted.`);
    setLoading(true);
    const result = await careerServices.deleteCareer(career._id);
    if (result.success) {
      console.log(result.data);
      toast.success("Career Deleted Successfully");
      await fetchCareers();
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
    <div className="bg-gray-800 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 ease-in-out hover:shadow-xl w-full">
      <div className="p-4 relative">
        {/* DropdownMenu for actions */}
        <DropdownMenu>
          <DropdownMenuTrigger className="absolute top-2 right-2 text-white">
            <span className="sr-only">Actions</span>
            <EllipsisVertical className="w-5 h-5 text-gray-300 hover:text-blue-500 transition-colors" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute right-0 top-0 bg-gray-800 dark:bg-gray-800 rounded-lg shadow-md">
            <DropdownMenuItem className="hover:bg-gray-700 text-white cursor-pointer">
              <Edit className="mr-2 w-4 h-4 text-gray-300" />
              Edit Career
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteClick} className="hover:bg-red-600 text-white cursor-pointer">
              <Trash className="mr-2 w-4 h-4 text-red-500" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-t border-gray-700" />
          </DropdownMenuContent>
        </DropdownMenu>

        <h3 className="text-2xl font-bold text-white text-center dark:text-gray-100 mb-1 hover:text-blue-400 transition-colors mt-3">
          {career.name}
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-300 mb-4 text-center">{career.description}</p>

        <div className="flex items-center justify-between absolute top-2 left-2">
          {career.isActive ? (
            <span className="block text-sm text-blue-500 dark:text-blue-400 font-medium mb-4">
              Active
            </span>
          ) : (
            <span className="block text-sm text-red-500 dark:text-red-400 font-medium mb-4">
              Inactive
            </span>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="light:bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete the career: <strong>{careerToDelete}</strong>(associated applications will also be deleted)?
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
      )}
    </div>
  );
};

export default CareerCard;
