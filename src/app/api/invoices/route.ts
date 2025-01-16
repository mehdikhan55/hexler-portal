// /api/invoices/route.ts
import { NextRequest, NextResponse } from "next/server";
import Invoice from "@/models/invoice";
import dbConnect from "@/lib/dbConnect";
import { generateInvoicePDF } from "@/lib/pdfGenerator";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();

    console.log("invoice data comming: ",data)

    const count = await Invoice.countDocuments();
    const invoiceNumber = `DE${String(count + 1).padStart(3, '0')}`;
    // const randomNumber = Math.floor(1000 + Math.random() * 9000);  // Generates a number between 1000 and 9999
    // const invoiceNumber = `DE${randomNumber}`;


    // Add invoice number to data before creating document
    const invoiceData = {
      ...data,
      invoiceNumber
    };

    // Create and save invoice
    const invoice = new Invoice(invoiceData);
    const savedInvoice = await invoice.save();

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(savedInvoice);

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("Error creating invoice:", error);
    if (error instanceof Error) {
      return NextResponse.json({
        message: "Error creating invoice",
        error: error.message
      }, { status: 500 });
    }
    return NextResponse.json({ message: "Error creating invoice" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query = status ? { status } : {};
    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 });

    return NextResponse.json({ invoices }, { status: 200 });
  } catch (error) {
    console.error("Error getting invoices:", error);
    return NextResponse.json({
      message: "Error getting invoices"
    }, { status: 500 });
  }
}

export const revalidate = 0;