'use client'
import { Link as LinkIcon, Edit, Trash } from 'lucide-react';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"; // Make sure the path is correct
import Link from 'next/link';
import { projectServices } from '@/services/projectServices';
import toast from 'react-hot-toast';

interface ProjectCardProps {
  project: {
    _id: string;
    projectName: string;
    projectTagline: string;
    projectDescription: string;
    projectCategory: string;
    projectImage: string;
    projectLink: string;
    projectOrder: number;
  };
  fetchProjects:()=>void; 
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project,fetchProjects }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<null | string>(null); 
  const [loading,setLoading]=useState(false);


  // Open delete confirmation modal
  const handleDeleteClick = () => {
    setProjectToDelete(project.projectName); // Set the project name for confirmation
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    console.log(`Project "${projectToDelete}" has been deleted.`);
    setLoading(true);
    const result=await projectServices.deleteProject(project._id);
    if(result.success){
      console.log(result.data);
      toast.success("Project Deleted Successfully");
      await fetchProjects();
      setLoading(false);
    }else{
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
    <div className="bg-gray-800 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 ease-in-out hover:shadow-xl">
      <img
        src={project.projectImage || "https://plus.unsplash.com/premium_photo-1675793715030-0584c8ec4a13?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
        alt={project.projectName}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4 relative">
        <div className="absolute bottom-0 right-0 text-sm bg-gray-800 dark:bg-gray-800 rounded-full p-2">
          <p>Order: {project.projectOrder}</p>
        </div>

        {/* DropdownMenu for actions */}
        <DropdownMenu>
          <DropdownMenuTrigger className="absolute top-2 right-2 text-white">
            <span className="sr-only">Actions</span>
            <Edit className="w-5 h-5 text-gray-300 hover:text-blue-500 transition-colors" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute right-0 top-0 bg-gray-800 dark:bg-gray-800 rounded-lg shadow-md">
            <Link href={`/projects/${project._id}/edit`} >
              <DropdownMenuItem className="hover:bg-gray-700 text-white cursor-pointer">
                <Edit className="mr-2 w-4 h-4 text-gray-300" />
                Edit Project
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={handleDeleteClick} className="hover:bg-red-600 text-white cursor-pointer">
              <Trash className="mr-2 w-4 h-4 text-red-500" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-t border-gray-700" />
          </DropdownMenuContent>
        </DropdownMenu>


        <h3 className="text-2xl font-bold text-white text-center dark:text-gray-100 mb-1 hover:text-blue-400 transition-colors">
          {project.projectName}
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-300 mb-4 text-center">{project.projectTagline}</p>
        <p className="text-sm text-gray-200 dark:text-gray-300 mb-4 italic">Description: {project?.projectDescription}</p>
        <span className="block text-sm text-blue-500 dark:text-blue-400 font-medium mb-4">
          {project.projectCategory}
        </span>

        <div className="flex items-center justify-between">
          <a
            href={project.projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <LinkIcon className="mr-2" />
            {project.projectLink}
          </a>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="light:bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete the project: <strong>{projectToDelete}</strong>?
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

export default ProjectCard;
