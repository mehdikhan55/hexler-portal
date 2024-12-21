'use client';

import { NewProjectSchema } from '@/lib/validations';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import NewProjectForm from '@/components/Forms/projectManagementForm/NewProjectForm';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Loader from "@/components/Common/Loader";
import { projectManagementServices } from '@/services/projectManagementServices';

const Page = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const router = useRouter();

    const form = useForm<z.infer<typeof NewProjectSchema>>({
        resolver: zodResolver(NewProjectSchema),
        defaultValues: {
            projectName: '',
            projectDescription: '',
            budget: {
                amount: 0,
                currency: 'USD'
            },
            sendForApproval: false,
            isActive: true,
            modules: []
        }
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPageLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const onSubmit = async (values: z.infer<typeof NewProjectSchema>) => {
        try {
            setLoading(true);
            setError(null);
    
            console.log('Form Values:', values);
    
            // Call the project management service to create the project
            const result = await projectManagementServices.addProject({
                projectName: values.projectName,
                projectDescription: values.projectDescription,
                sendForApproval: values.sendForApproval,
                projectStatus: 'ACTIVE',
                budget: {
                    amount: values.budget.amount,
                    currency: values.budget.currency
                },
                approvedByFinance: false,
                modules: values.modules.map(module => ({
                    moduleName: module.moduleName,
                    description: module.description,
                    deadline: new Date(module.deadline)
                }))
            });
    
            if (result.success) {
                toast.success('Project created successfully');
                router.push('/manage-projects');
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (isPageLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <div className="py-2 pb-4">
            <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
            
            <NewProjectForm 
                form={form} 
                onSubmit={onSubmit} 
                loading={loading} 
                buttonText={loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <span>Creating...</span>
                    </div>
                ) : "Create Project"}
            />

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Page;