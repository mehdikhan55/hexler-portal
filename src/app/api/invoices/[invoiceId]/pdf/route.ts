// /api/invoices/[id]/pdf/route.ts
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
  
      // Generate PDF for existing invoice
      const pdfBuffer = await generateInvoicePDF(invoice);
      
      // Return PDF as downloadable file
      const response = new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
        },
      });
  
      return response;
    } catch (error) {
      console.error("Error getting invoice:", error);
      return NextResponse.json({ message: "Error getting invoice" }, { status: 500 });
    }
  }

  export const revalidate = 0;