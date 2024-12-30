'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projectManagementServices, Project } from '@/services/projectManagementServices';
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, DollarSign } from "lucide-react";
import { format } from 'date-fns';
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import toast from 'react-hot-toast';

export default function ClosedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClosedProjects();
  }, []);

  const fetchClosedProjects = async () => {
    try {
      setLoading(true);
      const result = await projectManagementServices.getClosedProjects();
      if (result.success) {
        setProjects(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch closed projects');
      }
    } catch (error) {
      toast.error('Error fetching closed projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Closed Projects</h1>
        <p className="text-gray-500">View successfully completed and paid projects</p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-gray-500">No closed projects found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{project.projectName}</CardTitle>
                    <CardDescription className="mt-2">
                      {project.projectDescription}
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-500">Closed Successfully</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">
                      {project.budget.amount?.toLocaleString()} {project.budget.currency}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      {/* @ts-ignore */}
                      Closed: {format(new Date(project.updatedAt), 'MMM d, yyyy')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">
                      {project.modules.length} modules completed
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold mb-2">Completion Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Project Status:</span>
                        <span className="font-medium">{project.projectStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment Status:</span>
                        <span className="font-medium">{project.paymentStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}