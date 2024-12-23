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


const ProjectCategory= mongoose.models.ProjectCategory || mongoose.model('ProjectCategory', projectCategorySchema);

export default ProjectCategory;