import { ColumnDef } from "@tanstack/react-table";
import { Payroll } from "@/types/Payroll";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { commonServices } from "@/services/commonServices";

export const payrollColumns = ({
    handlePayrollShow,
    handleEditPayroll,
    handleDeletePayroll
}: {
    handlePayrollShow: (Payroll: Payroll) => void,
    handleEditPayroll: (id: string) => void
    handleDeletePayroll: (id: string) => void
}): ColumnDef<Payroll>[] => [
        {
            accessorKey: "employeeId",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Employee
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const employee = row.getValue("employeeId");
                // Check if employee is an object with firstName and lastName
                if (employee && typeof employee === 'object' && 'firstName' in employee && 'lastName' in employee) {
                    return <div>{`${employee.firstName} ${employee.lastName}`}</div>;
                }
                return <div>Unknown Employee</div>;
            },
            filterFn: (row, columnId, filterValue) => {
                const employee = row.getValue(columnId);
                if (employee && typeof employee === 'object' && '_id' in employee) {
                    return employee._id === filterValue;
                }
                return false;
            },
        },
        {
            accessorKey: "payMonth",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Month
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const month = parseInt(row.getValue("payMonth"));
                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
                return <div>{monthNames[month - 1]}</div>;
            },
            filterFn: (row, columnId, filterValue) => {
                const rowValue = parseInt(row.getValue(columnId));
                return rowValue === parseInt(filterValue);
            },
        },
        {
            accessorKey: "payYear",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Year
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("payYear")}</div>,
            filterFn: (row, columnId, filterValue) => {
                const rowValue = row.getValue(columnId);
                return rowValue === filterValue;
            },
        },
        {
            accessorKey: "baseSalary",
            header: ({ column }) => (
                <Button className="w-full flex justify-end" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span className="text-right">Base Salary</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("baseSalary"));
                return <div className="text-right font-medium">${amount.toFixed(2)}</div>;
            },
        },
        {
            accessorKey: "bonus",
            header: "Bonus",
            cell: ({ row }) => {
                const bonus = parseFloat(row.getValue("bonus")) || 0;
                return <div className="text-right font-medium">${bonus.toFixed(2)}</div>;
            },
        },
        {
            accessorKey: "deductions",
            header: "Deductions",
            cell: ({ row }) => {
                const deductions = parseFloat(row.getValue("deductions")) || 0;
                return <div className="text-right font-medium">${deductions.toFixed(2)}</div>;
            },
        },
        {
            accessorKey: "totalSalary",
            header: ({ column }) => (
                <Button className="w-full flex justify-end" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <span className="text-right">Total</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const total = parseFloat(row.getValue("totalSalary"));
                return <div className="text-right font-medium">${total.toFixed(2)}</div>;
            },
        },
        {
            accessorKey: "isPaid",
            header: "Status",
            cell: ({ row }) => <div>{row.getValue("isPaid") ? "Paid" : "Pending"}</div>,
        },
        {
            accessorKey: "payDate",
            header: "Pay Date",
            cell: ({ row }) => <div>{row.getValue("payDate") ? commonServices.formatISOToDate(row.getValue("payDate")) : "N/A"}</div>,
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const payroll = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* @ts-ignore */}
                            <DropdownMenuItem onClick={() => handlePayrollShow(payroll)}>
                                View Details
                            </DropdownMenuItem>
                            {/* @ts-ignore */}
                            <DropdownMenuItem onClick={() => handleEditPayroll(payroll._id)}>
                                Edit Record
                            </DropdownMenuItem>
                            {/* @ts-ignore */}
                            <DropdownMenuItem onClick={() => handleDeletePayroll(payroll._id)}>
                                Edit Record
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];