// app/api/auth/roles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User, Role } from "@/models/user";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const roles = await Role.find({}).populate('permissions');

    return NextResponse.json({ roles }, { status: 200 });
  } catch (error) {
    console.error("Error getting roles:", error);
    return NextResponse.json(
      { message: "Error getting roles" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const roleData = await req.json();

    // Validate required fields
    if (!roleData.name) {
      return NextResponse.json(
        { message: "Role name is required" },
        { status: 400 }
      );
    }

    // Check if role with same name exists
    const existingRole = await Role.findOne({ name: roleData.name });
    if (existingRole) {
      return NextResponse.json(
        { message: "Role with this name already exists" },
        { status: 400 }
      );
    }

    const newRole = new Role(roleData);
    await newRole.save();

    const populatedRole = await Role.findById(newRole._id).populate('permissions');

    return NextResponse.json(
      { message: "Role created successfully", role: populatedRole },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { message: "Error creating role" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;