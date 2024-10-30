"use client"
import { useState, useEffect } from 'react'
import { Category } from '@/types/Category'
import { fetchExpenseCategories } from '@/lib/utils/fetchExpenseCategories'
import AddExpenseCategory from '@/components/Expense/expenseCategories/AddExpenseCategory'
import ExpenseCategoryTable from '@/components/Expense/expenseCategories/ExpenseCategoryTable'



const Page = () => {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  // Fetch initial data
  const loadData = async () => {
    try {
      setIsLoading(true); 
      const expenseCategories = await fetchExpenseCategories();
      setData(expenseCategories); 
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleEditCategory = async (updatedCategory: Category) => {
    setData((prevExpenseCategories) =>
        prevExpenseCategories.map((category) =>
            category._id === updatedCategory._id ? updatedCategory : category
        )
    );
};

const handleDeleteCategory = async (id: string) => {
    setData((prevExpenseCategories) =>
        prevExpenseCategories.filter((category) => category._id !== id)
    );
    await fetchExpenseCategories();
};

  useEffect(() => {
    loadData(); 
  }, []);


  const handleAddCategory = (newExpenseCategory: Category) => {
    setData((prevExpenseCategories) => [...prevExpenseCategories, newExpenseCategory]);
  };

  return (
    <div>
      <h1>Expense Categories</h1>
      {/* Pass the handler to the AddExpense component */}
      <AddExpenseCategory onAddCategory={handleAddCategory} />
      <ExpenseCategoryTable onEdit={handleEditCategory} onDelete={handleDeleteCategory} data={data} isLoading={isLoading} />
    </div>
  )
}

export default Page;
