// models/invoice.ts
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
      required: true,
      min: 0
    },
  }],
  subTotal: {
    type: Number,
    required: true,
    min: 0
  },
  credit: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'OVERDUE'],
    default: 'PENDING'
  }
}, { 
  timestamps: true,
});

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);