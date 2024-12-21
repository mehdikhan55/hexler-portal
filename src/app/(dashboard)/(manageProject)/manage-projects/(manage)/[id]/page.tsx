

'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Module {
    moduleName: string;
    description: string;
    isActive: boolean;
    deadline: Date;
    status: 'todo' | 'inprogress' | 'completed';
    completedDate?: Date;
}

interface Project {
    _id: string;
    projectName: string;
    projectDescription: string;
    budget: number;
    isActive: boolean;
    approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
    approvedByFinance: boolean;
    modules: Module[];
}

const ProjectDetailsPage = () => {
    // Mock project data - replace with actual data fetching
    const [project, setProject] = useState<Project>({
        _id: '1',
        projectName: "E-commerce Platform Redesign",
        projectDescription: "Modernizing the online shopping experience with improved UI/UX and performance",
        budget: 75000,
        isActive: true,
        approvalStatus: 'APPROVED',
        approvedByFinance: true,
        modules: [
            {
                moduleName: "User Interface Design",
                description: "Create modern, responsive UI designs for all key pages",
                isActive: true,
                deadline: new Date('2024-12-25'),
                status: 'completed',
                completedDate: new Date('2024-12-15')
            },
            {
                moduleName: "Frontend Development",
                description: "Implement new UI designs using React and Tailwind",
                isActive: true,
                deadline: new Date('2024-12-30'),
                status: 'inprogress'
            },
            {
                moduleName: "Backend API Updates",
                description: "Update REST APIs to support new features",
                isActive: true,
                deadline: new Date('2025-01-15'),
                status: 'todo'
            },
            {
                moduleName: "Performance Optimization",
                description: "Optimize loading times and core web vitals",
                isActive: true,
                deadline: new Date('2025-01-20'),
                status: 'todo'
            }
        ]
    });

    const calculateProjectDuration = (modules: Module[]): number => {
        if (!modules || modules.length === 0) return 0;
        const dates = modules.map(module => module.deadline);
        const latestDate = new Date(Math.max(...dates.map(date => date.getTime())));
        const earliestDate = new Date(Math.min(...dates.map(date => date.getTime())));
        const diffTime = Math.abs(latestDate.getTime() - earliestDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const calculateProgress = () => {
        const completed = project.modules.filter(m => m.status === 'completed').length;
        return (completed / project.modules.length) * 100;
    };

    const handleModuleStatusChange = (moduleName: string, newStatus: Module['status']) => {
        setProject(prev => ({
            ...prev,
            modules: prev.modules.map(module =>
                module.moduleName === moduleName
                    ? {
                        ...module,
                        status: newStatus,
                        completedDate: newStatus === 'completed' ? new Date() : undefined
                    }
                    : module
            )
        }));
    };

    const getStatusColor = (status: Module['status']) => {
        const colors = {
            todo: 'bg-yellow-100 border-yellow-300',
            inprogress: 'bg-blue-100 border-blue-300',
            completed: 'bg-green-100 border-green-300'
        };
        return colors[status];
    };

    // drag and drop cards

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;

        // If there's no destination or the item was dropped in its original position
        if (!destination ||
            (destination.droppableId === source.droppableId &&
                destination.index === source.index)) {
            return;
        }

        // Update the module's status based on which column it was dropped in
        setProject(prev => ({
            ...prev,
            modules: prev.modules.map(module =>
                module.moduleName === draggableId
                    ? {
                        ...module,
                        status: destination.droppableId as Module['status'],
                        completedDate: destination.droppableId === 'completed' ? new Date() : undefined
                    }
                    : module
            )
        }));
    };
    return (
        <div className="p-6 space-y-6">
            {/* Project Overview */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">{project.projectName}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {project.projectDescription}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant={project.isActive ? "default" : "secondary"}>
                                {project.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge
                                className={
                                    project.approvalStatus === 'APPROVED' ? 'bg-green-500' :
                                        project.approvalStatus === 'PENDING' ? 'bg-yellow-500' :
                                            'bg-red-500'
                                }
                            >
                                {project.approvalStatus}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-semibold">
                                ${project.budget.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">
                                Duration: {calculateProjectDuration(project.modules)} days
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={project.approvedByFinance ? "default" : "secondary"}>
                                Finance: {project.approvedByFinance ? 'Approved' : 'Pending'}
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
                    {/* Todo Column */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                To Do
                                <Badge className="bg-yellow-500">
                                    {project.modules.filter(m => m.status === 'todo').length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Droppable droppableId="todo">
                                {(provided) => (
                                    <div
                                        className="space-y-2"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {project.modules
                                            .filter(module => module.status === 'todo')
                                            .map((module, index) => (
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
                                                                <span>Due: {module.deadline.toLocaleDateString()}</span>
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

                    {/* In Progress Column */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                In Progress
                                <Badge className="bg-blue-500">
                                    {project.modules.filter(m => m.status === 'inprogress').length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Droppable droppableId="inprogress">
                                {(provided) => (
                                    <div
                                        className="space-y-2"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {project.modules
                                            .filter(module => module.status === 'inprogress')
                                            .map((module, index) => (
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
                                                                <span>Due: {module.deadline.toLocaleDateString()}</span>
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

                    {/* Completed Column */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                Completed
                                <Badge className="bg-green-500">
                                    {project.modules.filter(m => m.status === 'completed').length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Droppable droppableId="completed">
                                {(provided) => (
                                    <div
                                        className="space-y-2"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {project.modules
                                            .filter(module => module.status === 'completed')
                                            .map((module, index) => (
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
                                                            <div className="flex flex-col gap-1 mt-2 text-xs text-gray-500">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>Due: {module.deadline.toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>Completed: {module.completedDate?.toLocaleDateString()}</span>
                                                                </div>
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
                </div>
            </DragDropContext>
        </div>
    );
};

export default ProjectDetailsPage;