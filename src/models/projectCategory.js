import mongoose from 'mongoose';

const projectCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    }
},{timestamps: true});


export default mongoose.models.ProjectCategory || mongoose.model('ProjectCategory', projectCategorySchema);
