import mongoose from 'mongoose';

const chequeSchema = new mongoose.Schema({
    payee: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Issued', 'Cleared', 'Cancelled'],
        required: true,
        default: 'Issued'
    },
    clearedDate: {
        type: Date
    }
});

export default mongoose.models.Cheque || mongoose.model('Cheque', chequeSchema);
