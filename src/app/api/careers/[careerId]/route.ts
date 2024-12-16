// /api/careers/[careerId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import Career from "@/models/career";
import dbConnect from "@/lib/dbConnect";
import CareerApplication from "@/models/careerApplication";
import mongoose from "mongoose";

// Get career by id
export async function GET(req: NextRequest,
  { params }: { params: { careerId: string } }) {
  try {
    await dbConnect();
    const career = await Career.findById(params.careerId);
    if (!career) {
      return NextResponse.json(
        { message: "Career not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ career }, { status: 200 });
  } catch (error) {
    console.error("Error getting career:", error);
    return NextResponse.json(
      { message: "Error getting career" },
      { status: 500 }
    );
  }
}

// Update career by id
export async function PUT(req: NextRequest,
  { params }: { params: { careerId: string } }) {
  try {
    await dbConnect();
    const careerData = await req.json();
    const updatedCareer = await Career.findByIdAndUpdate
      (params.careerId, careerData, { new: true });
    if (!updatedCareer) {
      return NextResponse.json(
        { message: "Career not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Career updated successfully", career: updatedCareer },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating career:", error);
    return NextResponse.json(
      { message: "Error updating career" },
      { status: 500 }
    );
  }
}

// Delete career by id and all associated applications
export async function DELETE(req: NextRequest,
  { params }: { params: { careerId: string } }) {
try {
  await dbConnect();

  // Start a session using mongoose directly
  const session = await mongoose.startSession();
  let deletedCareer = null; // Define variable outside transaction

  try {
    await session.withTransaction(async () => {
      // First, check if the career exists
      const career = await Career.findById(params.careerId).session(session);
      if (!career) {
        throw new Error("Career not found");
      }

      // Delete all applications associated with this career
      await CareerApplication.deleteMany({ career: params.careerId }).session(session);

      // Delete the career itself and store the result
      const result = await Career.findByIdAndDelete(params.careerId).session(session);

      if (!result) {
        throw new Error("Error during career deletion");
      }
      
      deletedCareer = result; // Store the result
    });

    await session.endSession();

    return NextResponse.json(
      { 
        message: "Career and associated applications deleted successfully",
        career: deletedCareer
      },
      { status: 200 }
    );
  } catch (error) {
    await session.endSession();
    
    // Type guard for Error objects
    if (error instanceof Error) {
      if (error.message === "Career not found") {
        return NextResponse.json(
          { message: "Career not found" },
          { status: 404 }
        );
      }
    }
    
    throw error; // Re-throw for the outer catch block
  }
} catch (error) {
  console.error("Error deleting career and applications:", error);
  return NextResponse.json(
    { message: "Error deleting career and associated applications" },
    { status: 500 }
  );
}
}

export const revalidate = 0;
