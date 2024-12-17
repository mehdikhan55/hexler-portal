// /api/finance/expenses/route.ts
import { NextRequest, NextResponse } from "next/server";
import Expense from "@/models/expense";
import dbConnect from "@/lib/dbConnect";

// Get all expenses with optional filters
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build query object based on filters
    const query: any = {};
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).populate("category").sort({ date: -1 });
    return NextResponse.json({ expenses }, { status: 200 });
  } catch (error) {
    console.error("Error getting expenses:", error);
    return NextResponse.json({ message: "Error getting expenses" }, { status: 500 });
  }
}

// Add a new expense
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const expenseData = await req.json();
    const newExpense = new Expense(expenseData);
    const savedExpense = await newExpense.save();
    await savedExpense.populate("category");

    return NextResponse.json(
      { message: "Expense created successfully", expense: savedExpense },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding expense:", error);
    return NextResponse.json({ message: "Error adding expense" }, { status: 500 });
  }
}

export const revalidate = 0;