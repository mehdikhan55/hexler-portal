"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExpenseTable from '@/components/Expense/ExpenseTable'
import { useState, useEffect } from 'react'
import AddExpense from '@/components/Expense/AddExpense'
import { Expense } from '@/types/Expense'
import { Category } from '@/types/Category'
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/Common/LoadingOverlay";
import { expenseServices } from '@/services/expenseServices';
import toast from 'react-hot-toast';

const Page = () => {
  const [data, setData] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('')
  const [selectedExpenseId, setSelectedExpenseId] = useState<string>('');

  // Fetch expenses data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const result = await expenseServices.getExpenses();
      if (result.success) {
        setData(result.data);
      } else {
        toast.error('Failed to load expenses');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error loading expenses');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories data
  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const result = await expenseServices.getCategories();
      if (result.success) {
        setCategories(result.data);
      } else {
        toast.error('Failed to load categories');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error loading categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  const handleAddExpense = async (newExpense: Omit<Expense, '_id'>) => {
    try {
      setIsLoading(true);
      const result = await expenseServices.addExpense(newExpense);
      if (result.success) {
        setData(prevExpenses => [...prevExpenses, result.data]);
        toast.success('Expense added successfully');
      } else {
        toast.error('Failed to add expense');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error adding expense');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string) => {
    setSelectedExpenseId(id);
    handleShow();
  }

  const handleStatusChangeSubmit = async () => {
    try {
      setIsLoading(true);
      const result = await expenseServices.updateExpenseStatus(
        selectedExpenseId,
        approvalStatus as 'approved' | 'disapproved' | 'pending'
      );

      if (result.success) {
        toast.success(`Status updated to ${approvalStatus}`);
        await loadData(); // Reload data to show updated status
      } else {
        toast.error('Failed to update status');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error updating status');
    } finally {
      setIsLoading(false);
      handleClose();
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      {isLoading && <LoadingOverlay/>}
      <h1>Office Expenses</h1>
      <AddExpense categories={categories} onAddExpense={handleAddExpense} />
      <ExpenseTable handleStatusChange={handleStatusChange} data={data} isLoading={isLoading} />

      <Dialog open={show} onOpenChange={handleClose}>
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="disapproved">Disapproved</option>
            </select>
          </div>

          <Button 
            type="submit" 
            onClick={handleStatusChangeSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Status'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page;