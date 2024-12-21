// /api/manage-projects/[projectId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/projectManagement";
import dbConnect from "@/lib/dbConnect";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await dbConnect();
    const project = await Project.findById(params.projectId);
    
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("Error getting project:", error);
    return NextResponse.json(
      { message: "Error getting project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await dbConnect();
    const updatedData = await req.json();

    const project = await Project.findByIdAndUpdate(
      params.projectId,
      { $set: updatedData },
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Project updated successfully", project },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { message: "Error updating project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await dbConnect();
    const project = await Project.findByIdAndDelete(params.projectId);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Project deleted successfully", project },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Error deleting project" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;