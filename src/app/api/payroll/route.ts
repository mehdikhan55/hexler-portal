// /api/payrolls
import { NextRequest, NextResponse } from "next/server";
import Payroll from "@/models/payroll";
import dbConnect from "@/lib/dbConnect";
import Employee from "@/models/employee";

// Get all payrolls with optional filters (month, year, employee)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const employee = searchParams.get("employee");


    // Build query object based on filters
    const query: any = {};
    if (month) query.month = parseInt(month), 10;
    if (year) query.year = parseInt(year, 10);
    if (employee) query.employee = employee;

    const payrolls = await Payroll.find(query).populate("employeeId");

    return NextResponse.json({ payrolls }, { status: 200 });
  } catch (error) {
    console.error("Error getting payrolls:", error);
    return NextResponse.json({ message: "Error getting payrolls" }, { status: 500 });
  }
}

// Add a new payroll
export async function POST(req: NextRequest) {
    try {
      await dbConnect();
  
      const payrollData = await req.json();
  
      const newPayroll = new Payroll(payrollData);
      const savedPayroll = await newPayroll.save();
  
      return NextResponse.json(
        { message: "Payroll created successfully", payroll: savedPayroll },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error adding payroll:", error);
      return NextResponse.json({ message: "Error adding payroll" }, { status: 500 });
    }
  }
  
  export const revalidate = 0;