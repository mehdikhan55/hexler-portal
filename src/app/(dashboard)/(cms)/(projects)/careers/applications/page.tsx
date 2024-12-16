'use client'
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Career, CareerApplication } from '@/types/Career';
import { careerServices } from '@/services/careerServices';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Loader from '@/components/Common/Loader';
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import ApplicationCard from '@/components/Careers/ApplicationCard';
import toast from 'react-hot-toast';

// /careers/applications/page.tsx

const Page = () => {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [careerFilter, setCareerFilter] = useState<string>("all");

  const fetchCareers = async () => {
    try {
      const result = await careerServices.getCareers();
      if (result.success) {
        // Only set active careers
        //@ts-ignore
        setCareers(result.data.filter(career => career.isActive));
      } else {
        toast.error('Failed to fetch careers');
      }
    } catch (error) {
      toast.error('Error fetching careers');
    }
  };

  const fetchApplications = async () => {
    try {
      setIsProcessing(true);
      const filters: any = {};
      
      if (statusFilter !== "all") {
        filters.status = statusFilter;
      }
      
      if (careerFilter !== "all") {
        filters.career = careerFilter;
      }
      
      const result = await careerServices.getApplications(filters);
      
      if (result.success) {
        setApplications(result.data);
      } else {
        setError(result.message);
        toast.error('Failed to fetch applications');
      }
    } catch (error) {
      setError('An error occurred while fetching applications');
      toast.error('Failed to fetch applications');
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setCareerFilter("all");
  };

  // Fetch careers on component mount
  useEffect(() => {
    fetchCareers();
  }, []);

  // Fetch applications when filters change
  useEffect(() => {
    console.log('fetch applications called')
    fetchApplications();
  }, [statusFilter, careerFilter]);

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      {isProcessing && <LoadingOverlay />}
      <div className="container mx-auto p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Career Applications</h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Status Filter */}
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
              disabled={isProcessing}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Career Filter */}
            <Select 
              value={careerFilter} 
              onValueChange={setCareerFilter}
              disabled={isProcessing}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by career" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Career</SelectLabel>
                  <SelectItem value="all">All Careers</SelectItem>
                  {careers.map((career) => (
                    <SelectItem key={career._id} value={career._id}>
                      {career.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            <Button 
              variant="outline" 
              onClick={clearFilters}
              disabled={isProcessing || (statusFilter === "all" && careerFilter === "all")}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((application) => (
            <ApplicationCard 
              key={application._id} 
              application={application}
              onStatusChange={fetchApplications}
            />
          ))}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No applications found.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;