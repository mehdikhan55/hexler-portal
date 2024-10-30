import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Employee', 'Admin', 'Finance']
    },
    dateOfJoining:{
        type: Date,
        required: true,
    },
    contactNo: {
        type: String,
        required: true
    },
    contactEmail:{
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    salaryStructure: {
        baseSalary: {
            type: Number,
            required: true
        },
        bonuses: {
            type: [Number],
            default: [],
        },
        deductions: {
            type: [Number],
            default: []
        }
    }
});

export default mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
