
// /api/careers/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import CareerApplication from "@/models/careerApplication";
import dbConnect from "@/lib/dbConnect";

// Get all applications
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch all applications and populate career info
    const applications = await CareerApplication.find({})
      .populate("career")
      .sort({ createdAt: -1 });

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error("Error getting applications:", error);
    return NextResponse.json(
      { message: "Error getting applications" },
      { status: 500 }
    );
  }
}

// Add a new application
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const applicationData = await req.json();

    // Check if application with same email exists for this career
    const existingApplication = await CareerApplication.findOne({
      email: applicationData.email,
      career: applicationData.career
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: "You have already applied for this position" },
        { status: 400 }
      );
    }

    // Create and save the application
    const newApplication = new CareerApplication(applicationData);
    const savedApplication = await newApplication.save();

    // Populate career information before sending response
    await savedApplication.populate('career');

    return NextResponse.json(
      { 
        message: "Application submitted successfully", 
        application: savedApplication 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { message: "Error submitting application" },
      { status: 500 }
    );
  }
}