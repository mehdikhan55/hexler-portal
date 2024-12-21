"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { projectManagementServices } from '@/services/projectManagementServices';
import { useParams, useRouter } from 'next/navigation';
import Loader from "@/components/Common/Loader";
import toast from 'react-hot-toast';

interface ModuleData {
    moduleName: string;
    description: string;
    deadline: Date;
    status: 'todo' | 'inprogress' | 'completed';
}

interface ProjectData {
    _id: string;
    projectName: string;
    projectDescription: string;
    budget: {
        amount: number | null;
        currency: string;
    };
    projectStatus: 'PENDING' | 'CANCELLED' | 'ACTIVE' | 'COMPLETED' | 'INACTIVE';
    approvedByFinance: boolean;
    sendForApproval: boolean;
    modules: ModuleData[];
}

const ProjectDetailsPage = () => {
    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const result = await projectManagementServices.getProject(params.id as string);

                if (result.success && result.data) {
                    setProject(result.data);
                    console.log('Project:', result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch project');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load project';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProject();
        }
    }, [params.id]);

    const calculateProjectDuration = (modules: ModuleData[]): number => {
        if (!modules || modules.length === 0) return 0;
    
        // Get today's date without time component
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        // Get all deadlines and find the latest one
        const deadlines = modules.map(module => new Date(module.deadline));
        const latestDeadline = new Date(Math.max(...deadlines.map(date => date.getTime())));
        latestDeadline.setHours(0, 0, 0, 0);  // Remove time component
    
        // Calculate the difference in days
        const diffTime = latestDeadline.getTime() - today.getTime();
        const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
        // Return the duration, ensuring it's not negative
        return Math.max(0, durationDays);
    };

    const calculateProgress = () => {
        if (!project?.modules?.length) return 0;
        const completedModules = project.modules.filter(m => m.status === 'completed').length;
        return (completedModules / project.modules.length) * 100;
    };

    const updateModuleStatus = async (moduleId: string, newStatus: string) => {
        if (!project) return;

        try {
            const updatedModules = project.modules.map(module =>
                module.moduleName === moduleId ? {
                    ...module,
                    status: newStatus as 'todo' | 'inprogress' | 'completed'
                } : module
            );

            const updatedProject = {
                ...project,
                modules: updatedModules
            };

            setProject(updatedProject);

            const result = await projectManagementServices.updateProject(
                project._id,
                updatedProject
            );

            if (!result.success) {
                throw new Error(result.message || 'Failed to update module status');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update module status';
            toast.error(errorMessage);
            setProject(project);
        }
    };

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination || 
            (destination.droppableId === source.droppableId && 
             destination.index === source.index)) {
            return;
        }

        updateModuleStatus(draggableId, destination.droppableId);
    };

    const getStatusColor = (status: ModuleData['status']) => {
        const colors = {
            todo: 'bg-yellow-100 border-yellow-300',
            inprogress: 'bg-blue-100 border-blue-300',
            completed: 'bg-green-100 border-green-300'
        };
        return colors[status];
    };

    const renderModuleColumn = (status: 'todo' | 'inprogress' | 'completed', title: string, badgeColor: string) => {
        const filteredModules = project?.modules.filter(m => m.status === status) || [];
        
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        {title}
                        <Badge className={badgeColor}>
                            {filteredModules.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Droppable droppableId={status}>
                        {(provided) => (
                            <div
                                className="space-y-2 min-h-[200px]"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {filteredModules.map((module, index) => (
                                    <Draggable
                                        key={module.moduleName}
                                        draggableId={module.moduleName}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`p-3 rounded border ${getStatusColor(module.status)} 
                                                    ${snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'} 
                                                    transition-shadow`}
                                            >
                                                <h3 className="font-medium text-black">{module.moduleName}</h3>
                                                <p className="text-sm text-gray-600">{module.description}</p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    <span>Due: {new Date(module.deadline).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </CardContent>
            </Card>
        );
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader /></div>;
    if (error || !project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-red-600 mb-2">
                    {error || 'Project not found'}
                </h2>
                <button
                    onClick={() => router.push('/manage-projects')}
                    className="text-blue-500 hover:underline mt-4"
                >
                    Return to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Project Overview Card */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">{project.projectName}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {project.projectDescription}
                            </p>
                        </div>
                        <div className="flex gap-2 items-start justify-center">
                            <p className="text-sm">Price Approved By Finance:</p>
                            <Badge
                                className={
                                    project.approvedByFinance ? 'bg-green-500' :
                                    (!project.approvedByFinance && project.sendForApproval) ? 'bg-yellow-500' :
                                    'bg-gray-500'
                                }
                            >
                                {project.approvedByFinance ? 'APPROVED' :
                                 (!project.approvedByFinance && project.sendForApproval) ? 'PENDING' :
                                 'NOT SENT'}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-semibold">
                                ${project.budget.amount?.toLocaleString() ?? 0} {project.budget.currency}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">
                                Duration: {calculateProjectDuration(project.modules)} days
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className='text-sm'>Project Status:</span>
                            <Badge
                                className={
                                    project.projectStatus === 'PENDING' ? 'bg-yellow-500' :
                                    project.projectStatus === 'ACTIVE' ? 'bg-green-500' :
                                    project.projectStatus === 'INACTIVE' ? 'bg-gray-500' :
                                    project.projectStatus === 'CANCELLED' ? 'bg-red-500' :
                                    project.projectStatus === 'COMPLETED' ? 'bg-blue-500' :
                                    'bg-gray-300'
                                }
                            >
                                {project.projectStatus}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Overall Progress</span>
                            <span>{calculateProgress().toFixed(0)}%</span>
                        </div>
                        <Progress value={calculateProgress()} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Module Boards */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderModuleColumn('todo', 'To Do', 'bg-yellow-500')}
                    {renderModuleColumn('inprogress', 'In Progress', 'bg-blue-500')}
                    {renderModuleColumn('completed', 'Completed', 'bg-green-500')}
                </div>
            </DragDropContext>
        </div>
    );
};

export default ProjectDetailsPage;