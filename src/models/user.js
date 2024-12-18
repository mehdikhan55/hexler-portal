// models/auth/user.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Role Schema
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['CEO', 'CFO', 'CTO', 'HR']
    },
    permissions: [{
        type: String,
        required: true,
        enum: [
            'VIEW_PAYROLL', 'MANAGE_PAYROLL',
            'VIEW_EXPENSES', 'MANAGE_EXPENSES',
            'VIEW_EMPLOYEES', 'MANAGE_EMPLOYEES',
            'MANAGE_BENEFITS', 'MANAGE_WEBSITE',
            'MANAGE_PROJECTS'
        ]
    }],
    subordinateRoles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }]
});


const User = mongoose.models.User || mongoose.model('User', userSchema);
const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);

export { User, Role };