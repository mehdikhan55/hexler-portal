"use client"
import ExpenseTable from '@/components/Expense/ExpenseTable'
import { useState, useEffect } from 'react'
import AddExpense from '@/components/Expense/AddExpense'
import { fetchExpenses } from '@/lib/utils/fetchExpenses'
import { Expense } from '@/types/Expense'



const Page = () => {
  const [data, setData] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  // Fetch initial data
  const loadData = async () => {
    try {
      setIsLoading(true); 
      const expenses = await fetchExpenses();
      setData(expenses); 
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    loadData(); 
  }, []);


  const handleAddExpense = (newExpense: Expense) => {
    setData((prevExpenses) => [...prevExpenses, newExpense]);
  };

  return (
    <div>
      <h1>Office Expenses</h1>
      {/* Pass the handler to the AddExpense component */}
      <AddExpense onAddExpense={handleAddExpense} />
      <ExpenseTable data={data} isLoading={isLoading} />
    </div>
  )
}

export default Page;
