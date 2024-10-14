"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea"; 
import DatePicker from "@/components/Expense/date-picker-demo"; 
import { Expense } from "@/types/Expense"; 
import { format } from "date-fns";

interface AddExpenseProps {
    onAddExpense: (newExpense: Expense) => void; 
}

const AddExpense: React.FC<AddExpenseProps> = ({ onAddExpense }) => {
    const [show, setShow] = useState(false);
    const [date, setDate] = useState<Date | null>(null); 
    const [amount, setAmount] = useState<string>("");
    const [description, setDescription] = useState<string>(""); 
    const [paymentMethod, setPaymentMethod] = useState<string>(""); 

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
       
        if (!date || !amount || !description || !paymentMethod) {
            alert("All fields are required!");
            return;
        }

        const newExpense: Expense = {
            id: Math.floor(1000 + Math.random() * 9000).toString(), //4 digit
            date: format(date, "dd/MM/yyyy"), // Format date as a string
            amount: parseFloat(amount),
            description,
            paymentMethod, // Include payment method
        };

        onAddExpense(newExpense); // Pass the new expense to the parent component
        handleClose(); // Close the dialog
        setDate(null);
        setAmount("");
        setDescription("");
        setPaymentMethod(""); // Reset payment method after submission
    };

    return (
        <div className="mb-3 text-end">
            <Button onClick={handleShow} className="bg-green-500">
                Add New
            </Button>

            <Dialog open={show} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Expense</DialogTitle>
                        <DialogDescription>Please fill out the form below to add a new expense.</DialogDescription> {/* Added description */}
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Date Picker */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Date
                            </Label>
                            <div className="col-span-3 ">
                                <DatePicker
                                    selectedDate={date}
                                    onDateChange={setDate} // Set the date to the state
                                    dateFormat="dd/MM/yyyy" // Display date in dd/MM/yyyy
                                />
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
                                onChange={(e) => setDescription(e.target.value)} // Set description to state
                                className="col-span-3"
                                placeholder="Enter expense description"
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
                                onChange={(e) => setPaymentMethod(e.target.value)} // Set payment method to state
                                className="col-span-3"
                                placeholder="Enter payment method"
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
