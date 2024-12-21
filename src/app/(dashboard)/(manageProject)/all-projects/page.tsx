'use client';
import React, { useState, useEffect } from 'react';  // Added useEffect
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, ListChecks, ChevronDown, ChevronUp, Eye, Edit2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projectsDummyData } from '@/constants/projectManagement'
import { useRouter } from 'next/navigation';
import Loader from "@/components/Common/Loader"; // Added Loader import

// Your existing interfaces remain the same
interface Module {
    moduleName: string;
    description: string;
    isActive: boolean;
    deadline: Date;
}

// Your existing calculation function remains the same
const calculateProjectDuration = (modules: Module[]): number => {
    if (!modules || modules.length === 0) return 0;

    const dates = modules.map(module => module.deadline);
    const latestDate = new Date(Math.max(...dates.map(date => date.getTime())));
    const earliestDate = new Date(Math.min(...dates.map(date => date.getTime())));

    // Calculate difference in days
    const diffTime = Math.abs(latestDate.getTime() - earliestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

export default function Page() {
    const [expandedCards, setExpandedCards] = useState<{ [key: number]: boolean }>({});
    const [loading, setLoading] = useState(true); // Added loading state

    const router = useRouter();

    // Added useEffect for loading simulation
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); // Simulates loading for 1 second

        return () => clearTimeout(timer);
    }, []);

    const handleEdit = (projectId: string) => {
        router.push(`/manage-projects/${projectId}/edit`);
    };

    const handleViewDetails = (projectId: string) => {
        router.push(`/manage-projects/${projectId}`);
    };
    // const handleViewDetails = (projectId: string) => {
    //     router.push(`/manage-projects/projectid/${projectId}`);
    // };

    const toggleCardExpansion = (index: number): void => {
        setExpandedCards(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    // Added loading check
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
            </div>
        );
    }

    // Your existing return statement remains exactly the same
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">All Projects</h1>
            <div className="flex flex-col gap-6">
                {projectsDummyData.map((project, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4">
                            <div className="flex justify-between flex-col-reverse sm:flex-row items-start ">
                                <div>
                                    <h2 className="text-xl font-semibold">{project.projectName}</h2>
                                    <p className="text-sm text-muted-foreground mt-1">{project.projectDescription}</p>
                                </div>
                                <div className="flex items-center justify-between sm:justify-right gap-2 w-full sm:w-auto">
                                    <div className='flex gap-2'>
                                        <button
                                            onClick={() => handleEdit(project._id)}
                                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                            title="Edit Project"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleViewDetails(project._id)}
                                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
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
                        <CardContent className="p-4 space-y-4">
                            {/* Rest of your code remains exactly the same */}
                            {/* Project Budget and Status */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span className="font-semibold">${project.budget.toLocaleString()}</span>
                                </div>
                                <Badge variant={project.isActive ? "default" : "secondary"}>
                                    {project.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>

                            {/* Project Duration */}
                            <div className="flex items-center gap-2 text-sm w-full justify-between">
                                <div className='flex gap-2'>
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span>Duration: {calculateProjectDuration(project.modules)} days</span>
                                </div>
                                <span className="text-muted-foreground">
                                    ({new Date(Math.min(...project.modules.map(m => m.deadline.getTime()))).toLocaleDateString()} - {new Date(Math.max(...project.modules.map(m => m.deadline.getTime()))).toLocaleDateString()})
                                </span>
                            </div>

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
                                                        {module.deadline.toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {module.description}
                                            </p>
                                        </div>
                                    ))}

                                    {/* Expandable modules section */}
                                    {project.modules.length > 2 && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                className="w-full text-sm"
                                                onClick={() => toggleCardExpansion(index)}
                                            >
                                                {!expandedCards[index] ? (
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

                                            {expandedCards[index] && (
                                                <div className="space-y-2 mt-2">
                                                    {project.modules.slice(2).map((module, idx) => (
                                                        <div key={idx + 2} className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium text-sm">{module.moduleName}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span className="text-xs">
                                                                        {module.deadline.toLocaleDateString()}
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
                            <div className="flex items-center justify-between text-sm">
                                <span>Finance Approval:</span>
                                <Badge variant={project.approvedByFinance ? "default" : "secondary"}>
                                    {project.approvedByFinance ? 'Approved' : 'Pending'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}