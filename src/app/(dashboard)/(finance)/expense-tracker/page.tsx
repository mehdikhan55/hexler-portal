"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import ExpenseTable from '@/components/Expense/ExpenseTable'
import { useState, useEffect } from 'react'
import AddExpense from '@/components/Expense/AddExpense'
import { fetchExpenses } from '@/lib/utils/fetchExpenses'
import { Expense } from '@/types/Expense'
import { fetchExpenseCategories } from '@/lib/utils/fetchExpenseCategories'
import { Category } from '@/types/Category'
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";



const Page = () => {
  const [data, setData] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // New state for categories
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('')


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

  // Fetch initial data
  const loadCategoris = async () => {
    try {
      setIsLoading(true);
      const expenseCategories = await fetchExpenseCategories();
      setCategories(expenseCategories);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadCategoris();
  }, [])


  const handleAddExpense = (newExpense: Expense) => {
    console.log('new expense: ', newExpense)
    setData((prevExpenses) => [...prevExpenses, newExpense]);
    console.log('data after adding', data)
  };

  const handleStatusChange = async () => {
    // alert("Request came for status change")
    handleShow();
  }

  const handleStatusChangeSubmit= async () =>{
    handleClose();
    alert('status change to '+ approvalStatus);
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <h1>Office Expenses</h1>
      {/* Pass the handler to the AddExpense component */}
      <AddExpense categories={categories} onAddExpense={handleAddExpense} />
      <ExpenseTable handleStatusChange={handleStatusChange} data={data} isLoading={isLoading} />

      <Dialog open={show} onOpenChange={handleClose} >
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto z-50">
          <DialogHeader>
            <DialogTitle>Change Approval Status For Expense</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Select Status
            </Label>
            <select
              id="approvalStatus"
              value={approvalStatus}
              onChange={(e) => setApprovalStatus(e.target.value)}
              className="col-span-3 border rounded-md p-2"
              required
            >
              <option value={"pending"}>
                Pending
              </option>
              <option value={"approved"}>
                Approved
              </option>
              <option value={"disapproved"}>
                Disapproved
              </option>
            </select>
          </div>

          <Button type="submit" onClick={handleStatusChangeSubmit}>
            Save Expense
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page;
