import mongoose from 'mongoose';
import Department from "@/models/department";

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePhoto:{
        type: String,
        default: '/images/default-profile.jpg'
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
    },
    hireDate: {
        type: Date,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'terminated'],
        default: 'active'
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    },
    salary: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
