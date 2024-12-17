// /api/finance/expenses/[expenseId]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import Expense from "@/models/expense";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { expenseId: string } }
) {
  try {
    await dbConnect();

    const { status } = await req.json();

    // Validate status
    const validStatuses = ['approved', 'disapproved', 'pending'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const expense = await Expense.findByIdAndUpdate(
      params.expenseId,
      { $set: { approvalStatus: status } },
      { new: true }
    ).populate("category");

    if (!expense) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Status updated successfully", expense },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating expense status:", error);
    return NextResponse.json(
      { message: "Error updating expense status" },
      { status: 500 }
    );
  }
}
