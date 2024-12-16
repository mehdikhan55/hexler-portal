"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AddCareer, Career } from "@/types/Career";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface AddCareerProps {
    onAddCareer: (newCareer: AddCareer) => void;
}

const AddCareers: React.FC<AddCareerProps> = ({ onAddCareer }) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [active, setActive] = useState<boolean>(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        if (!name) {
            alert("Category name is required!");
            return;
        }

        const newCareer: AddCareer = {
            name,
            description,
            isActive:active
        };

        onAddCareer(newCareer);
        handleClose();
        setName("");
        setDescription("");
        setActive(true);
    };

    return (
        <div className="mb-3 text-end">
            <Button onClick={handleShow} className="bg-green-500">
                Add New Career
            </Button>

            <Dialog open={show} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Career</DialogTitle>
                        <DialogDescription>Please fill out the form below to add a new Career.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                                placeholder="Optional"
                            />
                            <Select
                                value={active ? "active" : "inactive"}
                                onValueChange={(value) => {
                                    if (value === "active") {
                                        setActive(true);
                                    } else {
                                        setActive(false);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inActive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSubmit}>
                            Save Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddCareers;
