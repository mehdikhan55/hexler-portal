// /api/invoices/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Invoice from "@/models/invoice";
import dbConnect from "@/lib/dbConnect";
import { generateInvoicePDF } from "@/lib/pdfGenerator";

export async function GET(
  req: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  try {
    await dbConnect();
    const invoice = await Invoice.findById(params.invoiceId);
    
    if (!invoice) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ invoice }, { status: 200 });
  } catch (error) {
    console.error("Error getting invoice:", error);
    return NextResponse.json({ message: "Error getting invoice" }, { status: 500 });
  }
}

// Update invoice
export async function PUT(
  req: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  try {
    await dbConnect();
    const updatedData = await req.json();
    
    const invoice = await Invoice.findByIdAndUpdate(
      params.invoiceId,
      { $set: updatedData },
      { new: true }
    );

    if (!invoice) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Invoice updated successfully", invoice },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { message: "Error updating invoice" },
      { status: 500 }
    );
  }
}

// Delete invoice
export async function DELETE(
  req: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  try {
    await dbConnect();
    const invoice = await Invoice.findByIdAndDelete(params.invoiceId);

    if (!invoice) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Invoice deleted successfully", invoice },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { message: "Error deleting invoice" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;