// /api/invoices/route.ts
import { NextRequest, NextResponse } from "next/server";
import Invoice from "@/models/invoice";
import dbConnect from "@/lib/dbConnect";
import { generateInvoicePDF } from "@/lib/pdfGenerator";
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();

    // add new attributes to the data object named invoiceNumber, first two letter shoud be the random capital letters,  and next three should be the number of invoices in the database, like 001 to 999, if the latet invoice in the db is 001, then the next invoice should be 002
    const invoices = await Invoice.find();
    const invoiceNumber = invoices.length.toString().padStart(3, '0');
    data.invoiceNumber = `${Math.random().toString(36).substr(2, 2).toUpperCase()}${invoiceNumber}`;


    // Create new invoice and save to database
    const invoice = new Invoice(data);
    await invoice.save();

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice);

    console.log('type of pdf buffer', typeof pdfBuffer);
    console.log('pdf buffer', pdfBuffer);


    // Return PDF as downloadable file
    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`, // Downloadable attachment
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

    console.log('Sending PDF response with buffer size:', pdfBuffer.length);

    // Save the PDF buffer locally for debugging (optional, for local testing)

    fs.writeFileSync(path.join(__dirname, 'invoice-debug.pdf'), pdfBuffer);

    return response;
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ message: "Error creating invoice" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query = status ? { status } : {};
    const invoices = await Invoice.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ invoices }, { status: 200 });
  } catch (error) {
    console.error("Error getting invoices:", error);
    return NextResponse.json({ message: "Error getting invoices" }, { status: 500 });
  }
}


export const revalidate = 0;