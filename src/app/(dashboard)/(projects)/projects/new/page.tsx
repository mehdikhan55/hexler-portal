'use client';

import { ProjectAddSchema } from '@/lib/validations';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';

import AddProjectForm from '@/components/Forms/AddProjectForm/AddProjectForm';
import { projectServices } from '@/services/projectServices';

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } else {
      setError(message);
    }

    setLoading(false);
  };

  return (
    <div className="py-2 pb-4">
      <h1>Add New Project</h1>

      <AddProjectForm form={form} onSubmit={onSubmit} loading={loading} />

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Page;
