// /api/careers/applications/[applicationId]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import CareerApplication from "@/models/careerApplication";
import dbConnect from "@/lib/dbConnect";

// Update application status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    await dbConnect();

    const { status } = await req.json();

    // Validate status
    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const application = await CareerApplication.findByIdAndUpdate(
      params.applicationId,
      { $set: { status } },
      { new: true }
    ).populate("career");

    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Status updated successfully", application },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { message: "Error updating application status" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;