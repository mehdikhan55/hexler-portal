"use client";

import React, { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


import { ProjectCategory } from "@/types/Category";
import { projectCategoryColumns } from "../ProjectCategoryColumns";


export default function ProjectCategoryTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: {
    data: ProjectCategory[];
    isLoading: boolean;
    onEdit: (category: ProjectCategory) => void;
    onDelete: (id: string) => void;
}) {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);

    const handleEdit = (category: ProjectCategory) => {
        setSelectedCategory(category);
        setEditModalOpen(true);
    };

    const handleSaveChanges = async () => {
        //@ts-ignore 
        await onEdit(selectedCategory);
        setEditModalOpen(false);
    }

    const handleDelete = async (category: ProjectCategory) => {
        setSelectedCategory(category);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        console.log("Delete confirmed", selectedCategory);
        setDeleteModalOpen(false);
        //@ts-ignore 
        await onDelete(selectedCategory._id);
    };

    const table = useReactTable({
        data,
        columns: projectCategoryColumns({ handleEdit, handleDelete }),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    });

    return (
        <div className="w-full">
            {isLoading ? (
                <div className="flex items-center justify-center h-64">Loading...</div>
            ) : (
                <>
                    <div className="flex flex-wrap gap-1 items-center pt-4 pb-1">
                        <Input
                            placeholder="Filter by category name..."
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                            className="max-w-xs"
                        />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader className="bg-dark-200">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {/* @ts-ignore  */}
                                                {header.isPlaceholder ? null : header.column.columnDef.header}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {/* @ts-ignore  */}
                                                    {cell.column.columnDef.cell ? cell.column.columnDef.cell({ row }) : null}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={projectCategoryColumns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="table-actions flex justify-center mt-4 gap-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            <ArrowLeft />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            <ArrowRight />
                        </Button>
                    </div>

                    {/* Edit Modal */}
                    <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Category</DialogTitle>
                                <DialogDescription>Edit the selected category details below.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Input
                                    value={selectedCategory?.name || ""}
                                    onChange={(e) =>
                                        setSelectedCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))
                                    }
                                />
                                <Input
                                    value={selectedCategory?.description || ""}
                                    onChange={(e) =>
                                        setSelectedCategory((prev) => (prev ? { ...prev, description: e.target.value } : null))
                                    }
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSaveChanges}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Modal */}
                    <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this category?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleConfirmDelete}>
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
}
