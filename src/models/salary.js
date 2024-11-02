import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
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
        validate: {
            validator: function (v) {
                return v === (this.baseSalary + this.bonus - this.deductions);
            },
            message: props => `Total salary must equal base salary plus bonuses minus deductions!`
        }
    },
    payDate: {
        type: Date,
        default: Date.now
    },
    payMonth: {
        type: String,
        required: true
    },
    payYear: {
        type: Number,
        required: true
    },
    attendanceData: {
        hoursWorked: {
            type: Number,
            required: true,
            min: 0
        }
    }
});

export default mongoose.models.Salary || mongoose.model('Salary', salarySchema);
