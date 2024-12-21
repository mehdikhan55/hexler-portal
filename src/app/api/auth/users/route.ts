// app/api/auth/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User, Role } from "@/models/user";
import dbConnect from "@/lib/dbConnect";

// Get all users
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const users = await User.find({})
      .select('-password')
      .populate({
        path: 'role',
        populate: { path: 'permissions' }
      });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error getting users:", error);
    return NextResponse.json(
      { message: "Error getting users" },
      { status: 500 }
    );
  }
}


export const revalidate = 0;