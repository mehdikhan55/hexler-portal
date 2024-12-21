// app/api/auth/permissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Permission } from "@/models/user";

// Get all permissions
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const permissions = await Permission.find({}).sort({ name: 1 });
    return NextResponse.json({ permissions }, { status: 200 });
  } catch (error) {
    console.error("Error getting permissions:", error);
    return NextResponse.json(
      { message: "Error getting permissions" },
      { status: 500 }
    );
  }
}

// Add new permission (admin only)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const permissionData = await req.json();
    
    // Check if permission with same name already exists
    const existingPermission = await Permission.findOne({ name: permissionData.name });
    if (existingPermission) {
      return NextResponse.json(
        { message: "Permission with this name already exists" },
        { status: 400 }
      );
    }

    const newPermission = new Permission(permissionData);
    const savedPermission = await newPermission.save();

    return NextResponse.json(
      { message: "Permission created successfully", permission: savedPermission },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding permission:", error);
    return NextResponse.json(
      { message: "Error adding permission" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;