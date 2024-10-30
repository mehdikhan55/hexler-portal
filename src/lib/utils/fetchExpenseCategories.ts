import { Category } from "@/types/Category";

// This is static data, replace it with your API call if needed
export const fetchExpenseCategories = async (): Promise<Category[]> => {
  return [
    {
        _id: "640fa1e0f0f5428f8b1e7b76",
        name: "Utilities",
        description: "Expenses related to utility bills such as electricity, water, and gas."
    },
    {
        _id: "640fa1e0f0f5428f8b1e7b77",
        name: "Office Supplies",
        description: "Expenses for items like stationery, printer ink, and office tools."
    },
    {
        _id: "640fa1e0f0f5428f8b1e7b78",
        name: "Maintenance",
        description: "Costs associated with repairs and maintenance of office equipment and facilities."
    },
    {
        _id: "640fa1e0f0f5428f8b1e7b79",
        name: "Rent",
        description: "Monthly office rental expenses."
    },
    {
        _id: "640fa1e0f0f5428f8b1e7b7a",
        name: "Travel",
        description: "Expenses for business travel, including airfare, lodging, and transportation."
    },
    {
        _id: "640fa1e0f0f5428f8b1e7b7b",
        name: "Internet",
        description: "Monthly internet charges for office usage."
    }
  ];
};
