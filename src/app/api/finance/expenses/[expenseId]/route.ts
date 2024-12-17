// /api/finance/expenses/[expenseId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Expense from "@/models/expense";
import dbConnect from "@/lib/dbConnect";

export async function GET(
    req: NextRequest,
    { params }: { params: { expenseId: string } }
  ) {
    try {
      await dbConnect();
      const expense = await Expense.findById(params.expenseId).populate("category");
      
      if (!expense) {
        return NextResponse.json({ message: "Expense not found" }, { status: 404 });
      }
  
      return NextResponse.json({ expense }, { status: 200 });
    } catch (error) {
      console.error("Error getting expense:", error);
      return NextResponse.json({ message: "Error getting expense" }, { status: 500 });
    }
  }
  
  export async function PUT(
    req: NextRequest,
    { params }: { params: { expenseId: string } }
  ) {
    try {
      await dbConnect();
      const updatedData = await req.json();
      const expense = await Expense.findByIdAndUpdate(
        params.expenseId,
        { $set: updatedData },
        { new: true }
      ).populate("category");
  
      if (!expense) {
        return NextResponse.json({ message: "Expense not found" }, { status: 404 });
      }
  
      return NextResponse.json(
        { message: "Expense updated successfully", expense },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating expense:", error);
      return NextResponse.json({ message: "Error updating expense" }, { status: 500 });
    }
  }
  
  export async function DELETE(
    req: NextRequest,
    { params }: { params: { expenseId: string } }
  ) {
    try {
      await dbConnect();
      const expense = await Expense.findByIdAndDelete(params.expenseId);
  
      if (!expense) {
        return NextResponse.json({ message: "Expense not found" }, { status: 404 });
      }
  
      return NextResponse.json(
        { message: "Expense deleted successfully", expense },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
      return NextResponse.json({ message: "Error deleting expense" }, { status: 500 });
    }
  }


  export const revalidate = 0;