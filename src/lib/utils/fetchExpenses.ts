import { Expense } from "@/types/Expense";

// Sample categories (You can import these from another file if needed)
const categories = [
  {
    _id: "60c72b2f9b1d4c7f9a2e1234",
    name: "Office Supplies",
    description: "Expenses related to office supplies and materials.",
  },
  {
    _id: "60c72b2f9b1d4c7f9a2e5678",
    name: "Food & Beverages",
    description: "Expenses related to food and drinks.",
  },
  {
    _id: "60c72b2f9b1d4c7f9a2e9012",
    name: "Utilities",
    description: "Expenses for utility bills.",
  },
];

// This is static data, replace it with your API call if needed
export const fetchExpenses = async (): Promise<Expense[]> => {
  return [
    {
      _id: "1",
      amount: 150,
      date: "2024-09-12", // Use Date object
      description: "Office Supplies",
      paymentMethod: "Credit Card",
      category: categories[0], // Reference to the category ID
      isRecurring: false,
      approvalStatus: "pending", // Default status
      budgetedAmount: 200, // Example budgeted amount
    },
    {
      _id: "2",
      amount: 75,
      date: "2024-10-01",
      description: "Coffee and Snacks",
      paymentMethod: "Cash",
      category: categories[1], // Reference to the category ID
      isRecurring: false,
      approvalStatus: "pending", // Default status
      budgetedAmount: 100, // Example budgeted amount
    },
    {
      _id: "3",
      amount: 300,
      date: "2024-10-05",
      description: "Electricity Bill",
      paymentMethod: "Bank Transfer",
      category: categories[2], // Reference to the category ID
      isRecurring: false,
      approvalStatus: "pending", // Default status
      budgetedAmount: 350, // Example budgeted amount
    },
  ];
};
