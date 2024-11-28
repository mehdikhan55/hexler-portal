import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/project";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    // Step 1: Connect to the database
    await dbConnect();

    // Step 2: Get all projects from the database, sorted by projectOrder
    const projects = await Project.find({}).sort({ projectOrder: 1 });

    // Step 3: Return the projects as JSON response
    return NextResponse.json(
      { projects }, // Data to return in the response
      { status: 200 } // Optional status code (200 is default for success)
    );
  } catch (error) {
    console.error('Error getting projects:', error);

    // Return error response with appropriate message
    return NextResponse.json(
      { message: 'Error getting projects' },
      { status: 500 } // Internal server error
    );
  }
}
