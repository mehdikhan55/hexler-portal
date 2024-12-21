// api/auth/roles/check-name/[name]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/models/user";
import dbConnect from "@/lib/dbConnect";

export async function GET(
    req: NextRequest,
    { params }: { params: { name: string } }
) {
    try {
        await dbConnect();
        const decodedName = decodeURIComponent(params.name);
        
        const existingRole = await Role.findOne({ 
            name: { $regex: new RegExp(`^${decodedName}$`, 'i') }
        });

        return NextResponse.json(
            { available: !existingRole },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking role name:", error);
        return NextResponse.json(
            { message: "Error checking role name" },
            { status: 500 }
        );
    }
}

export const revalidate = 0;