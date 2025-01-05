import PDFDocument from 'pdfkit';
import path from 'path';

// Resolve the path to the logo relative to the current directory
const logoPath = path.resolve('./public/assets/brand/logo.png');

interface InvoiceData {
  invoiceNumber: string;
  ntnNumber: string;
  regNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  clientDetails: {
    name: string;
    company?: string;
    address: string;
  };
  description: string;
  amount: number;
  credit: number;
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const buffers: Uint8Array[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Add Hexler Tech logo
      doc.image(logoPath, 50, 40, { width: 150 });

      // Add header details
      doc.fontSize(10).font('Helvetica-Bold')
        .text(`Invoice #${invoiceData.invoiceNumber}`, 50, 120)
        .text(`NTN #${invoiceData.ntnNumber}`, 400, 120)
        .text(`Invoice Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString()}`, 50, 140)
        .text(`Reg No. ${invoiceData.regNumber}`, 400, 140)
        .text(`Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}`, 50, 160);

      // Add client details
      doc.font('Helvetica').fontSize(10)
        .text('Invoiced To:', 50, 200)
        .text(invoiceData.clientDetails.name, 50, 220)
        .text(invoiceData.clientDetails.company || '', 50, 240)
        .text(invoiceData.clientDetails.address, 50, 260);

      // Add table header
      doc.font('Helvetica-Bold')
        .text('Description', 50, 300, { underline: true })
        .text('Total', 400, 300, { underline: true });

      // Add table content
      doc.font('Helvetica')
        .text(invoiceData.description, 50, 320)
        .text(`Rs. ${invoiceData.amount.toLocaleString()}/-`, 400, 320);

      // Add totals
      const totalsY = 400;
      doc.text('Sub Total', 300, totalsY)
        .text(`Rs. ${invoiceData.amount.toLocaleString()}/-`, 400, totalsY)
        .text('Credit', 300, totalsY + 20)
        .text(`Rs. ${invoiceData.credit.toLocaleString()}/-`, 400, totalsY + 20)
        .text('Total', 300, totalsY + 40)
        .font('Helvetica-Bold')
        .text(`Rs. ${(invoiceData.amount - invoiceData.credit).toLocaleString()}/-`, 400, totalsY + 40);

      // Add footer
      const footerY = 700;
      doc.fontSize(8).font('Helvetica')
        .text('ISLAMABAD', 50, footerY)
        .text('Street 30, Defence Villas, Sector F, DHA PHASE 1', 50, footerY + 15)
        .text('+92 344 9200674', 400, footerY)
        .text('info@hexlertech.com', 400, footerY + 15)
        .text('www.hexlertech.com', 400, footerY + 30);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
