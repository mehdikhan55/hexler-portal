// app/api/auth/users/[userId]/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User, Role } from "@/models/user";
import dbConnect from "@/lib/dbConnect";

export async function POST(
    req: NextRequest,
    { params }: { params: { userId: string } }
  ) {
    try {
      await dbConnect();
      const { password } = await req.json();
  
      if (!password || password.length < 8) {
        return NextResponse.json(
          { message: "Password must be at least 8 characters long" },
          { status: 400 }
        );
      }
  
      const user = await User.findById(params.userId);
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
  
      user.password = password;
      await user.save(); // This will trigger the password hashing middleware
  
      return NextResponse.json(
        { message: "Password reset successful" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error resetting password:", error);
      return NextResponse.json(
        { message: "Error resetting password" },
        { status: 500 }
      );
    }
  }

  export const revalidate = 0;
