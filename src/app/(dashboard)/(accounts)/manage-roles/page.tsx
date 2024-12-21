'use client'
// /manage-roles/page.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authServices } from '@/services/authServices';
import toast from 'react-hot-toast';
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import RoleCard from '@/components/AccountManagement/RoleCard';
import { Checkbox } from "@/components/ui/checkbox";

const RolesManagementPage = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddRole, setShowAddRole] = useState(false);
    const [newRole, setNewRole] = useState({
        name: '',
        description: '',
        permissions: []
    });

    const loadRoles = async () => {
        setIsLoading(true);
        try {
            const result = await authServices.getRoles();
            if (result.success) {
                setRoles(result.data);
            } else {
                toast.error('Failed to load roles');
            }
        } catch (error) {
            toast.error('Failed to load roles');
        }
        setIsLoading(false);
    };

    const loadPermissions = async () => {
        try {
            const result = await authServices.getPermissions();
            if (result.success) {
                setPermissions(result.data);
            } else {
                toast.error('Failed to load permissions');
            }
        } catch (error) {
            toast.error('Failed to load permissions');
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            setIsLoading(true);
            await Promise.all([loadRoles(), loadPermissions()]);
            setIsLoading(false);
        };
        
        initializeData();
    }, []);

    const handleAddRole = async () => {
        if (!newRole.name.trim()) {
            toast.error('Role name is required');
            return;
        }

        setIsLoading(true);
        try {
            const result = await authServices.createRole(newRole);
            if (result.success) {
                toast.success('Role created successfully');
                setShowAddRole(false);
                loadRoles();
                setNewRole({ name: '', description: '', permissions: [] });
            } else {
                toast.error(result.message || 'Failed to create role');
            }
        } catch (error) {
            toast.error('Failed to create role');
        }
        setIsLoading(false);
    };

    const handlePermissionChange = (permissionId: string) => {
        //@ts-ignore
        setNewRole(prev => {
            //@ts-ignore
            const newPermissions = prev.permissions.includes(permissionId)
                ? prev.permissions.filter(p => p !== permissionId)
                : [...prev.permissions, permissionId];
            
            return { ...prev, permissions: newPermissions };
        });
    };

    // Group permissions by category for better organization
    const groupedPermissions = permissions.reduce((groups: any, permission: any) => {
        // Extract category from permission name (e.g., "MANAGE_PAYROLL" -> "PAYROLL")
        const category = permission.name.split('_')[1] || 'OTHER';
        
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(permission);
        return groups;
    }, {});

    return (
        <div className="container mx-auto p-4">
            {isLoading && <LoadingOverlay />}
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Role Management</h1>
                <Button onClick={() => setShowAddRole(true)}>
                    Add New Role
                </Button>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role: any) => (
                    <RoleCard key={role._id} role={role} onRefresh={loadRoles} />
                ))}
            </div>

            {/* Add Role Dialog */}
            <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
                <DialogContent className="max-w-md h-[35rem] z-[5000] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Role</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="role-name">Role Name</Label>
                            <Input
                                id="role-name"
                                value={newRole.name}
                                onChange={(e) => setNewRole(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))}
                                placeholder="Enter role name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="role-description">Description (Optional)</Label>
                            <Input
                                id="role-description"
                                value={newRole.description}
                                onChange={(e) => setNewRole(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))}
                                placeholder="Enter role description"
                            />
                        </div>

                        {/* Permissions Section */}
                        <div className="space-y-4">
                            <Label>Permissions</Label>
                            {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                                <div key={category} className="space-y-2">
                                    <h3 className="font-semibold text-sm text-gray-400">{category}</h3>
                                    <div className="space-y-2">
                                        {(categoryPermissions as any[]).map((permission) => (
                                            <div key={permission._id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`new-${permission._id}`}
                                                    //@ts-ignore
                                                    checked={newRole.permissions.includes(permission._id)}
                                                    onCheckedChange={() => handlePermissionChange(permission._id)}
                                                />
                                                <Label
                                                    htmlFor={`new-${permission._id}`}
                                                    className="text-sm"
                                                >
                                                    {permission.name}
                                                    {permission.description && (
                                                        <span className="text-xs text-gray-500 block">
                                                            {permission.description}
                                                        </span>
                                                    )}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowAddRole(false)}>
                                Cancel
                            </Button>
                            <Button disabled={isLoading} onClick={handleAddRole}>
                               {isLoading ? 'Processing...' : ' Create Role'}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RolesManagementPage;