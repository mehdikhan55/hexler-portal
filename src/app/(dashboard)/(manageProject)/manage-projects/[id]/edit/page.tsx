'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { projectsDummyData } from '@/constants/projectManagement';
import { useForm } from 'react-hook-form';
import CustomFormField, { FormFieldType } from '@/components/Form Reusables/CustomFormField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Loader from "@/components/Common/Loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModuleData {
  moduleName: string;
  description: string;
  isActive: boolean;
  deadline: Date;
  budget: {
    amount: number;
    currency: string;
  };
}

interface ProjectData {
  _id: string;
  projectName: string;
  projectDescription: string;
  budget: {
    amount: number;
    currency: string;
  };
  isActive: boolean;
  approvalStatus: string;
  approvedByFinance: boolean;
  modules: ModuleData[];
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  const currencies = ['USD', 'PKR'];

  const form = useForm<ProjectData>({
    defaultValues: {
      projectName: '',
      projectDescription: '',
      budget: {
        amount: 0,
        currency: 'USD'
      },
      isActive: false,
      modules: []
    }
  });

  useEffect(() => {
    const fetchProject = async () => {
      const projectId = params.id;
      
      if (projectId) {
        try {
          const project = projectsDummyData.find(p => p._id === projectId);

          if (project) {
            // Transform the budget structure
            const transformedProject = {
              ...project,
              budget: {
                amount: project.budget,
                currency: 'USD' // Default currency for existing data
              },
              modules: project.modules.map(module => ({
                ...module,
                deadline: new Date(module.deadline),
                budget: {
                  amount: 0, // Default amount for existing modules
                  currency: 'USD' // Default currency for existing modules
                }
              }))
            };
            
            setProjectData(transformedProject);

            // Set form default values
            form.reset(transformedProject);
          }
        } catch (error) {
          console.error('Error fetching project:', error);
        } finally {
          setIsPageLoading(false);
        }
      }
    };

    fetchProject();
  }, [params.id, form]);

  const onSubmit = async (data: ProjectData) => {
    try {
      setLoading(true);
      console.log('Updated Project Data:', {
        ...data,
        modules: data.modules.map(module => ({
          ...module,
          deadline: new Date(module.deadline),
        }))
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/all-projects');
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {isPageLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Edit Project</h1>
          </CardHeader>
          <CardContent>
            {projectData ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="projectName"
                    label="Project Name"
                    placeholder="Enter project name"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="projectDescription"
                    label="Project Description"
                    placeholder="Enter project description"
                  />

                  {/* Project Budget Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <CustomFormField
                        fieldType={FormFieldType.NUMBER}
                        control={form.control}
                        name="budget.amount"
                        label="Project Budget Amount"
                        placeholder="Enter budget amount"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Currency
                      </label>
                      <Select 
                        value={form.watch('budget.currency')}
                        onValueChange={(value) => form.setValue('budget.currency', value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-semibold">Modules</h2>
                    {projectData.modules.map((module, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <CustomFormField
                          fieldType={FormFieldType.INPUT}
                          control={form.control}
                          name={`modules.${index}.moduleName`}
                          label="Module Name"
                          placeholder="Enter module name"
                        />

                        <CustomFormField
                          fieldType={FormFieldType.TEXTAREA}
                          control={form.control}
                          name={`modules.${index}.description`}
                          label="Module Description"
                          placeholder="Enter module description"
                        />

                        {/* Module Budget Section */}
                        <div className="grid grid-cols-2 gap-4">
                          <CustomFormField
                            fieldType={FormFieldType.NUMBER}
                            control={form.control}
                            name={`modules.${index}.budget.amount`}
                            label="Module Budget Amount"
                            placeholder="Enter module budget"
                          />
                          <div>
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Module Currency
                            </label>
                            <Select 
                              value={form.watch(`modules.${index}.budget.currency`)}
                              onValueChange={(value) => form.setValue(`modules.${index}.budget.currency`, value)}
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                {currencies.map((currency) => (
                                  <SelectItem key={currency} value={currency}>
                                    {currency}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <CustomFormField
                          fieldType={FormFieldType.DATE}
                          control={form.control}
                          name={`modules.${index}.deadline`}
                          label="Deadline"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="flex justify-center items-center min-h-[40vh]">
                <Loader />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}