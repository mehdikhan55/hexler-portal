"use client";

import React, { useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { expenseColumns } from "./ExpenseColumns";
import { Expense } from "@/types/Expense";
import { fetchExpenses } from "@/lib/utils/fetchExpenses";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ExpenseTable({ data, isLoading }: { data: Expense[], isLoading: boolean }) {

    const [filterValue, setFilterValue] = React.useState("");



    const table = useReactTable({
        data,
        columns: expenseColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="w-full">
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="spinner spinner-primary"></div>
                </div>
            ) :
                (
                    <>
                        {/* <div className="flex items-center py-4">
                <Input
                    placeholder="Filter by description..."
                    value={filterValue}
                    onChange={(event) => {
                        setFilterValue(event.target.value);
                        table.setPageIndex(0); // Reset to page 0 when filtering changes
                    }}
                    className="max-w-sm"
                />
            </div> */}

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className=" bg-dark-200">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id} className="shad-table-row-header">
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : typeof header.column.columnDef.header === "function"
                                                            //@ts-ignore
                                                            ? header.column.columnDef.header({
                                                                column: header.column,
                                                            })
                                                            : header.column.columnDef.header // Handle string directly
                                                    }
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>

                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id} className="shad-table-row">
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {cell.column.columnDef.cell
                                                            //@ts-ignore
                                                            ? cell.column.columnDef.cell({
                                                                row,
                                                            })
                                                            : null}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={expenseColumns.length} className="h-24 text-center">
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="table-actions">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="shad-gray-btn "
                            >
                                <ArrowLeft />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="shad-gray-btn "
                            >
                                <ArrowRight />
                            </Button>
                        </div>
                    </>
                )}
        </div>

    );
}
