// middleware/apiAuth.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

// Define required permissions for each API endpoint
const apiPermissions = {
    // Payroll APIs
    'GET:/api/payrolls': ['VIEW_PAYROLL'],
    'POST:/api/payrolls': ['MANAGE_PAYROLL'],
    'PUT:/api/payrolls': ['MANAGE_PAYROLL'],
    'DELETE:/api/payrolls': ['MANAGE_PAYROLL'],

    // Employee APIs
    'GET:/api/employees': ['VIEW_EMPLOYEES'],
    'POST:/api/employees': ['MANAGE_EMPLOYEES'],
    'PUT:/api/employees': ['MANAGE_EMPLOYEES'],
    'DELETE:/api/employees': ['MANAGE_EMPLOYEES'],

    // Expense APIs
    'GET:/api/finance/expenses': ['VIEW_EXPENSES'],
    'POST:/api/finance/expenses': ['MANAGE_EXPENSES'],
    'PUT:/api/finance/expenses': ['MANAGE_EXPENSES'],
    'DELETE:/api/finance/expenses': ['MANAGE_EXPENSES'],

    // Career APIs
    'GET:/api/careers': ['MANAGE_WEBSITE'],
    'POST:/api/careers': ['MANAGE_WEBSITE'],
    'PUT:/api/careers': ['MANAGE_WEBSITE'],
    'DELETE:/api/careers': ['MANAGE_WEBSITE'],
};

export async function apiAuthMiddleware(req: NextRequest) {
    try {
        // Skip auth for login and public endpoints
        if (req.nextUrl.pathname.startsWith('/api/auth/login') || 
            req.nextUrl.pathname.startsWith('/api/public')) {
            return NextResponse.next();
        }

        const token = req.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            );
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        // Create permission key from method and path
        const permissionKey = `${req.method}:${req.nextUrl.pathname}` as keyof typeof apiPermissions;

        // Check if endpoint requires specific permissions
        const requiredPermissions = apiPermissions[permissionKey];
        if (requiredPermissions) {
            const hasPermission = requiredPermissions.every(
                permission => decoded.permissions.includes(permission)
            );

            if (!hasPermission) {
                return NextResponse.json(
                    { message: 'Insufficient permissions' },
                    { status: 403 }
                );
            }
        }

        // Attach user info to request for use in API routes
        (req as any).user = {
            id: decoded.userId,
            role: decoded.role,
            permissions: decoded.permissions
        };

        return NextResponse.next();
    } catch (error) {
        return NextResponse.json(
            { message: 'Invalid or expired token' },
            { status: 401 }
        );
    }
}