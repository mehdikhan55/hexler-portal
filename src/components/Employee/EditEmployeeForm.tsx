import CustomFormField, { FormFieldType } from '@/components/Form Reusables/CustomFormField'
import { FileUploader } from '@/components/Form Reusables/FileUploader'
import { Button } from '@/components/ui/button'
import { Form, FormControl } from '@/components/ui/form'
import { SelectItem } from '@/components/ui/select'
import React, { useEffect } from 'react'
import DatePicker from '../Expense/date-picker-demo'

interface EditEmployeeFormProps {
    form: any;
    onSubmit: (values: any) => Promise<void>;
    loading: boolean;
    buttonText?: string;
    profilePhoto: string | null;
    setProfilePhoto: (value: string | null) => void;
    setImageRemoved: (value: boolean) => void;
}

const EditEmployeeForm = ({
    form,
    onSubmit,
    loading,
    buttonText = "Submit",
    profilePhoto,
    setProfilePhoto,
    setImageRemoved
}: EditEmployeeFormProps) => {

    useEffect(() => {
        if (form.watch('profilePhoto') && form.watch('profilePhoto').length > 0) {
            setProfilePhoto(null)
        }
    }, [form.watch('profilePhoto')])

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex-1 space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="firstName"
                            label="First Name"
                            placeholder="First Name"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="lastName"
                            label="Last Name"
                            placeholder="Last Name"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Email"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="phoneNumber"
                            label="Phone Number"
                            placeholder="Phone Number"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="position"
                            label="Position"
                            placeholder="Position"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="status"
                            label="Status"
                            placeholder="Select Status"
                        >
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                        </CustomFormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="department"
                            label="Department"
                            placeholder="Department"
                            disabled={true}
                        />

                        <CustomFormField
                            fieldType={FormFieldType.NUMBER}
                            control={form.control}
                            name="salary"
                            label="Salary"
                            placeholder="Salary"
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="address.street"
                                label="Street"
                                placeholder="Street"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="address.city"
                                label="City"
                                placeholder="City"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="address.state"
                                label="State"
                                placeholder="State"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="address.zip"
                                label="ZIP Code"
                                placeholder="ZIP Code"
                            />
                        </div>
                    </div>

                    {profilePhoto ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-4">
                            <div>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setProfilePhoto(null);
                                        setImageRemoved(true);
                                    }}
                                    className="mb-2"
                                >
                                    Remove Photo
                                </Button>
                                <img
                                    src={(profilePhoto === "/images/default-profile.jpg") ? "/assets/default-profile.jpg" : profilePhoto }
                                    alt="profile"
                                    className="w-full max-h-48 object-cover rounded-lg"
                                />
                            </div>
                            <CustomFormField
                                fieldType={FormFieldType.SKELETON}
                                control={form.control}
                                name="profilePhoto"
                                label="Change Profile Photo"
                                renderSkeleton={(field) => (
                                    <FormControl>
                                        <FileUploader files={field.value} onChange={field.onChange} />
                                    </FormControl>
                                )}
                            />
                        </div>
                    ) : (
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
                    )}

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

export default EditEmployeeForm