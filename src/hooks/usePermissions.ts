// hooks/usePermissions.ts
import { hasPermissions, hasRequiredRole } from '@/types/permission';
import {
    Permission,
    PERMISSIONS,
    hasPermission,
} from '@/types/permission';

export function usePermissions(userPermissions: Permission[], userRole: string) {
    return {
        // Role-based checks
        isAdmin: () => hasRequiredRole(userRole, "CEO"),
        isFinanceAdmin: () => hasRequiredRole(userRole, "CFO"),
        isHRAdmin: () => hasRequiredRole(userRole, "HR"),
        isEmployee: () => hasRequiredRole(userRole, "Emp"),
        isCTO: () => hasRequiredRole(userRole, "CTO"),
        
        // Finance related permissions
        canViewPayroll: () => hasPermission(userPermissions, PERMISSIONS["VIEW_PAYROLL"]),
        canManagePayroll: () => hasPermission(userPermissions, PERMISSIONS["MANAGE_PAYROLL"]),
        canViewExpenses: () => hasPermission(userPermissions, PERMISSIONS["VIEW_EXPENSES"]),
        canManageExpenses: () => hasPermission(userPermissions, PERMISSIONS["MANAGE_EXPENSES"]),
        
        // HR related permissions
        canViewEmployees: () => hasPermission(userPermissions, PERMISSIONS["VIEW_EMPLOYEES"]),
        canManageEmployees: () => hasPermission(userPermissions, PERMISSIONS["MANAGE_EMPLOYEES"]),
        canManageBenefits: () => hasPermission(userPermissions, PERMISSIONS["MANAGE_BENEFITS"]),
        
        // CMS & Projects related permissions
        canManageCMS: () => hasPermission(userPermissions, PERMISSIONS["MANAGE_CMS"]),
        canViewProjects: () => hasPermission(userPermissions, PERMISSIONS["VIEW_PROJECTS"]),
        canManageProjects: () => hasPermission(userPermissions, PERMISSIONS["MANAGE_PROJECTS"]),

        // Project Budget Management permissions
        canApproveProjectBudget: () => hasPermission(userPermissions, PERMISSIONS["APPROVE-PROJECT_BUDGET"]),

        // Project Payments Management permissions
        canManageProjectPayments: () => hasPermission(userPermissions, PERMISSIONS["MANAGE-PROJECT_PAYMENTS"]),

        // Closed Projects Management permissions
        canViewClosedProjects: () => hasPermission(userPermissions, PERMISSIONS["MANAGE-PROJECT_PAYMENTS"]) || hasPermission(userPermissions, PERMISSIONS["CONFIRM-PROJECT_COMPLETION"]),

        // Project Completion Confirmation permissions
        canConfirmProjectCompletion: () => hasPermission(userPermissions, PERMISSIONS["CONFIRM-PROJECT_COMPLETION"]),

        // Invoice Management permissions
        canManageInvoices: () => hasPermission(userPermissions, PERMISSIONS["MANAGE_INVOICES"]),
    };
}