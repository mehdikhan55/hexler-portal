// api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import jwt from 'jsonwebtoken';

export async function POST() {
    const response = NextResponse.json(
        { message: "Logout successful" },
        { status: 200 }
    );

    // Clear auth cookie
    response.cookies.set({
        name: 'auth-token',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0
    });

    return response;
}