'use client';

import { ProjectAddSchema } from '@/lib/validations';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';

import AddProjectForm from '@/components/Forms/AddProjectForm/AddProjectForm';
import { projectServices } from '@/services/projectServices';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Common/Loader';

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const Router = useRouter();
  const [categoriesData, setCategoriesData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof ProjectAddSchema>>({
    resolver: zodResolver(ProjectAddSchema),
    defaultValues: {
      projectName: '',
      projectTagline: '',
      projectDescription: '',
      projectCategory: '',
      projectImage: null,
      projectLink: '',
      projectOrder: '1'
    }
  });

  const onSubmit = async (values: z.infer<typeof ProjectAddSchema>) => {
    setLoading(true);
    setError(null);
    console.log('Submitting project:', values);

    let formData = new FormData();
    if (values?.projectImage && values.projectImage[0]) {
      const file = values.projectImage[0];
      formData.append('projectImage', file);
    }
    formData.append('projectName', values.projectName);
    formData.append('projectTagline', values.projectTagline);
    formData.append('projectDescription', values.projectDescription);
    formData.append('projectCategory', values.projectCategory);
    formData.append('projectLink', values.projectLink);
    formData.append('projectOrder', values.projectOrder.toString());

    const { success, data, message } = await projectServices.addProject(formData);

    if (success) {
      console.log('Upload successful:', data);
      toast.success('Project added successfully');
      form.reset();
      Router.push('/projects');
    } else {
      setError(message);
    }

    setLoading(false);
  };

  // Fetch initial data
  const fetchCategories = async () => {
    setIsLoading(true);
    const result = await projectServices.getCategories();
    if (result.success) {
      console.log(result);
      setCategoriesData(result.data);
      console.log(result.data);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="py-2 pb-4">
      <h1>Add New Project</h1>
      {isLoading ? (
        <Loader />
      ) : (

        <AddProjectForm categoriesData={categoriesData} form={form} onSubmit={onSubmit} loading={loading} />
      )}

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Page;
