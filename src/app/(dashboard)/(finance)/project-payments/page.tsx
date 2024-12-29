'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projectManagementServices, Project } from '@/services/projectManagementServices';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, CheckCircle2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import LoadingOverlay from '@/components/Common/LoadingOverlay';

// /project-payments/page.tsx

export default function ProjectPayments() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showUpdateDialog, setShowUpdateDialog] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    useEffect(() => {
        fetchCompletedProjects();
    }, []);

    const fetchCompletedProjects = async (): Promise<void> => {
        try {
            const result = await projectManagementServices.getProjectsForPaymentStatus();
            if (result.success) {
                setProjects(result.data);
                console.log('hello',result.data);
            } else {
                toast.error(result.message || 'Failed to fetch projects');
            }
        } catch (error) {
            toast.error('Error fetching completed projects');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenUpdateDialog = (project: Project): void => {
        setSelectedProject(project);
        setSelectedStatus(project.paymentStatus || 'PENDING');
        setShowUpdateDialog(true);
    };

    const handleUpdatePaymentStatus = async (): Promise<void> => {
        if (!selectedProject || !selectedStatus) return;

        try {
            setProcessing(true);
            const result = await projectManagementServices.updateProjectPaymentStatus(
                selectedProject._id as string,
                selectedStatus as 'PENDING' | 'RECIEVED' | 'NOT_RECIEVED'
            );

            if (result.success) {
                toast.success('Payment status updated successfully');
                await fetchCompletedProjects();
                setShowUpdateDialog(false);
            } else {
                throw new Error(result.message || 'Failed to update payment status');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error updating payment status';
            toast.error(errorMessage);
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'RECIEVED':
                return 'bg-green-500';
            case 'NOT_RECIEVED':
                return 'bg-red-500';
            default:
                return 'bg-yellow-500';
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
                <h1 className="text-2xl font-bold">Project Payments</h1>
                <p className="text-gray-500">Manage project payment statuses</p>
            </div>

            {projects.length === 0 ? (
                <Card>
                    <CardContent className="flex items-center justify-center h-40">
                        <p className="text-gray-500">No projects pending payment status update</p>
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
                                    <Badge className={getStatusBadgeColor(project.paymentStatus)}>
                                        {project.paymentStatus || 'PENDING'}
                                    </Badge>
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
                                            Completed: {format(new Date(project?.updatedAt), 'MMM d, yyyy')}
                                        </span>
                                    </div>

                                    <Button
                                        className="w-full"
                                        onClick={() => handleOpenUpdateDialog(project)}
                                        disabled={processing}
                                    >
                                        Update Payment Status
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Payment Status</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Payment Status</label>
                            <Select
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="RECIEVED">Received</SelectItem>
                                    <SelectItem value="NOT_RECIEVED">Not Received</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowUpdateDialog(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdatePaymentStatus}
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