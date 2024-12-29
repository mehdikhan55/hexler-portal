// /api/manage-projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/projectManagement";
import dbConnect from "@/lib/dbConnect";

// Get all projects with optional filters
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const projectStatus = searchParams.get("projectStatus");

    // Build query object based on filters
    const query: any = {};

    // Exclude projects with projectStatus "xyz"
    query.projectStatus = { $ne: "ALL_STAGES_COMPLETED" };

    if (projectStatus) query.projectStatus = projectStatus;

    const projects = await Project.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error getting projects:", error);
    return NextResponse.json(
      { message: "Error getting projects" },
      { status: 500 }
    );
  }
}

// Add a new project
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const projectData = await req.json();

    // Create new project
    const newProject = new Project(projectData);
    const savedProject = await newProject.save();

    return NextResponse.json(
      { message: "Project created successfully", project: savedProject },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding project:", error);
    return NextResponse.json(
      { message: "Error adding project" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;