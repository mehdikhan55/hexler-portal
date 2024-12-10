"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Category } from "@/types/Category";

interface AddExpenseCategoryProps {
  onAddCategory: (newCategory: Category) => void;
}

const AddProjectCategory: React.FC<AddExpenseCategoryProps> = ({ onAddCategory }) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    if (!name) {
      alert("Category name is required!");
      return;
    }

    const newCategory: Category = {
      _id: Math.random().toString(),
      name,
      description,
    };

    onAddCategory(newCategory);
    handleClose();
    setName("");
    setDescription("");
  };

  return (
    <div className="mb-3 text-end">
      <Button onClick={handleShow} className="bg-green-500">
        Add New Category
      </Button>

      <Dialog open={show} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense Category</DialogTitle>
            <DialogDescription>Please fill out the form below to add a new category.</DialogDescription>
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

export default AddProjectCategory;
