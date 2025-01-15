'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, ListChecks, ChevronDown, ChevronUp, Eye, Edit2, Calendar, Trash, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Loader from "@/components/Common/Loader";
import { projectManagementServices, Project } from '@/services/projectManagementServices';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import Link from 'next/link';

const calculateProjectDuration = (project: Project): number => {
    if (!project.modules || project.modules.length === 0) return 0;

    // Get today's date without time component
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the latest deadline from all modules
    const latestDeadline = new Date(Math.max(
        ...project.modules.map(module => new Date(module.deadline).getTime())
    ));
    latestDeadline.setHours(0, 0, 0, 0);

    // Calculate the difference in days
    const diffTime = latestDeadline.getTime() - today.getTime();
    const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Return the duration, ensuring it's not negative
    return Math.max(0, durationDays);
};
export default function Page() {
    const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");


    const clearFilters = () => {
        setStatusFilter("all");
    };


    const router = useRouter();

    useEffect(() => {
        fetchProjects();
    }, []);

    // Fetch applications when filters change
    useEffect(() => {
        console.log('fetch projects called')
        fetchProjects();
    }, [statusFilter]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const filters: any = {};

            if (statusFilter !== "all") {
                filters.projectStatus = statusFilter.toUpperCase();
            }

            console.log('filters:', filters)
            const result = await projectManagementServices.getProjects(filters);

            if (result.success) {
                setProjects(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch projects');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (projectId: string) => async () => {
        try {
            setDeletingProjectId(projectId);
        } catch (error) {
            console.error('Error initiating delete:', error);
        }
    };

    const confirmDelete = async () => {
        if (!deletingProjectId) return;

        try {
            setIsDeleting(true);
            const result = await projectManagementServices.deleteProject(deletingProjectId);

            if (result.success) {
                toast.success('Project deleted successfully');
                // Refresh the projects list
                await fetchProjects();
            } else {
                throw new Error(result.message || 'Failed to delete project');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
            setDeletingProjectId(null);
        }
    };

    const cancelDelete = () => {
        setDeletingProjectId(null);
        setIsDeleting(false);
    };

    const toggleCardExpansion = (projectId: string): void => {
        setExpandedCards(prevState => ({
            ...prevState,
            [projectId]: !prevState[projectId]
        }));
    };

    const calculateProgress = (project: any) => {
        if (!project?.modules?.length) return 0;
        const completedModules = project.modules.filter((m: any) => m.status === 'completed').length;
        return (completedModules / project.modules.length) * 100;
    };

    if (loading) {
        return (
            <LoadingOverlay />
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Projects</h2>
                    <p className="text-gray-600">{error}</p>
                    <Button onClick={fetchProjects} className="mt-4">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">All Projects</h1>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Status Filter */}
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                            disabled={loading}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters Button */}
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            disabled={loading || (statusFilter === "all")}
                        >
                            Clear Filters
                        </Button>

                        <Button onClick={() => router.push('/manage-projects/new')}>
                            Add New Project
                        </Button>

                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No projects found.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {projects.map((project) => (
                            <Card key={project._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4">
                                    <div className="flex justify-between flex-col-reverse sm:flex-row items-start">
                                        <div>
                                            <Link href={`/manage-projects/${project._id}`} className='no-underline'>
                                            <h2 className="text-xl text-blue-400 cursor-pointer font-semibold">{project.projectName}</h2>
                                            </Link>
                                                <p className="text-sm text-muted-foreground mt-1">{project.projectDescription}</p>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-right gap-2 w-full sm:w-auto">
                                            <div className='flex gap-2'>
                                                <Link href={`/manage-projects/${project._id}`}>
                                                    <button
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye color='white' className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <Link href={`/manage-projects/${project._id}/edit`}>
                                                    <button
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                                        title="Edit Project"
                                                    >
                                                        <Edit2 className="w-4 h-4 text-blue-300" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={handleDelete(project._id!)}
                                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                                    title="View Details"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            <Badge
                                                className={(() => {
                                                    switch (project.projectStatus) {
                                                        case 'PENDING':
                                                            return 'bg-yellow-500 font-semibold';
                                                        case 'ACTIVE':
                                                            return 'bg-green-500 font-semibold';
                                                        case 'INACTIVE':
                                                            return 'bg-gray-500 font-semibold';
                                                        case 'CANCELLED':
                                                            return 'bg-red-500 font-semibold';
                                                        case 'COMPLETED':
                                                            return 'bg-blue-500 font-semibold';
                                                        default:
                                                            return 'bg-gray-300 font-semibold'; // fallback in case of an unknown status
                                                    }
                                                })()}
                                            >
                                                {project.projectStatus}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Project Progress */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Overall Progress</span>
                                            <span>{calculateProgress(project).toFixed(0)}%</span>
                                        </div>
                                        <Progress value={calculateProgress(project)} className="h-2" />
                                    </div>
                                </CardHeader>

                                <CardContent className="p-4 space-y-4">

                                    {/* Project Budget and Status */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                            <span className="font-semibold">
                                                {project.budget.amount ?
                                                    `${project.budget.amount.toLocaleString()} ${project.budget.currency}` :
                                                    'No budget set'}
                                            </span>
                                        </div>
                                        <div className="flex items-start justify-center">
                                            <p className='text-xs'><p className="text-sm">Price Approved By Finance:&nbsp;</p></p>
                                            <Badge
                                                className={(() => {
                                                    if (project.approvedByFinance) {
                                                        return 'bg-green-500'; // APPROVED
                                                    } else if (!project.approvedByFinance && project.sendForApproval) {
                                                        return 'bg-yellow-500'; // PENDING
                                                    } else {
                                                        return 'bg-gray-500'; // NOT SENT
                                                    }
                                                })()}
                                            >
                                                {(project.approvedByFinance) && 'APPROVED'}
                                                {(!project.approvedByFinance && project.sendForApproval) && 'PENDING'}
                                                {(!project.approvedByFinance && !project.sendForApproval) && 'NOT SENT'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Project Duration */}
                                    {project.modules.length > 0 && (
                                        <div className="flex items-center gap-2 text-sm w-full justify-between">
                                            <div className='flex gap-2'>
                                                <Calendar className="w-4 h-4 text-blue-500" />
                                                <span>Duration: {calculateProjectDuration(project)} days</span>
                                            </div>
                                            <span className="text-muted-foreground">
                                                ({format(new Date(Math.min(...project.modules.map(m => new Date(m.deadline).getTime()))), 'MMM d, yyyy')} -
                                                {format(new Date(Math.max(...project.modules.map(m => new Date(m.deadline).getTime()))), 'MMM d, yyyy')})
                                            </span>
                                        </div>
                                    )}

                                    {/* Modules Section */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <ListChecks className="w-4 h-4" />
                                            <span className="font-medium">Modules ({project.modules.length})</span>
                                        </div>
                                        <div className="space-y-2">
                                            {project.modules.slice(0, 2).map((module, idx) => (
                                                <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium text-sm">{module.moduleName}</span>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-3 h-3" />
                                                            <span className="text-xs">
                                                                {format(new Date(module.deadline), 'MMM d, yyyy')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {module.description}
                                                    </p>
                                                </div>
                                            ))}

                                            {project.modules.length > 2 && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full text-sm"
                                                        onClick={() => project._id && toggleCardExpansion(project._id)}
                                                    >
                                                        {!expandedCards[project._id!] ? (
                                                            <div className="flex items-center gap-2">
                                                                <span>+{project.modules.length - 2} more modules</span>
                                                                <ChevronDown className="w-4 h-4" />
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <span>Show less</span>
                                                                <ChevronUp className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </Button>

                                                    {expandedCards[project._id!] && (
                                                        <div className="space-y-2 mt-2">
                                                            {project.modules.slice(2).map((module, idx) => (
                                                                <div key={idx + 2} className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="font-medium text-sm">{module.moduleName}</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock className="w-3 h-3" />
                                                                            <span className="text-xs">
                                                                                {format(new Date(module.deadline), 'MMM d, yyyy')}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        {module.description}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Finance Approval */}
                                    {/* <div className="flex items-center justify-between text-sm">
                                        <span>Finance Approval:</span>
                                        <Badge variant={project.approvedByFinance ? "default" : "secondary"}>
                                            {project.approvedByFinance ? 'Approved' : 'Pending'}
                                        </Badge>
                                    </div> */}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            <Dialog open={!!deletingProjectId} onOpenChange={() => setDeletingProjectId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this project? This action cannot be undone.</p>
                    <DialogFooter className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={cancelDelete}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <div className="flex items-center gap-2">
                                    Deleting...
                                </div>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}