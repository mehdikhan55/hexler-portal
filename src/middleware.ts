// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { apiAuthMiddleware } from '@/middlewares/apiAuth';
// import { jwtVerify } from 'jose';


// // Define required permissions for each route
// const routePermissions = {
//   // Finance routes
//   '/payroll': ['VIEW_PAYROLL'],
//   '/payroll/create': ['MANAGE_PAYROLL'],
//   '/salary-calculator': ['VIEW_PAYROLL'],
//   '/expense-tracker': ['VIEW_EXPENSES'],
//   '/expense-categories': ['MANAGE_EXPENSES'],
  
//   // HR routes
//   '/employee-profiles': ['VIEW_EMPLOYEES'],
//   '/add-employee': ['MANAGE_EMPLOYEES'],
//   '/employees': ['VIEW_EMPLOYEES'],
//   '/employee-benefits': ['MANAGE_BENEFITS'],
  
//   // CMS routes
//   '/projects': ['MANAGE_PROJECTS'],
//   '/project-categories': ['MANAGE_PROJECTS'],
//   '/careers': ['MANAGE_WEBSITE'],
//   '/careers/applications': ['MANAGE_WEBSITE']
// };

// // Simpler approach: just define which roles can access which paths
// const roleBasedRoutes = {
//   'CEO': ['*'], // CEO can access everything
//   'CFO': [
//     '/payroll',
//     '/payroll/create',
//     '/salary-calculator',
//     '/expense-tracker',
//     '/expense-categories',
//     '/employee-profiles',
//     '/add-employee',
//     '/employees',
//     '/employee-benefits'
//   ],
//   'CTO': [
//     '/projects',
//     '/project-categories',
//     '/careers',
//     '/careers/applications'
//   ],
//   'HR': [
//     '/employee-profiles',
//     '/add-employee',
//     '/employees',
//     '/employee-benefits'
//   ]
// };


// export async function middleware(request: NextRequest) {
//     // Handle API routes
//     if (request.nextUrl.pathname.startsWith('/api/')) {
//         return apiAuthMiddleware(request);
//     }

//     try {
//       const authToken = request.cookies.get('auth-token')?.value;
      
//       if (!authToken) {
//         return handleAuthFailure(request);
//       }
  
//       // Verify JWT token
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
//       const { payload } = await jwtVerify(authToken, secret);
      
//       const userRole = payload.role as string;
//       const userPermissions = payload.permissions as string[];
//       const path = request.nextUrl.pathname;
      
//       // Allow access to dashboard for authenticated users
//       if (path === '/') {
//         return NextResponse.next();
//       }
      
//       // Check role-based access first (simpler check)
//       if (!checkRoleAccess(userRole, path)) {
//         return NextResponse.redirect(new URL('/unauthorized', request.url));
//       }
      
//       // Optional: Check specific permissions if needed
//       const requiredPermissions = routePermissions[path as keyof typeof routePermissions];
//       if (requiredPermissions && !checkPermissions(userPermissions, requiredPermissions)) {
//         return NextResponse.redirect(new URL('/unauthorized', request.url));
//       }
      
//       return NextResponse.next();
      
//     } catch (error) {
//       console.error('Middleware error:', error);
//       return handleAuthFailure(request);
//     }
// }

// function checkRoleAccess(role: string, path: string): boolean {
//   if (role === 'CEO') return true;
  
//   const allowedPaths = roleBasedRoutes[role as keyof typeof roleBasedRoutes];
//   return allowedPaths?.some(allowedPath => 
//     path === allowedPath || path.startsWith(`${allowedPath}/`)
//   ) ?? false;
// }

// function checkPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
//   return requiredPermissions.every(permission => userPermissions.includes(permission));
// }

// function handleAuthFailure(request: NextRequest) {
//   const loginUrl = new URL('/auth/login', request.url);
//   loginUrl.searchParams.set('from', request.nextUrl.pathname);
//   return NextResponse.redirect(loginUrl);
// }

// export const config = {
//     matcher: [
//         // API routes
//         '/api/:path*',
//         // Page routes (excluding public paths)
//         '/((?!auth|_next/static|_next/image|favicon.ico).*)',
//     ],
// };


import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // return NextResponse.redirect(new URL('/', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  
}