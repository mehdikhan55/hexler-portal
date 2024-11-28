"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import DatePicker from "@/components/Expense/date-picker-demo";
import { Expense, Category } from "@/types/Expense";
import { format } from "date-fns";

interface AddExpenseProps {
    onAddExpense: (newExpense: Expense) => void;
    categories: Category[];
}

const AddExpense: React.FC<AddExpenseProps> = ({ onAddExpense, categories }) => {
    const [show, setShow] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [budgetedAmount, setBudgetedAmount] = useState<string>("");
    const [isRecurring, setIsRecurring] = useState<boolean>(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        if (!date || !amount || !description || !paymentMethod || !selectedCategory) {
            alert("All fields are required!");
            return;
        }

        const newExpense: Expense = {
            _id: Math.floor(1000 + Math.random() * 9000).toString(),
            date: format(date, "yyyy-MM-dd"),
            amount: parseFloat(amount),
            description,
            paymentMethod,
            //@ts-ignore
            category: selectedCategory,
            isRecurring,
            approvalStatus: "pending",
            budgetedAmount: parseFloat(budgetedAmount) || 0,
        };

        onAddExpense(newExpense);
        handleClose();
        setDate(null);
        setAmount("");
        setDescription("");
        setPaymentMethod("");
        setSelectedCategory("");
        setBudgetedAmount("");
        setIsRecurring(false);
    };

    return (
        <div className="mb-3 text-end">
            <Button onClick={handleShow} className="bg-green-500">
                Add New
            </Button>

            <Dialog open={show} onOpenChange={handleClose} >
                <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto z-50">
                    <DialogHeader>
                        <DialogTitle>Add New Expense</DialogTitle>
                        <DialogDescription>Please fill out the form below to add a new expense.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Date Picker */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Date
                            </Label>
                            <div className="col-span-3">
                                <DatePicker selectedDate={date} onDateChange={setDate} dateFormat="dd/MM/yyyy" />
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="col-span-3"
                                type="number"
                                required
                            />
                        </div>

                        {/* Description Textarea */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                                placeholder="Enter expense description"
                                required
                            />
                        </div>

                        {/* Payment Method Input */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="paymentMethod" className="text-right">
                                Payment Method
                            </Label>
                            <Input
                                id="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="col-span-3"
                                placeholder="Enter payment method"
                                required
                            />
                        </div>

                        {/* Category Selection */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <select
                                id="category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="col-span-3 border rounded-md p-2"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Budgeted Amount Input */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="budgetedAmount" className="text-right">
                                Budgeted Amount
                            </Label>
                            <Input
                                id="budgetedAmount"
                                value={budgetedAmount}
                                onChange={(e) => setBudgetedAmount(e.target.value)}
                                className="col-span-3"
                                type="number"
                            />
                        </div>

                        {/* Is Recurring Checkbox */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isRecurring" className="text-right">
                                Is Recurring
                            </Label>
                            <input
                                type="checkbox"
                                id="isRecurring"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSubmit}>
                            Save Expense
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddExpense;
