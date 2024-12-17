"use client"
import { useState, useEffect } from 'react'
import { Category } from '@/types/Category'
import AddExpenseCategory from '@/components/Expense/expenseCategories/AddExpenseCategory'
import ExpenseCategoryTable from '@/components/Expense/expenseCategories/ExpenseCategoryTable'
import LoadingOverlay from '@/components/Common/LoadingOverlay'
import { expenseServices } from '@/services/expenseServices'
import toast from 'react-hot-toast'

// /expense-categories

const Page = () => {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  // Fetch initial data
  const loadData = async () => {
    try {
      setIsLoading(true); 
      const expenseCategories = await expenseServices.getCategories();
      if (expenseCategories.success) {
        setData(expenseCategories.data);
      } else {
        console.error(expenseCategories.message);
        toast.error('Failed to load expense categories');
      } 
    } catch (e) {
      console.error(e);
      toast.error('Failed to load expense categories');
    } finally {
      setIsLoading(false); 
    }
  };

  const handleEditCategory = async (updatedCategory: Category) => {
    setIsLoading(true);
  try{
    const result = await expenseServices.updateCategory(updatedCategory._id,updatedCategory);
    if(result.success){
      toast.success('Category updated successfully');
      await loadData();
    }else{
      toast.error('Failed to update category');
      console.log(result.message)
    }
  }catch(err){
    toast.error("Failed to updated category");
    console.log(err);
  }
};

const handleDeleteCategory = async (id: string) => {
  setIsLoading(true);
    try{
      const result = await expenseServices.deleteCategory(id);
      if(result.success){
        toast.success('Category deleted successfully');
        await loadData();
      } else {
        toast.error('Failed to delete category');
      }
    }catch(err){
      console.error(err);
      toast.error('Failed to delete category');
    }finally{
      setIsLoading(false);
    }
};

  useEffect(() => {
    loadData(); 
  }, []);


  const handleAddCategory = async (newExpenseCategory:  Omit<Category, '_id'>) => {
    setIsLoading(true);
    try{
      const result = await expenseServices.addCategory(newExpenseCategory);
    if(result.success){
      toast.success('Category added successfully');
      loadData();
    } else {
      toast.error('Failed to add category');
      console.log(result.message);
    }
    }catch(err){
      toast.error('Failed to add category');
      console.error(err);
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div>
      {isLoading && <LoadingOverlay/>}
      <h1>Expense Categories</h1>
      {/* Pass the handler to the AddExpense component */}
      <AddExpenseCategory onAddCategory={handleAddCategory} />
      <ExpenseCategoryTable onEdit={handleEditCategory} onDelete={handleDeleteCategory} data={data} isLoading={isLoading} />
    </div>
  )
}

export default Page;
