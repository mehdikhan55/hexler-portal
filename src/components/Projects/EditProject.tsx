'use client'
import { ProjectEditSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ProjectEditForm from './ProjectEditForm';

const EditProject = ({ onSubmit, loading, project, error, setImageRemoved }: any) => {
    const [projectImage, setProjectImage] = useState<string | null>(null);

    useEffect(() => {
        setProjectImage(project?.projectImage);
    }, []);

    const form = useForm<z.infer<typeof ProjectEditSchema>>({
        resolver: zodResolver(ProjectEditSchema),
        defaultValues: {
            projectName: project?.projectName,
            projectTagline: project?.projectTagline,
            projectDescription: project?.projectDescription,
            projectCategory: project?.projectCategory,
            projectImage: null,
            updatedImage: null,
            projectLink: project?.projectLink,
            projectOrder: project?.projectOrder.toString(),
        }
    });


    return (
        <div>
            <div className="py-2 pb-4">
                <h1>Edit Project: {project?.projectName}</h1>

                <ProjectEditForm
                    form={form}
                    onSubmit={onSubmit}
                    loading={loading}
                    buttonText="Update"
                    projectImage={projectImage}
                    setProjectImage={setProjectImage}
                    setImageRemoved={setImageRemoved} />

                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
        </div>
    )
}

export default EditProject
