import PDFDocument from 'pdfkit';
import path from 'path';

interface InvoiceItem {
  description: string;
  price: number;
}

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
  items: InvoiceItem[];
  subTotal: number;
  credit: number;
  total: number;
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const buffers: Uint8Array[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Add document settings
      doc.font('Helvetica');
      doc.fontSize(10);

      // Add top margin space (25% of A4 height)
      const topMargin = 841.89 * 0.25;
      let currentY = topMargin;

      // Left column header details - BOLD
      doc.font('Helvetica-Bold');
      doc.text(`Invoice #${invoiceData.invoiceNumber}`, 50, currentY);
      doc.text(`NTN # ${invoiceData.ntnNumber}`, 400, currentY);
      doc.text(`Reg No. ${invoiceData.regNumber}`, 400, currentY + 20);

      // Switch back to regular for dates
      doc.font('Helvetica');
      doc.text(`Invoice Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString()}`, 50, currentY + 20);
      doc.text(`Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}`, 50, currentY + 40);

      // Add invoice recipient details - BOLD header and name
      currentY += 80;
      doc.font('Helvetica-Bold');
      doc.text('Invoiced To', 50, currentY);
      doc.text(invoiceData.clientDetails.name, 50, currentY + 20);
      
      // Switch back to regular for remaining details
      doc.font('Helvetica');
      if (invoiceData.clientDetails.company) {
        doc.text(invoiceData.clientDetails.company, 50, currentY + 35);
        currentY += 15;
      }
      doc.text(invoiceData.clientDetails.address, 50, currentY + 35);

      // Create table
      currentY += 100;
      const tableWidth = 500;
      const descriptionColWidth = 350;
      const totalColWidth = 150;
      const totalColumnX = 400;
      const descriptionColumnX = 50;
      
      // Table header with grey background - BOLD
      doc.rect(50, currentY, tableWidth, 30).fill('#f0f0f0');
      doc.rect(50, currentY, tableWidth, 30).stroke();
      doc.fillColor('black');
      doc.font('Helvetica-Bold');

      // Center align "Description" header
      const descHeaderWidth = doc.widthOfString('Description');
      doc.text('Description', 
        descriptionColumnX + (descriptionColWidth - descHeaderWidth)/2, 
        currentY + 10);

      // Center align "Total" header
      const totalHeaderWidth = doc.widthOfString('Total');
      doc.text('Total', 
        totalColumnX + (totalColWidth - totalHeaderWidth)/2, 
        currentY + 10);

        doc.font('Helvetica');
      // Table content
      currentY += 30;
      invoiceData.items.forEach(item => {
        doc.rect(50, currentY, tableWidth, 30).stroke();
        
        // Center align description
        const descWidth = doc.widthOfString(item.description);
        doc.text(item.description, 
          descriptionColumnX + (descriptionColWidth - descWidth)/2, 
          currentY + 10);

        // Center align price
        const priceText = `${item.price.toLocaleString()}/-`;
        const priceWidth = doc.widthOfString(priceText);
        doc.text(priceText, 
          totalColumnX + (totalColWidth - priceWidth)/2, 
          currentY + 10);
        
        currentY += 30;
      });

      // Add empty row if there's only one item
      if (invoiceData.items.length === 1) {
        doc.rect(50, currentY, tableWidth, 30).stroke();
        currentY += 30;
      }

      doc.font('Helvetica-Bold');
      // Sub Total row
      doc.rect(50, currentY, tableWidth, 30).fill('#f0f0f0');
      doc.rect(50, currentY, tableWidth, 30).stroke();
      doc.fillColor('black');
      doc.text('Sub Total', 300, currentY + 10);
      const subTotalText = `Rs. ${invoiceData.subTotal.toLocaleString()}/-`;
      const subTotalWidth = doc.widthOfString(subTotalText);
      doc.text(subTotalText, 
        totalColumnX + (totalColWidth - subTotalWidth)/2, 
        currentY + 10);
      currentY += 30;

      // Credit row
      doc.rect(50, currentY, tableWidth, 30).fill('#f0f0f0');
      doc.rect(50, currentY, tableWidth, 30).stroke();
      doc.fillColor('black');
      doc.text('Credit', 300, currentY + 10);
      const creditText = `Rs. ${invoiceData.credit.toLocaleString()}.00`;
      const creditWidth = doc.widthOfString(creditText);
      doc.text(creditText, 
        totalColumnX + (totalColWidth - creditWidth)/2, 
        currentY + 10);
      currentY += 30;

      // Total row
      doc.rect(50, currentY, tableWidth, 30).fill('#f0f0f0');
      doc.rect(50, currentY, tableWidth, 30).stroke();
      doc.fillColor('black');
      doc.text('Total', 300, currentY + 10);
      const totalText = `Rs ${invoiceData.total.toLocaleString()}/-`;
      const totalWidth = doc.widthOfString(totalText);
      doc.text(totalText, 
        totalColumnX + (totalColWidth - totalWidth)/2, 
        currentY + 10);

      // Add bottom margin space
      doc.moveDown(841.89 * 0.25);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}