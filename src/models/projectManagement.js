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
  isActive: {
    type: Boolean,
    default: true,
  },
  deadline: {
    type: Date,
    required: [true, "Module deadline is required"],
  },
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
    isActive: {
      type: Boolean,
      default: true,
    },
    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    sendForApproval: {
      type: Boolean,
      default: false,
    },
    approvedByFinance: {
      type: Boolean,
      default: false,
    },
    modules: [moduleSchema], // Embedded module documents
  },
  { timestamps: true }
);

// Create and export the Project model
const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
