// api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User, Role } from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import { Permission } from "@/types/permission";

// Type for registration request
interface RegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string; // Role ID
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userData: RegistrationRequest = await req.json();

    // Validate required fields
    if (!userData.email || !userData.password || !userData.firstName || 
        !userData.lastName || !userData.role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Validate and get role
    const role = await Role.findById(userData.role).populate('permissions');
    if (!role) {
      return NextResponse.json(
        { message: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new User({
      email: userData.email,
      password: userData.password, // Will be hashed by pre-save hook
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: role._id,
      isActive: true
    });

    await newUser.save();

    // Return success response without sensitive data
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: role.name
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Error during registration" },
      { status: 500 }
    );
  }
}

// Helper function to validate registration request
function validateRegistration(data: any): { isValid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(data.email)) {
    return { isValid: false, message: "Invalid email format" };
  }

  if (data.password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }

  if (data.firstName.length < 2 || data.lastName.length < 2) {
    return { isValid: false, message: "First and last name must be at least 2 characters long" };
  }

  return { isValid: true };
}

export const revalidate = 0;