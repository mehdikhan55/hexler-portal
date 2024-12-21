// api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { User,Role,Permission } from "@/models/user";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('auth-token')?.value;
        
        if (!token) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        
        const foundUser= await User.findById(decoded.userId).populate({
            path: 'role',
            populate: [
                { path: 'permissions' }
            ]
        });
            if (!foundUser || !foundUser.isActive) {
                return NextResponse.json({ user: null }, { status: 401 });
            }

        return NextResponse.json({
            user: {
                id: foundUser._id,
                role: foundUser.role.name,
                permissions: foundUser.role.permissions.map((p: any) => p.name),
                firstName:foundUser.firstName,
                lastName:foundUser.lastName,
                email:foundUser.email
            }
        });
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}

export const revalidate = 0;