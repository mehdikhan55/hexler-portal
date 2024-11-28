import CustomFormField, { FormFieldType } from '@/components/Form Reusables/CustomFormField'
import { FileUploader } from '@/components/Form Reusables/FileUploader'
import { Button } from '@/components/ui/button'
import { Form, FormControl } from '@/components/ui/form'
import { SelectItem } from '@/components/ui/select'
import { categoriesData } from '@/constants/categoriesData'
import React, { useEffect } from 'react'


const ProjectEditForm = ({ form, onSubmit, loading, buttonText = "Submit", projectImage, setProjectImage,setImageRemoved }: any) => {

    useEffect(() => {
        if (form.watch('projectImage') && form.watch('projectImage').length > 0) {
            setProjectImage(null)
        }
    }, [form.watch('projectImage')])

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
                        label='Project Name'
                        placeholder="Project Name"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="projectTagline"
                        label='Project Tagline'
                        placeholder="Project Tagline"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="projectDescription"
                        label='Project Description'
                        placeholder="Project Description"
                    />

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="projectCategory"
                            label='Project Category'
                            placeholder="Select Category"
                        >
                            {categoriesData.map((category, i) => (
                                <SelectItem key={category.id} value={category.name}>
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
                            label='Project Order (top priority: 1)'
                            placeholder="Project Order"
                        />
                    </div>

                    {/* check below if projectImage is null then show div  */}
                    {projectImage ? (
                        <div className="grid grid-cols-1 md:grid-cols-2  items-center justify-center gap-4">
                            <div className="">
                            <Button
                                onClick={() => {
                                    setProjectImage(null);
                                    setImageRemoved(true);
                                }}
                                className='mb-1'
                            >
                                Remove Image
                            </Button>
                            <img
                                src={projectImage}
                                alt="project"
                                className="w-full max-h-48 object-cover rounded-lg"
                            />
                            </div>
                            {/* //change image  */}
                            <CustomFormField
                                fieldType={FormFieldType.SKELETON}
                                control={form.control}
                                name="projectImage"
                                label="Change Project Image"
                                renderSkeleton={(field) => (
                                    <FormControl>
                                        <FileUploader files={field.value} onChange={field.onChange} />
                                    </FormControl>
                                )}
                            />
                        </div>
                    )
                        :
                        (
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

                        )
                    }

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="projectLink"
                        label='Project Link'
                        placeholder="Project Link"
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        className='w-full '
                    >
                        {loading ? 'Loading...' : buttonText}
                    </Button>

                </form>
            </Form>
        </div>
    )
}

export default ProjectEditForm
