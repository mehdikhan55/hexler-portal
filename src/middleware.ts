// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiAuthMiddleware } from '@/middlewares/apiAuth';
import { jwtVerify } from 'jose';

interface PermissionConfig {
    type: 'OR';
    permissions: string[];
}

export async function middleware(request: NextRequest) {

    const authToken = request.cookies.get('auth-token')?.value;

    // Handle login page access
    if (request.nextUrl.pathname === '/auth/login') {
        if (authToken) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
                await jwtVerify(authToken, secret);
                // User is logged in, redirect to home
                return NextResponse.redirect(new URL('/', request.url));
            } catch {
                // Invalid token, allow access to login
                return NextResponse.next();
            }
        }
        // No token, allow access to login
        return NextResponse.next();
    }

    // Skip middleware for public routes
    const publicPaths = ['/auth/login'];
    if (publicPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    // Handle API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        return apiAuthMiddleware(request);
    }

    try {
        const authToken = request.cookies.get('auth-token')?.value;
        if (!authToken) {
            return handleAuthFailure(request);
        }

        // Verify JWT token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(authToken, secret);

        const userPermissions = payload.permissions as string[];
        const path = request.nextUrl.pathname;

        // Allow access to dashboard and error pages for authenticated users
        const openPaths = ['/', '/unauthorized', '/404', '/500'];
        if (openPaths.includes(path)) {
            return NextResponse.next();
        }

        // Check permissions for the requested path
        if (!checkPathPermissions(path, userPermissions)) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return handleAuthFailure(request);
    }
}

function checkPathPermissions(path: string, userPermissions: string[]): boolean {
    path = path.replace(/\/$/, '');

    // Admin has access to everything
    if (userPermissions.includes('ADMIN')) {
        return true;
    }
    console.log('path:', path)
    console.log('user permissions:', userPermissions)

    // First check exact match
    if (routePermissions[path as keyof typeof routePermissions]) {
        return checkPermissions(userPermissions, routePermissions[path as keyof typeof routePermissions]);
    }

    // Then check dynamic routes
    const dynamicKeys = Object.keys(routePermissions).filter(key => key.includes('['));
    for (const key of dynamicKeys) {
        const pattern = key.replace(/\[.*?\]/g, '[\\w-]+');
        const regex = new RegExp(`^${pattern}$`);

        if (regex.test(path)) {
            return checkPermissions(userPermissions, routePermissions[key as keyof typeof routePermissions]);
        }
    }

    // If no match found, default to false
    return false;
}

function checkPermissions(userPermissions: string[], requiredPermissions: string[] | PermissionConfig): boolean {
    // If it's a regular array, use the existing AND logic
    if (Array.isArray(requiredPermissions)) {
        return requiredPermissions.every(permission => userPermissions.includes(permission));
    }

    // Handle OR logic for special cases
    if (requiredPermissions.type === 'OR') {
        return requiredPermissions.permissions.some(permission => userPermissions.includes(permission));
    }

    return false;
}

function handleAuthFailure(request: NextRequest) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        // API routes
        '/api/:path*',
        // Page routes (excluding public paths)
        '/((?!_next/static|_next/image|favicon.ico|assets|images|uploads).*)',
    ],
};



// Define required permissions for each route
const routePermissions = {
    // Finance/Payroll routes
    '/payroll': ['VIEW_PAYROLL'],
    '/payroll/create': ['MANAGE_PAYROLL'],
    '/payroll/[id]': ['VIEW_PAYROLL'],
    '/payroll/[id]/edit': ['MANAGE_PAYROLL'],
    '/salary-calculator': ['VIEW_PAYROLL'],

    // Expense Management routes
    '/expense-tracker': ['VIEW_EXPENSES'],
    '/expense-categories': ['MANAGE_EXPENSES'],
    '/expenses': ['VIEW_EXPENSES'],
    '/expenses/[id]': ['VIEW_EXPENSES'],
    '/expenses/edit/[id]': ['MANAGE_EXPENSES'],

    // HR/Employee routes
    '/employee-profiles': ['VIEW_EMPLOYEES'],
    '/add-employee': ['MANAGE_EMPLOYEES'],
    '/employee-benefits': ['MANAGE_BENEFITS'],
    '/employee-profiles/[id]': ['VIEW_EMPLOYEES'],
    '/employee-profiles/[id]/edit': ['MANAGE_EMPLOYEES'],

    // CMS routes
    // Project routes
    '/projects': ['VIEW_PROJECTS'],
    '/projects/new': ['MANAGE_CMS'],
    '/project-categories': ['MANAGE_CMS'],
    //career routes
    '/careers': ['MANAGE_CMS'],
    '/careers/applications': ['MANAGE_CMS'],
    '/careers/applications/[id]': ['MANAGE_CMS'],
    //clients routes
    '/cms/clients': ['MANAGE_CMS'],
    '/cms/clients/new': ['MANAGE_CMS'],

    // Project management routes
    '/manage-projects': ['VIEW_PROJECTS'],
    '/manage-projects/new': ['MANAGE_PROJECTS'],
    '/manage-projects/[id]': ['VIEW_PROJECTS'],
    '/manage-projects/[id]/edit': ['MANAGE_PROJECTS'],
    '/project-budget-approval': ['APPROVE-PROJECT_BUDGET'],
    '/project-completion-confirmation': ['CONFIRM-PROJECT_COMPLETION'],
    '/project-payments': ['MANAGE-PROJECT_PAYMENTS'],
    '/closed-projects': {
        type: 'OR' as const,
        permissions: ['CONFIRM-PROJECT_COMPLETION', 'MANAGE-PROJECT_PAYMENTS']
    },

    // Account management routes
    '/users': ['ADMIN'],
    '/users/[id]': ['ADMIN'],
    '/roles': ['ADMIN'],
    '/roles/[id]': ['ADMIN'],
    '/permissions': ['ADMIN']
};
