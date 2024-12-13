// /api/careers/route.ts
import { NextRequest, NextResponse } from "next/server";
import Career from "@/models/career";
import dbConnect from "@/lib/dbConnect";

// Get all careers
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const careers = await Career.find({});
    return NextResponse.json({ careers }, { status: 200 });
  } catch (error) {
    console.error("Error getting careers:", error);
    return NextResponse.json(
      { message: "Error getting careers" },
      { status: 500 }
    );
  }
}

// Add a new career
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const careerData = await req.json();

    // Check if career with same name already exists
    const existingCareer = await Career.findOne({ name: careerData.name });
    if (existingCareer) {
      return NextResponse.json(
        { message: "Career with this name already exists" },
        { status: 400 }
      );
    }

    const newCareer = new Career(careerData);
    const savedCareer = await newCareer.save();

    return NextResponse.json(
      { message: "Career created successfully", career: savedCareer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding career:", error);
    return NextResponse.json(
      { message: "Error adding career" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;
