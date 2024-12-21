// app/api/auth/users/[userId]/role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User, Role } from "@/models/user";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { userId: string } }
  ) {
    try {
      await dbConnect();
      const { roleId } = await req.json();
  
      // Validate role exists
      const role = await Role.findById(roleId);
      if (!role) {
        return NextResponse.json(
          { message: "Invalid role specified" },
          { status: 400 }
        );
      }
  
      const user = await User.findByIdAndUpdate(
        params.userId,
        { $set: { role: roleId } },
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
      console.error("Error updating user role:", error);
      return NextResponse.json(
        { message: "Error updating user role" },
        { status: 500 }
      );
    }
  }

  
  export const revalidate = 0;
