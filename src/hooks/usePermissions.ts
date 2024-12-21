// hooks/usePermissions.ts
import { hasPermissions, hasRequiredRole } from '@/types/permission';
import { 
    Permission, 
    PERMISSIONS, 
    hasPermission,  
} from '@/types/permission';

export function usePermissions(userPermissions: Permission[], userRole: string) {
    // console.log('permissiona came in usePermissiona:',userPermissions)
    // console.log('role came in usePermissiona:',userRole)
    return {
        // Check if user is admin
        isAdmin: () => hasRequiredRole(userRole, "CEO"),
        isFinanceAdmin: () => hasRequiredRole(userRole, "CFO"),
        isHRAdmin: () => hasRequiredRole(userRole, "HR"),
        isEmployee: () => hasRequiredRole(userRole, "Emp"),
        isCTO: () => hasRequiredRole(userRole, "CTO"),

        // Finance related permissions
        canViewPayroll: () => hasPermission(userPermissions, PERMISSIONS.VIEW_PAYROLL),
        canManagePayroll: () => hasPermission(userPermissions, PERMISSIONS.MANAGE_PAYROLL),
        canViewExpenses: () => hasPermission(userPermissions, PERMISSIONS.VIEW_EXPENSES),
        canManageExpenses: () => hasPermission(userPermissions, PERMISSIONS.MANAGE_EXPENSES),
        
        // HR related permissions
        canViewEmployees: () => hasPermission(userPermissions, PERMISSIONS.VIEW_EMPLOYEES),
        canManageEmployees: () => hasPermission(userPermissions, PERMISSIONS.MANAGE_EMPLOYEES),
        canManageBenefits: () => hasPermission(userPermissions, PERMISSIONS.MANAGE_BENEFITS),
        
        // CMS & Projects related permissions
        canManageCMS: () => hasPermission(userPermissions, PERMISSIONS.MANAGE_CMS),
        canViewProjects: () => hasPermission(userPermissions, PERMISSIONS.VIEW_PROJECTS),
        canManageProjects: () => hasPermission(userPermissions, PERMISSIONS.MANAGE_PROJECTS),

    };
}
