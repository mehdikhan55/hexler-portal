"use client"
import { projectServices } from '@/services/projectServices';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Common/Loader';
import { useForm } from 'react-hook-form';
import { ProjectAddSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AddProjectForm from '@/components/Forms/AddProjectForm/AddProjectForm';
import EditProject from '@/components/Projects/EditProject';
import toast from 'react-hot-toast';





interface ProjectItem {
    _id: string;
    projectName: string;
    projectTagline: string;
    projectDescription: string;
    projectCategory: {
        _id: string;
        name: string
    };
    projectImage: string;
    projectLink: string;
    projectOrder: number;
}

const page = ({ params: { projectId } }: any) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [project, setProject] = useState<ProjectItem | null>(null);
    const [imageRemoved, setImageRemoved] = useState(false);
    const [categoriesData, setCategoriesData] = useState<any>(null);
    const router = useRouter();

    
  const fetchCategories = async () => {
    setLoading(true);
    const result = await projectServices.getCategories();
    if (result.success) {
      console.log(result);
      setCategoriesData(result.data);
      console.log(result.data);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  


    const fetchProject = async () => {
        setLoading(true);
        const result = await projectServices.getSingleProject(projectId);
        if (result.success) {
            setProject(result.data);
            await fetchCategories();
            setLoading(false);
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, []);


    const onSubmit = async (values: z.infer<typeof ProjectAddSchema>) => {
        setLoading(true);
        setError(null);

        let formData = new FormData();

        if (values?.projectImage && values.projectImage[0]) {
            // if new image is uploaded
            const file = values.projectImage[0];
            formData.append('updatedImage', file);
            //@ts-ignore
            formData.append('projectImage', null);
        } else {
            // if no new image is uploaded
            //@ts-ignore
            formData.append('projectImage', project?.projectImage);
            //@ts-ignore
            formData.append('updatedImage', null);
        }

        // if image is removed and no new image is uploaded
        if (imageRemoved && !values?.projectImage) {
            formData.delete('projectImage');
            formData.delete('updatedImage');
            //@ts-ignore
            formData.append('projectImage', null);
            //@ts-ignore
            formData.append('updatedImage', null);
        }

        formData.append('projectName', values.projectName);
        formData.append('projectTagline', values.projectTagline);
        formData.append('projectDescription', values.projectDescription);
        formData.append('projectCategory', values.projectCategory);
        formData.append('projectLink', values.projectLink);
        formData.append('projectOrder', values.projectOrder.toString());

        //@ts-ignore
        const { success, data, message } = await projectServices.updateProject(project?._id, formData);
        if (success) {
            console.log('Update successful:', data);
            toast.success('Project updated successfully');
            router.push('/projects');
        } else {
            setError(message);
        }
        setLoading(false);
    };


    return (
        <>
            {loading ? (
                <Loader />
            ) : error ? (
                <div>Project not found</div>
            ) : (
                <EditProject categoriesData={categoriesData} error={error} project={project} onSubmit={onSubmit} loading={loading} setImageRemoved={setImageRemoved} />
            )
            }
        </>
    );
}

export default page
