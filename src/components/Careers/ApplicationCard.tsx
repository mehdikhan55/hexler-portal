'use client'
import { EllipsisVertical, PhoneCall, User2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CareerApplication } from '@/types/Career';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { careerServices } from '@/services/careerServices';
import toast from 'react-hot-toast';
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import { useState } from 'react';
import whatsappIcon from "../../../public/assets/icons/whattsapp-icon.png";
import Image from 'next/image';


interface ApplicationCardProps {
  application: CareerApplication;
  onStatusChange: () => void;
}

const ApplicationCard = ({ application, onStatusChange }: ApplicationCardProps) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500',
      reviewing: 'bg-blue-500',
      shortlisted: 'bg-green-500',
      rejected: 'bg-red-500',
      hired: 'bg-purple-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!application._id || isProcessing) return;

    try {
      setIsProcessing(true);
      const result = await careerServices.updateApplicationStatus(
        application._id,
        newStatus as CareerApplication['status']
      );

      if (result.success) {
        toast.success(`Status updated to ${newStatus}`);
        onStatusChange();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('An error occurred while updating status');
    } finally {
      setIsProcessing(false);
    }
  };

  const viewDetails = () => {
    if (application._id && !isProcessing) {
      router.push(`/careers/applications/${application._id}`);
    }
  };

  return (
    <div className="relative">
      {isProcessing && <LoadingOverlay />}
      <div
        className="bg-gray- dark:border-2 border-black dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 ease-in-out hover:shadow-xl cursor-pointer"
        onClick={viewDetails}
      >
        <div className="p-4 relative">
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e) => e.stopPropagation()}
                className="focus:outline-none"
                disabled={isProcessing}
              >
                <EllipsisVertical className="w-5 h-5 dark:text-gray-300 hover:text-blue-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange('reviewing');
                }}>Mark as Reviewing</DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange('shortlisted');
                }}>Mark as Shortlisted</DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange('hired');
                }}>Mark as Hired</DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange('rejected');
                }} className="text-red-500">
                  Reject Application
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gray-400 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User2 className="w-8 h-8 text-gray-800 dark:text-gray-300" />
            </div>
          </div>

          <h3 className="text-xl font-bold dark:text-white text-center mb-2">
            {application.firstName} {application.lastName}
          </h3>

          <p className="text-sm dark:text-gray-300 text-center mb-3">
            Job Title: {typeof application.career === 'object' ? application.career.name : 'Position'}
          </p>

          <div className="flex justify-center gap-2 mb-3">
            <Badge className={`${getStatusColor(application.status)} dark:text-white`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>

          <div className="text-sm dark:text-gray-400">
            <p className="mb-1">📧 {application.email}</p>
            <div className='flex items-center gap-1'>
              <PhoneCall size={18} />
              <p className="mb-1">{application.phoneNumber}</p>
            </div>
            <div className='flex items-center gap-1'>
              <Image src={whatsappIcon} height={18} width={18} alt='whatsapp' className='mb-1' />
              <p className="mb-1">{application.phoneNumber}</p>
            </div>
            <p>📍 {application.residingCity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;