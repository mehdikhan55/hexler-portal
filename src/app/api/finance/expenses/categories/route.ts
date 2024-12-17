// /api/finance/expenses/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import Expense from "@/models/expense";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/category";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Error getting categories:", error);
    return NextResponse.json({ message: "Error getting categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const categoryData = await req.json();
    
    const existingCategory = await Category.findOne({ name: categoryData.name });
    if (existingCategory) {
      return NextResponse.json(
        { message: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const newCategory = new Category(categoryData);
    const savedCategory = await newCategory.save();

    return NextResponse.json(
      { message: "Category created successfully", category: savedCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json({ message: "Error adding category" }, { status: 500 });
  }
}


export const revalidate = 0;