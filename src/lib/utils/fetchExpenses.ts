import { Expense } from "@/types/Expense";

// This is static data, replace it with your API call if needed
export const fetchExpenses = async (): Promise<Expense[]> => {
  return [
    {
      id: "1",
      amount: 150,
      date: "2024-09-12",
      description: "Office Supplies",
      paymentMethod: "Credit Card",
    },
    {
      id: "2",
      amount: 75,
      date: "2024-10-01",
      description: "Coffee and Snacks",
      paymentMethod: "Cash",
    },
    {
      id: "3",
      amount: 300,
      date: "2024-10-05",
      description: "Electricity Bill",
      paymentMethod: "Bank Transfer",
    },
  ];
};
