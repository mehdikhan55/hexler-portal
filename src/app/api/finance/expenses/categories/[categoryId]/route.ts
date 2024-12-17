// /api/finance/expenses/categories/[categoryId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Expense from "@/models/expense";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/category";

export async function GET(
    req: NextRequest,
    { params }: { params: { categoryId: string } }
  ) {
    try {
      await dbConnect();
      const category = await Category.findById(params.categoryId);
      
      if (!category) {
        return NextResponse.json({ message: "Category not found" }, { status: 404 });
      }
  
      return NextResponse.json({ category }, { status: 200 });
    } catch (error) {
      console.error("Error getting category:", error);
      return NextResponse.json({ message: "Error getting category" }, { status: 500 });
    }
  }
  
  export async function PUT(
    req: NextRequest,
    { params }: { params: { categoryId: string } }
  ) {
    try {
      await dbConnect();
      const updatedData = await req.json();
      const category = await Category.findByIdAndUpdate(
        params.categoryId,
        { $set: updatedData },
        { new: true }
      );
  
      if (!category) {
        return NextResponse.json({ message: "Category not found" }, { status: 404 });
      }
  
      return NextResponse.json(
        { message: "Category updated successfully", category },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating category:", error);
      return NextResponse.json({ message: "Error updating category" }, { status: 500 });
    }
  }
  
  export async function DELETE(
    req: NextRequest,
    { params }: { params: { categoryId: string } }
  ) {
    try {
      await dbConnect();
      const category = await Category.findByIdAndDelete(params.categoryId);
  
      if (!category) {
        return NextResponse.json({ message: "Category not found" }, { status: 404 });
      }
  
      return NextResponse.json(
        { message: "Category deleted successfully", category },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      return NextResponse.json({ message: "Error deleting category" }, { status: 500 });
    }
  }

  export const revalidate = 0;