import mongoose, { Schema} from 'mongoose';

// Define the Mongoose schema
const projectSchema = new Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
  },
  projectTagline: {
    type: String,
    required: [true, 'Project tagline is required'],
  },
  projectDescription: {
    type: String,
  },
  projectCategory: {
    type: String,
    required: [true, 'Project category is required'],
  },
  projectImage: {
    type: String,
  },
  projectLink: {
    type: String,
    required: [true, 'Project link is required'],
  },
  projectOrder: {
    type: Number,
    required: [true, 'Project order is required'],
    min: [1, 'Project order must be at least 1'],
  },
}, { timestamps: true });

// Create and export the Project model
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
