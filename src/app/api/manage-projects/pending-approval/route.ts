// /api/manage-projects/pending-approval/route.ts
import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/projectManagement";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Find all projects that have sendForApproval=true and approvedByFinance=false
    const projects = await Project.find({
      sendForApproval: true,
      approvedByFinance: false,
      projectStatus: { $ne: 'CANCELLED' }
    }).sort({ createdAt: -1 });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error getting pending approval projects:", error);
    return NextResponse.json(
      { message: "Error getting pending approval projects" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;