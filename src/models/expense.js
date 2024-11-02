import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    approvalStatus: {
        type: String,
        default: 'pending',
        enum: ['approved', 'disapproved', 'pending']
    },
    budgetedAmount: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        required: true
    }
});

export default mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
