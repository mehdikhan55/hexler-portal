"use client";

import React, { useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { expenseColumns } from "./ExpenseColumns";
import { Expense } from "@/types/Expense";
import { fetchExpenses } from "@/lib/utils/fetchExpenses";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DatePicker from "./date-picker-demo";
import { Label } from "../ui/label";

export default function ExpenseTable({ data, isLoading }: { data: Expense[], isLoading: boolean }) {

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [singleDate, setSingleDate] = React.useState<Date | null>(null);
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);



    const table = useReactTable({
        data,
        columns: expenseColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        }
    });

    // Function to clear all filters
    const clearFilters = () => {
        setColumnFilters([]);
        setSingleDate(null);
        setStartDate(null);
        setEndDate(null);
        table.getColumn("description")?.setFilterValue('');
        table.getColumn("date")?.setFilterValue({ singleDate: null, startDate: null, endDate: null });
    };

    return (
        <div className="w-full">
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="spinner spinner-primary"></div>
                </div>
            ) :
                (
                    <>
                        <div className="flex flex-wrap gap-1 items-center pt-4 pb-1">
                            <Input
                                placeholder="Filter by description..."
                                value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("description")?.setFilterValue(event.target.value)
                                }
                                className="max-w-xs "
                            />

                            <div className="flex flex-col md:flex-row items-start md:items-center">
                                <Label htmlFor="date-filter" className="mr-2">Filter by exact date:</Label>
                                <DatePicker
                                    id="single-date-filter"
                                    selectedDate={singleDate}
                                    onDateChange={(date) => {
                                        setSingleDate(date);
                                        table.getColumn("date")?.setFilterValue({ singleDate: date, startDate, endDate });
                                    }}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="start-date" className="mr-2">Start Date:</Label>
                                    <DatePicker
                                        id="start-date"
                                        selectedDate={startDate}
                                        onDateChange={(date) => {
                                            setStartDate(date);
                                            table.getColumn("date")?.setFilterValue({ singleDate, startDate: date, endDate });
                                        }}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <Label htmlFor="end-date" className="mr-2">End Date:</Label>
                                    <DatePicker
                                        id="end-date"
                                        selectedDate={endDate}
                                        onDateChange={(date) => {
                                            setEndDate(date);
                                            table.getColumn("date")?.setFilterValue({ singleDate, startDate, endDate: date });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex justify-end  pb-2">
                            {/* Clear Filters Button */}
                            <Button variant="outline" onClick={clearFilters} className="ml-4">
                                Clear Filters
                            </Button>
                        </div>

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
