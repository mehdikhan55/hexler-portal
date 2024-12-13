"use client"

import React from 'react';
import { Payroll } from '@/types/Payroll';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { payrollColumns } from './PayrollColumns';

interface PayrollTableProps {
    data: Payroll[];
    isLoading: boolean;
    handlePayrollShow: (Payroll: Payroll) => void;
    handleEditPayroll: (id: string) => void;
    handleDeletePayroll: (id: string) => void;
}

const PayrollTable: React.FC<PayrollTableProps> = ({ data, isLoading, handlePayrollShow,handleEditPayroll,handleDeletePayroll }) => {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    

    // employees
const uniqueEmployees = React.useMemo(() => {
    if (!data) return [];
    // Get unique employee records
    const uniqueEmployeeObj = new Map(
        data
            .filter(payroll => payroll?.employeeId && typeof payroll.employeeId === 'object')
            .map(payroll => {
                const employee = payroll.employeeId as any;
                return [
                    employee._id,
                    {
                        id: employee._id,
                        firstName: employee.firstName,
                        lastName: employee.lastName
                    }
                ];
            })
    );

    // Convert to array and format for select options
    return Array.from(uniqueEmployeeObj.values()).map(employee => ({
        value: employee.id,
        label: `${employee.firstName} ${employee.lastName}`
    }));
}, [data]);


    const table = useReactTable({
        data,
        columns: payrollColumns({ handlePayrollShow,handleEditPayroll, handleDeletePayroll }),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: {
            columnFilters,
        }
    });

    // Function to clear all filters
const clearFilters = () => {
    setColumnFilters([]); // Reset all column filters
    
    // Reset each filter to undefined
    table.getColumn("payMonth")?.setFilterValue(undefined);
    table.getColumn("payYear")?.setFilterValue(undefined);
    table.getColumn("employeeId")?.setFilterValue(undefined);
};

    return (
        <div className="w-full">
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="spinner spinner-primary"></div>
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap gap-4 items-center py-4">
                        {/* Month Select */}
                        <Select
                            value={(table.getColumn("payMonth")?.getFilterValue() as string) ?? ""}
                            onValueChange={(value) => {
                                if (value) {
                                    table.getColumn("payMonth")?.setFilterValue(parseInt(value));
                                } else {
                                    table.getColumn("payMonth")?.setFilterValue(undefined);
                                }
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>All Months</SelectLabel>
                                    {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {/* Year Select */}
                        <Select
                            value={String(table.getColumn("payYear")?.getFilterValue() || "")}
                            onValueChange={(value) => {
                                if (value) {
                                    table.getColumn("payYear")?.setFilterValue(parseInt(value));
                                } else {
                                    table.getColumn("payYear")?.setFilterValue(undefined);
                                }
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>All Years</SelectLabel>
                                    {years.map((year) => (
                                        <SelectItem key={year.value} value={year.value}>
                                            {year.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {/* Employee Select */}
                        <Select
                            value={(table.getColumn("employeeId")?.getFilterValue() as string) ?? ""}
                            onValueChange={(value) =>
                                table.getColumn("employeeId")?.setFilterValue(value)
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>All Employees</SelectLabel>
                                    {uniqueEmployees.map((employee) => (
                                        <SelectItem key={employee.value} value={employee.value}>
                                            {employee.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : header.column.columnDef.header instanceof Function
                                                        //@ts-ignore
                                                        ? header.column.columnDef.header({ column: header.column })
                                                        : header.column.columnDef.header}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>

                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {cell.column.columnDef.cell instanceof Function
                                                        //@ts-ignore
                                                        ? cell.column.columnDef.cell({ row })
                                                        : cell.renderValue()}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={payrollColumns({ handlePayrollShow,handleEditPayroll,handleDeletePayroll }).length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </>

            )}
        </div>
    );
};

export default PayrollTable;



const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
];

const years = [
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" }
];