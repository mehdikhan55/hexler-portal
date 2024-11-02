import { Category } from "@/types/Category";

// This is static data, replace it with your API call if needed
export const fetchExpenseCategories = async (): Promise<Category[]> => {
  return [
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
};
