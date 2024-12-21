import mongoose, { Schema } from "mongoose";
import { DEFAULT_BREAKPOINTS } from "react-bootstrap/esm/ThemeProvider";

// Define the Module Schema first
const moduleSchema = new Schema({
  moduleName: {
    type: String,
    required: [true, "Module name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Module description is required"],
  },
  deadline: {
    type: Date,
    required: [true, "Module deadline is required"],
  },
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'completed'],
    default: 'todo'
  }
});

// Project Schema with embedded modules
const projectSchema = new Schema(
  {
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    projectDescription: {
      type: String,
      required: [true, "Project description is required"],
    },
    budget: {
      amount: {
        type: Number,
        default: null,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    projectStatus: { // STATUS OF THE PROJECT
      type: String,  
      enum: ["PENDING", "ACTIVE", "INACTIVE", "CANCELLED","COMPLETED"],
      default: "ACTIVE",
    },
    sendForApproval: { // APPROVAL SENT TO FINANCE FOR BUDGET FINALIZATION OR NOT
      type: Boolean,
      default: false,
    },
    approvedByFinance: { // APPROVAL STATUS BY FINANCE FOR THE BUDGET
      type: Boolean,
      default: false,
    },
    modules: [moduleSchema], // Embedded module documents
  },
  { timestamps: true }
);

// Create and export the Project model
const Project =   mongoose.models.ProjectManagement || mongoose.model("ProjectManagement", projectSchema);

export default Project;
