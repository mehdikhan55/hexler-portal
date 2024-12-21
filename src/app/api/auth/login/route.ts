// api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        // Find user and populate role with permissions
        const user = await User.findOne({ email })
            .populate({
                path: 'role',
                populate: [
                    { path: 'permissions' }
                ]
            });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }
        if (!user.isActive) {
            return NextResponse.json(
                { message: "Account Not Active" },
                { status: 401 }
            );
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role.name,
                permissions: user.role.permissions.map((p: any) => p.name),
            },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' } // Token expires in 24 hours
        );

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create response with token in HttpOnly cookie
        const response = NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role.name
                }
            },
            { status: 200 }
        );

        // Set HttpOnly cookie
        response.cookies.set({
            name: 'auth-token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Error during login" },
            { status: 500 }
        );
    }
}



export const revalidate = 0;