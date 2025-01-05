export type Invoice = {
    _id: string;
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
    items: {
      description: string;
      price: number;
    }[];
    subTotal: number;
    credit: number;
    total: number;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    pdfUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  