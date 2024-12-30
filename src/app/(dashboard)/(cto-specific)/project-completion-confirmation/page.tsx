'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projectManagementServices, Project } from '@/services/projectManagementServices';
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, Calendar, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { AnyARecord } from 'node:dns';
import LoadingOverlay from '@/components/Common/LoadingOverlay';

export type ProjectStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'COMPLETED' | 'ALL_STAGES_COMPLETED';

// /project-completion-confirmation/page.tsx

export default function ProjectCompletionConfirmation() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('COMPLETED');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (): Promise<void> => {
    try {
      const result = await projectManagementServices.getProjectsPendingCompletion();
      if (result.success) {
        setProjects(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch projects');
      }
    } catch (error) {
      toast.error('Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusDialog = (project: Project): void => {
    setSelectedProject(project);
    setSelectedStatus(project.projectStatus as ProjectStatus);
    setShowStatusDialog(true);
  };

  const onCompletionClick = async (project: Project) => {
    try {
      setProcessing(true);
      const result = await projectManagementServices.updateProjectStatus(
        project._id as string,
        'ALL_STAGES_COMPLETED'
      );

      if (result.success) {
        toast.success('Project completion confirmed successfully');
        await fetchProjects();
      } else {
        throw new Error(result.message || 'Failed to confirm project completion');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error confirming completion';
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateStatus = async (): Promise<void> => {
    console.log('helllo', selectedProject, selectedStatus);
    if (!selectedProject) return;

    try {
      setProcessing(true);
      const result = await projectManagementServices.updateProjectStatus(
        selectedProject._id as string,
        selectedStatus
      );

      if (result.success) {
        toast.success('Project status updated successfully');
        await fetchProjects();
        setShowStatusDialog(false);
      } else {
        throw new Error(result.message || 'Failed to update project status');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error updating status';
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500';
      case 'ALL_STAGES_COMPLETED':
        return 'bg-blue-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'ACTIVE':
        return 'bg-emerald-500';
      case 'INACTIVE':
        return 'bg-gray-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <LoadingOverlay/>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Project Completion Management</h1>
        <p className="text-gray-500">Manage project completion statuses</p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-gray-500">No projects to display</p>
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
                  <Badge className={getStatusBadgeColor(project.projectStatus)}>
                    {project.projectStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">
                      {project.modules.filter((m: any) => m.status === 'completed').length}/{project.modules.length} Modules Completed
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      {/* @ts-ignore */}
                      Updated: {format(new Date(project.updatedAt), 'MMM d, yyyy')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {project.projectStatus === 'COMPLETED' && (
                      <Button
                        className="flex-1"
                        onClick={() => onCompletionClick(project)}
                        disabled={processing}
                      >
                        Confirm Completion
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleOpenStatusDialog(project)}
                      disabled={processing}
                    >
                      Change Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Project Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Status</label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as ProjectStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ALL_STAGES_COMPLETED">All Stages Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}