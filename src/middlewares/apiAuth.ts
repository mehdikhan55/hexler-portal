// middleware/apiAuth.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface DecodedToken {
    userId: string;
    role: string;
    permissions: string[];
    exp: number;
}

const publicPaths = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/me',
    '/api/public'
];

export async function apiAuthMiddleware(req: NextRequest) {
    try {
        const path = req.nextUrl.pathname;

        // Check if it's a public path
        if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
            return NextResponse.next();
        }

        const token = req.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            );
        }

        // Verify JWT token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret);
        const decoded = payload as any;

        // If user has ADMIN permission, grant full access
        if (decoded.permissions.includes('ADMIN')) {
            attachUserToRequest(req, decoded);
            return NextResponse.next();
        }

        // Create permission key from method and path
        const permissionKey = `${req.method}:${path}`;
        console.log('Permission Key:', permissionKey);
        // Check permissions for the route
        const hasPermission = checkRoutePermissions(permissionKey, decoded.permissions);

        if (!hasPermission) {
            return NextResponse.json(
                { message: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        // Attach user info to request for use in API routes
        attachUserToRequest(req, decoded);
        return NextResponse.next();

    } catch (error) {
        console.error('API Auth Error:', error);
        return NextResponse.json(
            { message: 'Invalid or expired token' },
            { status: 401 }
        );
    }
}

function checkRoutePermissions(permissionKey: string, userPermissions: string[]): boolean {
    // First check exact match
    if (apiPermissions[permissionKey as keyof typeof apiPermissions]) {
        return checkPermissionArray(
            userPermissions,
            apiPermissions[permissionKey as keyof typeof apiPermissions]
        );
    }

    // If no exact match, check dynamic routes
    const dynamicKeys = Object.keys(apiPermissions);
    for (const key of dynamicKeys) {
        const pattern = convertRouteToRegex(key);
        const [method, routePath] = key.split(':');
        const [, reqPath] = permissionKey.split(':');
        
        if (method === permissionKey.split(':')[0] && pattern.test(reqPath)) {
            return checkPermissionArray(
                userPermissions,
                apiPermissions[key as keyof typeof apiPermissions]
            );
        }
    }

    return false;
}

function convertRouteToRegex(routeKey: string): RegExp {
    const [, path] = routeKey.split(':');
    // Replace [id] or any [parameter] with a regex pattern that matches alphanumeric characters, dashes, and underscores
    const pattern = path.replace(/\[\w+\]/g, '[\\w-]+');
    return new RegExp(`^${pattern}$`);
}

function checkPermissionArray(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every(permission => userPermissions.includes(permission));
}

// Helper function to attach user info to request
function attachUserToRequest(req: NextRequest, decoded: DecodedToken) {
    (req as any).user = {
        id: decoded.userId,
        role: decoded.role,
        permissions: decoded.permissions
    };
}


// Define required permissions for each API endpoint
const apiPermissions = {
    // Payroll APIs
    'GET:/api/payroll': ['VIEW_PAYROLL'],
    'POST:/api/payroll': ['MANAGE_PAYROLL'],
    'GET:/api/payroll/[id]': ['VIEW_PAYROLL'],
    'PUT:/api/payroll/[id]': ['MANAGE_PAYROLL'],
    'DELETE:/api/payroll/[id]': ['MANAGE_PAYROLL'],

    // Employee APIs
    'GET:/api/employees': ['VIEW_EMPLOYEES'],
    'POST:/api/employees/add': ['MANAGE_EMPLOYEES'],
    'GET:/api/employees/[id]': ['VIEW_EMPLOYEES'],
    'PUT:/api/employees/[id]': ['MANAGE_EMPLOYEES'],
    'DELETE:/api/employees/[id]': ['MANAGE_EMPLOYEES'],

    // ===> Expense APIs Start<===
    // Expense APIs 
    'GET:/api/finance/expenses': ['VIEW_EXPENSES'],
    'POST:/api/finance/expenses': ['MANAGE_EXPENSES'],
    'GET:/api/finance/expenses/[id]': ['VIEW_EXPENSES'],
    'PUT:/api/finance/expenses/[id]': ['MANAGE_EXPENSES'],
    'DELETE:/api/finance/expenses/[id]': ['MANAGE_EXPENSES'],

    // Expense Categories APIs 
    'GET:/api/finance/expenses/categories': ['MANAGE_EXPENSES'],
    'POST:/api/finance/expenses/categories': ['MANAGE_EXPENSES'],
    'GET:/api/finance/expenses/categories/[id]': ['MANAGE_EXPENSES'],
    'PUT:/api/finance/expenses/categories/[id]': ['MANAGE_EXPENSES'],
    'DELETE:/api/finance/expenses/categories/[id]': ['MANAGE_EXPENSES'],
    // ===> Expense APIs End<===

    // ===> CMS APIs Start<===
    // Career APIs
    'GET:/api/careers': ['MANAGE_CMS'],
    'POST:/api/careers': ['MANAGE_CMS'],
    'GET:/api/careers/[id]': ['MANAGE_CMS'],
    'PUT:/api/careers/[id]': ['MANAGE_CMS'],
    'DELETE:/api/careers/[id]': ['MANAGE_CMS'],

    // Career Application APIs
    'GET:/api/careers/applications': ['MANAGE_CMS'],
    'POST:/api/careers/applications': ['MANAGE_CMS'],
    'GET:/api/careers/applications/[id]': ['MANAGE_CMS'],
    'PUT:/api/careers/applications/[id]': ['MANAGE_CMS'],
    'DELETE:/api/careers/applications/[id]': ['MANAGE_CMS'],
    'PATCH:/api/careers/applications/[id]/status': ['MANAGE_CMS'],

    // Project APIs 
    'GET:/api/projects': ['MANAGE_CMS'],
    'POST:/api/projects/add': ['MANAGE_CMS'],
    'GET:/api/projects/[id]': ['MANAGE_CMS'],
    'PUT:/api/projects/[id]': ['MANAGE_CMS'],
    'DELETE:/api/projects/[id]': ['MANAGE_CMS'],
    'GET:/api/projects/categories': ['MANAGE_CMS'],
    'POST:/api/projects/categories': ['MANAGE_CMS'],
    'GET:/api/projects/categories/[id]': ['MANAGE_CMS'],
    'PUT:/api/projects/categories/[id]': ['MANAGE_CMS'],
    'DELETE:/api/projects/categories/[id]': ['MANAGE_CMS'],

    // Clients APIs
    'GET:/api/cms/clients': ['MANAGE_CMS'],
    'POST:/api/cms/clients': ['MANAGE_CMS'],
    'GET:/api/cms/clients/active-clients': ['MANAGE_CMS'],
    'GET:/api/cms/clients/[id]': ['MANAGE_CMS'],
    'DELETE:/api/cms/clients/[id]': ['MANAGE_CMS'],
    'PATCH:/api/cms/clients/[id]/display': ['MANAGE_CMS'],
    // ===> CMS APIs End<===

    // ===> Project Management APIs Start
    // Manage Projects APIs
    'GET:/api/manage-projects': ['MANAGE_PROJECTS'],
    'POST:/api/manage-projects': ['MANAGE_PROJECTS'],
    'GET:/api/manage-projects/pending-approval': ['APPROVE-PROJECT_BUDGET'],
    'GET:/api/manage-projects/[id]': ['MANAGE_PROJECTS'],
    'PUT:/api/manage-projects/[id]': ['MANAGE_PROJECTS'],
    'DELETE:/api/manage-projects/[id]': ['MANAGE_PROJECTS'],
    'PATCH:/api/manage-projects/[id]/approve-budget': ['APPROVE-PROJECT_BUDGET'],
    // ===> Project Management APIs End



    // Authentication APIs
    'POST:/api/auth/register': ['ADMIN'],

    // Manage Accounts APIs
    'GET:/api/auth/users': ['ADMIN'],
    'GET:/api/auth/users/[id]': ['ADMIN'],
    'PATCH:/api/auth/users/[id]': ['ADMIN'],
    'DELETE:/api/auth/users/[id]': ['ADMIN'],
    'POST:/api/auth/users/[id]/reset-password': ['ADMIN'],
    'PATCH:/api/auth/users/[id]/status': ['ADMIN'],
    'PATCH:/api/auth/users/[id]/role': ['ADMIN'],

    // Manage Roles APIs
    'GET:/api/auth/roles': ['ADMIN'],
    'POST:/api/auth/roles': ['ADMIN'],
    'GET:/api/auth/roles/[id]': ['ADMIN'],
    'PUT:/api/auth/roles/[id]': ['ADMIN'],
    'DELETE:/api/auth/roles/[id]': ['ADMIN'],
    'GET:/api/auth/roles/check-name/[id]': ['ADMIN'],


    // ===> Permission Management APIs Start <===
    // Permission APIs
    'GET:/api/auth/permissions': ['ADMIN'],
    'POST:/api/auth/permissions': ['ADMIN'],
    'GET:/api/auth/permissions/[id]': ['ADMIN'],
    'PUT:/api/auth/permissions/[id]': ['ADMIN'],
    'DELETE:/api/auth/permissions/[id]': ['ADMIN'],
    // ===> Permission Management APIs End <===


};