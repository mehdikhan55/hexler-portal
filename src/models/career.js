// /models/career.js
import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    isActive:{
        type: Boolean,
        default: true
    }
},{timestamps: true});

export default mongoose.models.Career || mongoose.model('Career', careerSchema);
