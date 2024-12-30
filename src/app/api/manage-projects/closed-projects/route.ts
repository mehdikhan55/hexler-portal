// /api/manage-projects/closed-projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/projectManagement";
import dbConnect from "@/lib/dbConnect";

// Get all completed or confirmed projects for CTO
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch projects that are either COMPLETED or ALL_STAGES_COMPLETED
    const projects = await Project.find({ 
      projectStatus: { 
        $in: ["CLOSED_SUCCESSFULLY"] 
      }
    }).sort({ updatedAt: -1 });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error getting closed projects:", error);
    return NextResponse.json(
      { message: "Error getting closed projects" },
      { status: 500 }
    );
  }
}

// Update project status
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    const projectFound = await Project.findById(projectId);

    if (!projectFound) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }

    if (projectFound.projectStatus !== "ALL_STAGES_COMPLETED") {
      return NextResponse.json(
        { message: "Project completion not confirmed by CTO" },
        { status: 400 }
      );
    }
    if (projectFound.paymentStatus !== "RECIEVED") {
      return NextResponse.json(
        { message: "Payment Not Recieved" },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { 
        $set: { 
            projectStatus: "CLOSED_SUCCESSFULLY" 
        } 
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Project closed successfully", project },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error closing project:", error);
    return NextResponse.json(
      { message: "Error closing project" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;