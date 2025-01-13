'use client'
import { Edit, EllipsisVertical, Trash } from 'lucide-react';
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { careerServices } from '@/services/careerServices';
import toast from 'react-hot-toast';
import { Career } from '@/types/Career';
import EditCareerDialog from './EditCareerDialog';

interface CareerCardProps {
  career: Career;
  fetchCareers: () => void;
}

const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  careerName, 
  loading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  careerName: string | null;
  loading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
        onClick={onClose}
      >
        <Card 
          className="w-[90%] max-w-md mx-auto"
          onClick={e => e.stopPropagation()}
        >
          <CardHeader>
            <CardTitle>Confirm Deletion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete the career: <strong className="text-foreground">{careerName}</strong> (associated applications will also be deleted)?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CareerCard: React.FC<CareerCardProps> = ({ career, fetchCareers }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [careerToDelete, setCareerToDelete] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = () => {
    setCareerToDelete(career.name);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    const result = await careerServices.deleteCareer(career._id);
    if (result.success) {
      toast.success("Career Deleted Successfully");
      await fetchCareers();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
    setIsDeleteModalOpen(false);
  };

  const handleEditSubmit = async (updatedCareer: Career) => {
    setLoading(true);
    try {
      const result = await careerServices.updateCareer(career._id, updatedCareer);
      if (result.success) {
        toast.success("Career Updated Successfully");
        await fetchCareers();
        setIsEditModalOpen(false);
      } else {
        toast.error(result.message || 'Failed to update career');
      }
    } catch (error) {
      toast.error('An error occurred while updating the career');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="bg-gray-100 border-[0.5x] border-gray-600 text-black dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 ease-in-out hover:shadow-xl w-full">
        <div className="p-4 relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute top-2 right-2 text-white">
              <span className="sr-only">Actions</span>
              <EllipsisVertical className="w-5 h-5 text-gray-300 hover:text-blue-500 transition-colors" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute right-0 top-0 bg-gray-800 dark:bg-gray-800 rounded-lg shadow-md">
              <DropdownMenuItem onClick={handleEditClick} className="hover:bg-gray-700 text-white cursor-pointer">
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

          <h3 className="text-2xl font-bold text-gray-900 text-center dark:text-gray-100 mb-1 hover:text-blue-400 transition-colors mt-3">
            {career.name}
          </h3>
          <p className="text-sm text-gray-900 dark:text-gray-300 mb-4 text-center">
            {career.description}
          </p>

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
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        careerName={careerToDelete}
        loading={loading}
      />

      <EditCareerDialog
        show={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        career={career}
      />
    </>
  );
};

export default CareerCard;