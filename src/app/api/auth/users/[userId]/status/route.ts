// app/api/auth/users/[userId]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User, Role } from "@/models/user";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { userId: string } }
  ) {
    try {
      await dbConnect();
      const { isActive } = await req.json();
  
      const user = await User.findByIdAndUpdate(
        params.userId,
        { $set: { isActive } },
        { new: true }
      )
        .select('-password')
        .populate({
          path: 'role',
          populate: { path: 'permissions' }
        });
  
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
      console.error("Error updating user status:", error);
      return NextResponse.json(
        { message: "Error updating user status" },
        { status: 500 }
      );
    }
  }

  
  export const revalidate = 0;