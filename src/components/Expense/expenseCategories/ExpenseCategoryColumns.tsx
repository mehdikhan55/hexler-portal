import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/types/Category";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";


export const expenseCategoryColumns = ({
    handleEdit,
    handleDelete,
}: {
    handleEdit: (category: Category) => void;
    handleDelete: (category: Category) => void;
}): ColumnDef<Category>[] => [
    {
        accessorKey: "_id",
        header: "ID",
        cell: ({ row }) => <div>{row.getValue("_id")}</div>,
    },
    {
        accessorKey: "name",
        header: "Category Name",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(row.original)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];
