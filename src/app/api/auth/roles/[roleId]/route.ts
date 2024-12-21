// api/auth/roles/[roleId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Role, User } from "@/models/user";
import dbConnect from "@/lib/dbConnect";

export async function GET(
    req: NextRequest,
    { params }: { params: { roleId: string } }
) {
    try {
        await dbConnect();
        const role = await Role.findById(params.roleId).populate('permissions');

        if (!role) {
            return NextResponse.json(
                { message: "Role not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ role }, { status: 200 });
    } catch (error) {
        console.error("Error getting role:", error);
        return NextResponse.json(
            { message: "Error getting role" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { roleId: string } }
) {
    try {
        await dbConnect();
        const updateData = await req.json();

        // Validate required fields
        if (!updateData.name) {
            return NextResponse.json(
                { message: "Role name is required" },
                { status: 400 }
            );
        }

        const role = await Role.findByIdAndUpdate(
            params.roleId,
            { $set: updateData },
            { new: true }
        ).populate('permissions');

        if (!role) {
            return NextResponse.json(
                { message: "Role not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Role updated successfully", role },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating role:", error);
        return NextResponse.json(
            { message: "Error updating role" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { roleId: string } }
) {
    try {
        await dbConnect();
        
        // Check if role is being used by any users
        const usersWithRole = await User.find({ role: params.roleId });
        if (usersWithRole.length > 0) {
            return NextResponse.json(
                { message: "Cannot delete role as it is assigned to users" },
                { status: 400 }
            );
        }

        const role = await Role.findByIdAndDelete(params.roleId);

        if (!role) {
            return NextResponse.json(
                { message: "Role not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Role deleted successfully", role },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting role:", error);
        return NextResponse.json(
            { message: "Error deleting role" },
            { status: 500 }
        );
    }
}

export const revalidate = 0;

