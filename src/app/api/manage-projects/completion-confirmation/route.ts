// /api/manage-projects/completion-confirmation/route.ts
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
        $in: ["COMPLETED", "ALL_STAGES_COMPLETED"] 
      }
    }).sort({ updatedAt: -1 });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error getting projects for completion confirmation:", error);
    return NextResponse.json(
      { message: "Error getting projects" },
      { status: 500 }
    );
  }
}

// Update project status (for both completion confirmation and status changes)
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { projectId, projectStatus } = await req.json();

    if (!projectId || !projectStatus) {
      return NextResponse.json(
        { message: "Project ID and status are required" },
        { status: 400 }
      );
    }

    // Validate project status
    const validStatuses = ["PENDING", "ACTIVE", "INACTIVE", "CANCELLED", "COMPLETED", "ALL_STAGES_COMPLETED"];
    if (!validStatuses.includes(projectStatus)) {
      return NextResponse.json(
        { message: "Invalid project status" },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { 
        $set: { 
          projectStatus 
        } 
      },
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Project status updated", project },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project status:", error);
    return NextResponse.json(
      { message: "Error updating project status" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;