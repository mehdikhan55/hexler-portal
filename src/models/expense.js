import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    categoryId: {
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
    approvedByAdmin: {
        type: Boolean,
        default: false
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
