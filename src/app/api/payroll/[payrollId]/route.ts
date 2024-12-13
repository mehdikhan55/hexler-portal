// /api/payrolls/:id
import dbConnect from "@/lib/dbConnect";
import Payroll from "@/models/payroll";
import { NextRequest, NextResponse } from "next/server";
import Employee from "@/models/employee";

// Update an existing payroll
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const payrollId = req.nextUrl.pathname.split("/")[3];
    const updatedData = await req.json();

    const updatedPayroll = await Payroll.findByIdAndUpdate(
      payrollId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedPayroll) {
      return NextResponse.json(
        { message: "Payroll not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Payroll updated successfully", payroll: updatedPayroll },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating payroll:", error);
    return NextResponse.json({ message: "Error updating payroll" }, { status: 500 });
  }
}

// Get a single payroll
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const payrollId = req.nextUrl.pathname.split("/")[3];
    const payroll = await Payroll.findById(payrollId).populate("employeeId");

    if (!payroll) {
      return NextResponse.json(
        { message: "Payroll not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ payroll }, { status: 200 });
  } catch (error) {
    console.error("Error getting payroll:", error);
    return NextResponse.json({ message: "Error getting payroll" }, { status: 500 });
  }
}

// Delete a payroll
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const payrollId = req.nextUrl.pathname.split("/")[3];
    const deletedPayroll = await Payroll.findByIdAndDelete(payrollId);

    if (!deletedPayroll) {
      return NextResponse.json(
        { message: "Payroll not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Payroll deleted successfully", payroll: deletedPayroll },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting payroll:", error);
    return NextResponse.json({ message: "Error deleting payroll" }, { status: 500 });
  }
}

export const revalidate = 0;
