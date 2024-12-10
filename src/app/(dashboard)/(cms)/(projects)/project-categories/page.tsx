"use client"
import { useState, useEffect } from 'react'
import { ProjectCategory } from '@/types/Category'
import { fetchProjectCategories } from '@/lib/utils/fetchProjectCategories'
import AddProjectCategory from '@/components/Projects/projectCategories/AddProjectCategory'
import ProjectCategoryTable from '@/components/Projects/projectCategories/ProjectCategoryTable'
import { projectServices } from '@/services/projectServices'
import Loader from '@/components/Common/Loader'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'



const Page = () => {
  const [data, setData] = useState<ProjectCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router =useRouter();


  // Fetch initial data
  const fetchCategories = async () => {
    const result = await projectServices.getCategories();
    if (result.success) {
      console.log(result);
      setData(result.data);
      console.log(result.data);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  const handleEditCategory = async (updatedCategory: ProjectCategory) => {
    setIsLoading(true);
    const { success, data, message } = await projectServices.updateCategory(updatedCategory._id, updatedCategory);
    if (success) {
        console.log('Update successful:', data);
        toast.success('Category updated successfully');
        await fetchCategories();
        setIsLoading(false);
    } else {
        setError(message);
        await fetchCategories();
        setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    console.log("Deleting Category", id)
    console.log(typeof id);
    setIsLoading(true);
    const result=await projectServices.deleteCategory(id);
    if(result.success){
      console.log(result.data);
      toast.success("Category Deleted Successfully");
      await fetchCategories();
      setIsLoading(false);
    }else{
      toast.error(result.message);
      setIsLoading(false);
    }
    await fetchCategories();
  };



  const handleAddCategory = async (newExpenseCategory: ProjectCategory) => {
    const { success, data, message } = await projectServices.addCategory(newExpenseCategory);

    if (success) {
      console.log('Upload successful:', data);
      toast.success('Category added successfully');
      router.push('/project-categories');
    } else {
      setError(message);
    }
    await fetchCategories();
    setIsLoading(false);
  };

  return (
    <div>
      <h1>Project Categories</h1>
      {/* Pass the handler to the AddExpense component */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <>
              <AddProjectCategory onAddCategory={handleAddCategory} />
              <ProjectCategoryTable onEdit={handleEditCategory} onDelete={handleDeleteCategory} data={data} isLoading={isLoading} />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Page;
