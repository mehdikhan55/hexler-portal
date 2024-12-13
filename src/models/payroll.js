import mongoose from 'mongoose';
import Employee from './employee';

const payrollSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        index: true
    },
    baseSalary: {
        type: Number,
        required: true,
        min: 0
    },
    bonus: {
        type: Number,
        default: 0,
        min: 0
    },
    deductions: {
        type: Number,
        default: 0,
        min: 0
    },
    totalSalary: {
        type: Number,
        required: true,
        // validate: {
        //     validator: function (v) {
        //         return v === (this.baseSalary + this.bonus - this.deductions);
        //     },
        //     message: props => `Total salary must equal base salary plus bonuses minus deductions!`
        // }
    },
    payDate: {
        type: Date,
        default: null
    },
    payMonth: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    payYear: {
        type: Number,
        required: true
    },
    attendanceData: {
        hoursWorked: {
            type: Number,
            min: 0
        }
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: String, // Bank transfer, cash, cheque
        enum: ['Bank transfer', 'Cash', 'Cheque', 'Direct deposit'],
        default: 'Bank transfer'
    }
});

export default mongoose.models.Payroll || mongoose.model('Payroll', payrollSchema);
