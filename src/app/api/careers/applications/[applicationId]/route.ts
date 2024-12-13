// /api/careers/applications/[applicationId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import CareerApplication from "@/models/careerApplication";
import dbConnect from "@/lib/dbConnect";

// Get single application
export async function GET(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    await dbConnect();

    const application = await CareerApplication.findById(params.applicationId)
      .populate("career");

    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application }, { status: 200 });
  } catch (error) {
    console.error("Error getting application:", error);
    return NextResponse.json(
      { message: "Error getting application" },
      { status: 500 }
    );
  }
}

// Update application
export async function PUT(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    await dbConnect();

    const updatedData = await req.json();
    
    const application = await CareerApplication.findByIdAndUpdate(
      params.applicationId,
      { $set: updatedData },
      { new: true }
    ).populate("career");

    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Application updated successfully", application },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { message: "Error updating application" },
      { status: 500 }
    );
  }
}

// Delete application
export async function DELETE(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    await dbConnect();

    const application = await CareerApplication.findByIdAndDelete(params.applicationId);

    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Application deleted successfully", application },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { message: "Error deleting application" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;