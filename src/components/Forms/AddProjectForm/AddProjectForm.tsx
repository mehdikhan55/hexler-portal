'use client'
import CustomFormField, { FormFieldType } from '@/components/Form Reusables/CustomFormField';
import { FileUploader } from '@/components/Form Reusables/FileUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectItem } from '@/components/ui/select';
import { Edit, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import DatePicker from '@/components/Expense/date-picker-demo';

const AddProjectForm = ({ form, onSubmit, loading, buttonText = "Submit", categoriesData }: any) => {
    // State declarations
    // const [currentModule, setCurrentModule] = useState<string>(''); // For module name input
    // const [modules, setModules] = useState<{ id: string; name: string }[]>([]); // List of modules
    // const [editingModuleId, setEditingModuleId] = useState<string | null>(null); // ID of the module being edited

    // Function to handle adding a new module or updating an existing one
    // const handleAddModule = () => {
    //     if (!currentModule.trim()) return; // Prevent empty module names

    //     if (editingModuleId) {
    //         // Update existing module
    //         setModules((prev) =>
    //             prev.map((module) =>
    //                 module.id === editingModuleId ? { ...module, name: currentModule } : module
    //             )
    //         );
    //         setEditingModuleId(null);
    //     } else {
    //         // Add new module
    //         setModules((prev) => [
    //             ...prev,
    //             { id: Date.now().toString(), name: currentModule },
    //         ]);
    //     }

    //     setCurrentModule(''); // Clear input field
    // };

    // // Function to handle editing a module
    // const handleEditModule = (id: string) => {
    //     const moduleToEdit = modules.find((module) => module.id === id);
    //     if (moduleToEdit) {
    //         setCurrentModule(moduleToEdit.name);
    //         setEditingModuleId(id);
    //     }
    // };

    // Function to handle deleting a module
    // const handleDeleteModule = (id: string) => {
    //     setModules((prev) => prev.filter((module) => module.id !== id));
    // };

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex-1 space-y-4"
                >
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="projectName"
                        label="Project Name"
                        placeholder="Project Name"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="projectTagline"
                        label="Project Tagline"
                        placeholder="Project Tagline"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="projectDescription"
                        label="Project Description"
                        placeholder="Project Description"
                    />

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="projectCategory"
                            label="Project Category"
                            placeholder="Select Category"
                        >
                            {categoriesData.map((category: any) => (
                                <SelectItem key={category._id} value={category._id}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <p>{category.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>

                        <CustomFormField
                            fieldType={FormFieldType.NUMBER}
                            control={form.control}
                            name="projectOrder"
                            label="Project Order (top priority: 1)"
                            placeholder="Project Order"
                        />
                    </div>

                    {/* Module Management Section */}
                    {/* <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Project Modules</h3>

                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter module name"
                                        value={currentModule}
                                        onChange={(e) => setCurrentModule(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddModule}
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        {editingModuleId ? 'Update' : 'Add'} Module
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {modules.map((module) => (
                                        <div
                                            key={module.id}
                                            className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                                        >
                                            <span>{module.name}</span>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditModule(module.id)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteModule(module.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}


                    {/* Starting and Ending Date  */}
                    
                    <div className="flex flex-row gap-6 w-fit">
                        {/* Start Date */}
                        {/* <CustomFormField
                            fieldType={FormFieldType.SKELETON}
                            control={form.control}
                            name="startDate"
                            label="Project Start Date"
                            renderSkeleton={(field) => (
                                <FormControl className="w-full">
                                    <DatePicker
                                        id="project-start-date"
                                        selectedDate={field.value}
                                        onDateChange={(date: Date | null) => field.onChange(date)}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </FormControl>
                            )}
                        /> */}

                        {/* End Date */}
                        {/* <CustomFormField
                            fieldType={FormFieldType.SKELETON}
                            control={form.control}
                            name="endDate"
                            label="Project End Date"
                            renderSkeleton={(field) => (
                                <FormControl className="w-full">
                                    <DatePicker
                                        id="project-end-date"
                                        selectedDate={field.value}
                                        onDateChange={(date: Date | null) => field.onChange(date)}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </FormControl>
                            )}
                        /> */}
                    </div>
                    

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="projectImage"
                        label="Project Image"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <FileUploader files={field.value} onChange={field.onChange} />
                            </FormControl>
                        )}
                    />

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="projectLink"
                        label="Project Link"
                        placeholder="Project Link"
                    />

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : buttonText}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AddProjectForm;
