// types/permissions.ts

export const PERMISSIONS = {
    // Admin Permission
    "ADMIN": 'ADMIN',

    // Finance Permissions
    "VIEW_PAYROLL": 'VIEW_PAYROLL',
    "MANAGE_PAYROLL": 'MANAGE_PAYROLL',
    "VIEW_EXPENSES": 'VIEW_EXPENSES',
    "MANAGE_EXPENSES": 'MANAGE_EXPENSES',

    // HR Permissions
    "VIEW_EMPLOYEES": 'VIEW_EMPLOYEES',
    "MANAGE_EMPLOYEES": 'MANAGE_EMPLOYEES',
    "MANAGE_BENEFITS": 'MANAGE_BENEFITS',

    // CMS Permissions
    "MANAGE_CMS": 'MANAGE_CMS',
    "VIEW_PROJECTS": 'VIEW_PROJECTS',
    "MANAGE_PROJECTS": 'MANAGE_PROJECTS',

    //Project Management Permissions
    "APPROVE-PROJECT_BUDGET": 'APPROVE-PROJECT_BUDGET',

    //Project Payments Management Permissions
    "MANAGE-PROJECT_PAYMENTS": 'MANAGE-PROJECT_PAYMENTS',

    //Project Completion Confirmation Permissions
    "CONFIRM-PROJECT_COMPLETION": 'CONFIRM-PROJECT_COMPLETION',

} as const;

export type Permission = keyof typeof PERMISSIONS;
export type PermissionValue = typeof PERMISSIONS[Permission];

export const hasPermission = (
    userPermissions: Permission[],
    requiredPermission: Permission
): boolean => {
    // Check for ADMIN permission first
    if (userPermissions?.includes('ADMIN')) {
        return true;
    }
    return userPermissions?.includes(requiredPermission);
};

export const hasPermissions = (
    userPermissions: Permission[],
    requiredPermissions: Permission[]
): boolean => {
    // Check for ADMIN permission first
    if (userPermissions?.includes('ADMIN')) {
        return true;
    }
    return requiredPermissions?.every(permission =>
        userPermissions?.includes(permission)
    );
};

export const hasRequiredRole = (userRole: string, requiredRole: string) => {
    if (userRole === 'CEO') {
        return true;
    }
    return userRole === requiredRole;
};
