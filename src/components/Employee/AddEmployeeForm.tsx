import CustomFormField, { FormFieldType } from '@/components/Form Reusables/CustomFormField'
import { FileUploader } from '@/components/Form Reusables/FileUploader'
import { Button } from '@/components/ui/button'
import { Form, FormControl } from '@/components/ui/form'
import { SelectItem } from '@/components/ui/select'
import DatePicker from "@/components/Expense/date-picker-demo";
import React from 'react'

const AddEmployeeForm = ({ form, onSubmit, loading, buttonText = "Add" }: any) => {
    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex-1 space-y-4"
                >
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="firstName"
                            label='First Name'
                            placeholder="Enter first name"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="lastName"
                            label='Last Name'
                            placeholder="Enter last name"
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="email"
                            label='Email'
                            placeholder="Enter email address"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="phoneNumber"
                            label='Phone Number'
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <div className="flex-1">
                            <label className="text-sm font-medium">Date of Birth</label>
                            <CustomFormField
                                fieldType={FormFieldType.SKELETON}
                                control={form.control}
                                name="dateOfBirth"
                                renderSkeleton={(field) => (
                                    <FormControl>
                                        <DatePicker
                                            selectedDate={field.value ? new Date(field.value) : null}
                                            // @ts-ignore
                                            onDateChange={(date) => {
                                                if (date) {
                                                    // Format date for MongoDB (ISO string)
                                                    field.onChange(date.toISOString());
                                                }
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            id="dob-picker"
                                        />
                                    </FormControl>
                                )}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="text-sm font-medium">Hire Date</label>
                            <CustomFormField
                                fieldType={FormFieldType.SKELETON}
                                control={form.control}
                                name="hireDate"
                                renderSkeleton={(field) => (
                                    <FormControl>
                                        <DatePicker
                                            selectedDate={field.value ? new Date(field.value) : null}
                                            // @ts-ignore
                                            onDateChange={(date) => {
                                                if (date) {
                                                    // Format date for MongoDB (ISO string)
                                                    field.onChange(date.toISOString());
                                                }
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            id="hire-date-picker"
                                        />
                                    </FormControl>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="position"
                            label='Position'
                            placeholder="Enter position"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="status"
                            label='Status'
                            placeholder="Select status"
                        >
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                        </CustomFormField>
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="department"
                            label='Department'
                            placeholder="Select department"
                            disabled={true}
                        >
                            {/* Add department options here */}
                            <SelectItem value="dept1">Department 1</SelectItem>
                            <SelectItem value="dept2">Department 2</SelectItem>
                        </CustomFormField>

                        <CustomFormField
                            fieldType={FormFieldType.NUMBER}
                            control={form.control}
                            name="salary"
                            label='Salary'
                            placeholder="Enter salary"
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium">Address Information</h3>
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="address.street"
                                label='Street'
                                placeholder="Enter street address"
                            />
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="address.city"
                                label='City'
                                placeholder="Enter city"
                            />
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="address.state"
                                label='State'
                                placeholder="Enter state"
                            />
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="address.zip"
                                label='ZIP Code'
                                placeholder="Enter ZIP code"
                            />
                        </div>
                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="profilePhoto"
                        label="Profile Photo"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <FileUploader files={field.value} onChange={field.onChange} />
                            </FormControl>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Loading...' : buttonText}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default AddEmployeeForm