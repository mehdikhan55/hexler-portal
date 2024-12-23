'use client'
import CustomFormField, { FormFieldType } from '@/components/Form Reusables/CustomFormField';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import DatePicker from '@/components/Expense/date-picker-demo';
import MyDatePicker from '@/components/Common/MyDatePicker';

const NewProjectForm = ({ form, onSubmit, loading, buttonText = "Submit" }: any) => {
    // State for managing modules
    const [currentModule, setCurrentModule] = useState({
        moduleName: '',
        description: '',
        deadline: null as Date | null,
    });
    const [modules, setModules] = useState<any[]>([]);
    const [editingModuleId, setEditingModuleId] = useState<number | null>(null);

    const currencies = ['USD', 'PKR'];

    // Handle module addition/update
    const handleAddModule = () => {
        if (!currentModule.moduleName.trim() || !currentModule.description.trim() || !currentModule.deadline) {
            return; // Prevent empty modules
        }

        if (editingModuleId !== null) {
            setModules(modules.map((module, idx) =>
                idx === editingModuleId ? { ...currentModule } : module
            ));
            setEditingModuleId(null);
        } else {
            setModules([...modules, { ...currentModule }]);
        }

        // Reset form
        setCurrentModule({
            moduleName: '',
            description: '',
            deadline: null
        });
    };

    // Handle module editing
    const handleEditModule = (index: number) => {
        setCurrentModule(modules[index]);
        setEditingModuleId(index);
    };

    // Handle module deletion
    const handleDeleteModule = (index: number) => {
        setModules(modules.filter((_, idx) => idx !== index));
    };

    // Handle form submission
    const handleSubmit = (data: any) => {
        const formData = {
            ...data,
            modules: modules
        };
        console.log('Complete Form Data:', formData);
        onSubmit(formData);
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                                onValueChange={(value) => form.setValue('budget.currency', value)}
                                defaultValue={form.getValues('budget.currency')}
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

                    {/* Module Management Section */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Project Modules</h3>

                                {/* Module Input Form */}
                                <div className="grid gap-4">
                                    <Input
                                        placeholder="Module Name"
                                        value={currentModule.moduleName}
                                        onChange={(e) => setCurrentModule({
                                            ...currentModule,
                                            moduleName: e.target.value
                                        })}
                                    />
                                    <Input
                                        placeholder="Module Description"
                                        value={currentModule.description}
                                        onChange={(e) => setCurrentModule({
                                            ...currentModule,
                                            description: e.target.value
                                        })}
                                    />

                                    {/* Date Picker */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Module Deadline
                                        </label>
                                        <div className="">
                                            {/* <DatePicker
                                                id="module-deadline"
                                                selectedDate={currentModule.deadline}
                                                onDateChange={(date) => setCurrentModule({
                                                    ...currentModule,
                                                    deadline: date
                                                })}
                                                dateFormat="dd/MM/yyyy"
                                            /> */}
                                            <MyDatePicker
                                                selectedDate={currentModule.deadline}
                                                onDateChange={(date) => setCurrentModule({
                                                    ...currentModule,
                                                    deadline: date
                                                })}
                                                dateFormat="dd/MM/yyyy"
                                                className='w-fit'
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={handleAddModule}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        {editingModuleId !== null ? 'Update' : 'Add'} Module
                                    </Button>
                                </div>

                                {/* Module List */}
                                <div className="space-y-2">
                                    {modules.map((module, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                                        >
                                            <div className="space-y-1">
                                                <p className="font-medium">{module.moduleName}</p>
                                                <p className="text-sm text-muted-foreground">{module.description}</p>
                                                <p className="text-sm">Deadline: {module.deadline?.toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditModule(index)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteModule(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-4">
                        <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name="sendForApproval"
                            label="Send for Approval"
                        />
                    </div>

                    <Button type="submit" disabled={loading}>
                        {buttonText}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default NewProjectForm;