// /api/manage-projects/payment-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/projectManagement";
import dbConnect from "@/lib/dbConnect";

// Get all projects confirmed by CTO (ALL_STAGES_COMPLETED)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch only projects with projectStatus === 'ALL_STAGES_COMPLETED'
    const projects = await Project.find({ 
      projectStatus: "ALL_STAGES_COMPLETED" 
    }).sort({ updatedAt: -1 });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error getting projects for payment status:", error);
    return NextResponse.json(
      { message: "Error getting projects" },
      { status: 500 }
    );
  }
}

// Update project payment status
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { projectId, paymentStatus } = await req.json();

    if (!projectId || !paymentStatus) {
      return NextResponse.json(
        { message: "Project ID and payment status are required" },
        { status: 400 }
      );
    }

    // Validate payment status
    const validStatuses = ["PENDING", "RECIEVED", "NOT_RECIEVED"];
    if (!validStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { message: "Invalid payment status" },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { 
        $set: { 
          paymentStatus 
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
      { message: "Project payment status updated", project },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project payment status:", error);
    return NextResponse.json(
      { message: "Error updating payment status" },
      { status: 500 }
    );
  }
}
export const revalidate = 0;