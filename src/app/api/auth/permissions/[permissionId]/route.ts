// app/api/auth/permissions/[permissionId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Permission } from "@/models/user";

// Get single permission
export async function GET(
  req: NextRequest,
  { params }: { params: { permissionId: string } }
) {
  try {
    await dbConnect();
    const permission = await Permission.findById(params.permissionId);
    
    if (!permission) {
      return NextResponse.json(
        { message: "Permission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ permission }, { status: 200 });
  } catch (error) {
    console.error("Error getting permission:", error);
    return NextResponse.json(
      { message: "Error getting permission" },
      { status: 500 }
    );
  }
}

// Update permission
export async function PUT(
  req: NextRequest,
  { params }: { params: { permissionId: string } }
) {
  try {
    await dbConnect();
    const updatedData = await req.json();

    // Check for name uniqueness if name is being updated
    if (updatedData.name) {
      const existingPermission = await Permission.findOne({
        name: updatedData.name,
        _id: { $ne: params.permissionId }
      });
      
      if (existingPermission) {
        return NextResponse.json(
          { message: "Permission with this name already exists" },
          { status: 400 }
        );
      }
    }

    const permission = await Permission.findByIdAndUpdate(
      params.permissionId,
      { $set: updatedData },
      { new: true }
    );

    if (!permission) {
      return NextResponse.json(
        { message: "Permission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Permission updated successfully", permission },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating permission:", error);
    return NextResponse.json(
      { message: "Error updating permission" },
      { status: 500 }
    );
  }
}

// Delete permission
export async function DELETE(
  req: NextRequest,
  { params }: { params: { permissionId: string } }
) {
  try {
    await dbConnect();
    
    // First check if permission is being used by any roles
    // This would require joining with the Role collection
    const permission = await Permission.findById(params.permissionId);

    if (!permission) {
      return NextResponse.json(
        { message: "Permission not found" },
        { status: 404 }
      );
    }

    await permission.deleteOne();

    return NextResponse.json(
      { message: "Permission deleted successfully", permission },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting permission:", error);
    return NextResponse.json(
      { message: "Error deleting permission" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;