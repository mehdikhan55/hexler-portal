// /models/careerApplication.js
import mongoose from 'mongoose';
import Career from './career.js';

const careerApplicationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"]
    },
    DOB: {
        type: Date,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    whatsappNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    originCity: {
        type: String,
        required: true
    },
    residingCity: {
        type: String,
        required: true
    },
    projectLinks: {
        type: String
    },
    portfolioLink: {
        type: String
    },
    pastExperience: {
        type: String
    },
    coverLetter: {
        type: String
    },
    linkedinProfile: {
        type: String,
        required: true
    },
    githubProfile: {
        type: String,
        required: true
    },
    career: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Career',
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.models.CareerApplication || mongoose.model('CareerApplication', careerApplicationSchema);