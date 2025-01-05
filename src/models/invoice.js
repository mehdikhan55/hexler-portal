// models/invoice.js
import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  ntnNumber: {
    type: String,
    required: true
  },
  regNumber: {
    type: String,
    required: true
  },
  invoiceDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  clientDetails: {
    name: {
      type: String,
      required: true
    },
    company: String,
    address: {
      type: String,
      required: true
    }
  },
  items: [{
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
  }],
  subTotal: {
    type: Number,
    default: 0
  },
  credit: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'OVERDUE'],
    default: 'PENDING'
  },
  pdfUrl: String
}, { timestamps: true });

// Auto-generate invoice number
invoiceSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `DE${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);