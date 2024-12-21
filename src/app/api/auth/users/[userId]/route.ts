// app/api/auth/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User, Role } from "@/models/user";
import dbConnect from "@/lib/dbConnect";

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
  ) {
    try {
      await dbConnect();
      const user = await User.findById(params.userId)
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
      console.error("Error getting user:", error);
      return NextResponse.json(
        { message: "Error getting user" },
        { status: 500 }
      );
    }
  }
  
  // Update user
  export async function PATCH(
    req: NextRequest,
    { params }: { params: { userId: string } }
  ) {
    try {
      await dbConnect();
      const userData = await req.json();
  
      // Remove password from update data if present
      delete userData.password;
  
      const user = await User.findByIdAndUpdate(
        params.userId,
        { $set: userData },
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
      console.error("Error updating user:", error);
      return NextResponse.json(
        { message: "Error updating user" },
        { status: 500 }
      );
    }
  }
  
  // Delete user
  export async function DELETE(
    req: NextRequest,
    { params }: { params: { userId: string } }
  ) {
    try {
      await dbConnect();
      const user = await User.findByIdAndDelete(params.userId);
  
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: "User deleted" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { message: "Error deleting user" },
        { status: 500 }
      );
    }
  }
  
  export const revalidate = 0;