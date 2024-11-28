'use client';
import React, { useEffect, useState } from 'react';
import { projectServices } from '@/services/projectServices';
import ProjectCard from '@/components/Projects/ProjectCard';
import Loader from "@/components/Common/Loader"

const Page = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    const result = await projectServices.getProjects();
    if (result.success) {
      setProjects(result.data);
      console.log(result.data);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">All Projects</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} fetchProjects={fetchProjects}/>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
