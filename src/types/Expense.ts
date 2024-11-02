export type Category = {
  _id: string;
  name: string;
  description?: string;
};

export type Expense = {
  _id: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
  category: Category;
  isRecurring?: boolean;
  approvalStatus?: "approved" | "disapproved" | "pending";
  budgetedAmount?: number;
};
