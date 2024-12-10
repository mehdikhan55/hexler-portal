import { Category } from "@/types/Category";

// This is static data, replace it with your API call if needed
export const fetchProjectCategories = async (): Promise<Category[]> => {
  return [
    {
        _id: "60c72b2f9b1d4c7f9a2e1234",
        name: "Web Development",
        description: "This category includes all web development projects.",
      },
      {
        _id: "60c72b2f9b1d4c7f9a2e5678",
        name: "App Development",
        description: "This category includes all app development projects.",
      },
      {
        _id: "60c72b2f9b1d4c7f9a2e9012",
        name: "UI/UX Design",
        description: "This category includes all UI/UX design projects.",
      },
  ];
};
