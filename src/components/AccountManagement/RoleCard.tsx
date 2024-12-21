import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreVertical, Edit, Trash, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import toast from 'react-hot-toast';
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import { authServices } from '@/services/authServices';

const RoleCard = ({ role, onRefresh }: { role: any, onRefresh: () => void }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showPermissions, setShowPermissions] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [permissions, setPermissions] = useState<any[]>([]);
    const [editedRole, setEditedRole] = useState({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions.map((p: any) => p._id || p)
    });

    // Fetch permissions from database
    useEffect(() => {
        const fetchPermissions = async () => {
            const result = await authServices.getPermissions();
            if (result.success) {
                setPermissions(result.data);
            } else {
                toast.error('Failed to load permissions');
            }
        };
        
        fetchPermissions();
    }, []);

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

    const handleDeleteRole = async () => {
        setIsProcessing(true);
        try {
            const result = await authServices.deleteRole(role._id);
            if (result.success) {
                toast.success('Role deleted successfully');
                onRefresh();
            } else {
                toast.error(result.message || 'Failed to delete role');
            }
        } catch (error) {
            toast.error('Error deleting role');
        }
        setIsProcessing(false);
        setShowDeleteConfirm(false);
    };

    const handleUpdateRole = async () => {
        if (!editedRole.name.trim()) {
            toast.error('Role name is required');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await authServices.updateRole(role._id, editedRole);
            if (result.success) {
                toast.success('Role updated successfully');
                onRefresh();
                setShowEditModal(false);
                setShowPermissions(false);
            } else {
                toast.error(result.message || 'Failed to update role');
            }
        } catch (error) {
            toast.error('Error updating role');
        }
        setIsProcessing(false);
    };

    const handlePermissionChange = (permissionId: string) => {
        setEditedRole(prev => {
            const newPermissions = prev.permissions.includes(permissionId)
            //@ts-ignore
                ? prev.permissions.filter(p => p !== permissionId)
                : [...prev.permissions, permissionId];

            return { ...prev, permissions: newPermissions };
        });
    };

    return (
        <>
            {isProcessing && <LoadingOverlay />}

            <Card className="bg-gray-800 dark:bg-gray-800">
                <CardHeader className="relative">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="absolute right-2 top-2 h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                                <Edit className="mr-2 h-4 w-4" />Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowPermissions(true)}>
                                <Shield className="mr-2 h-4 w-4" />Manage Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <Trash className="mr-2 h-4 w-4" />Delete Role
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <CardTitle className="text-xl font-bold text-white">
                        {role.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {role.description && (
                            <p className="text-gray-300">{role.description}</p>
                        )}
                        <div>
                            <h4 className="text-sm font-semibold mb-2 text-gray-300">Permissions:</h4>
                            {/* Group permissions in the display as well */}
                            {Object.entries(
                                role.permissions.reduce((groups: any, permission: any) => {
                                    const category = (permission.name || permission).split('_')[1] || 'OTHER';
                                    if (!groups[category]) groups[category] = [];
                                    groups[category].push(permission);
                                    return groups;
                                }, {})
                            ).map(([category, categoryPermissions]) => (
                                <div key={category} className="mb-2">
                                    <h5 className="text-xs font-semibold mb-1 text-gray-400">{category}</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {(categoryPermissions as any[]).map((permission: any) => (
                                            <span
                                                key={permission._id || permission}
                                                className="bg-blue-500 text-white text-xs px-2 py-1 rounded"
                                            >
                                                {permission.name || permission}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Role Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="role-name">Role Name</Label>
                            <Input
                                id="role-name"
                                value={editedRole.name}
                                onChange={(e) => setEditedRole(prev => ({
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
                                value={editedRole.description}
                                onChange={(e) => setEditedRole(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))}
                                placeholder="Enter role description"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button disabled={isProcessing} onClick={handleUpdateRole}>
                                {isProcessing ? "Processing..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Manage Permissions Modal */}
            <Dialog open={showPermissions} onOpenChange={setShowPermissions}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Manage Permissions</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                        {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                            <div key={category} className="space-y-2">
                                <h3 className="font-semibold text-sm text-gray-400">{category}</h3>
                                <div className="space-y-2">
                                    {(categoryPermissions as any[]).map((permission) => (
                                        <div key={permission._id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={permission._id}
                                                checked={editedRole.permissions.includes(permission._id)}
                                                onCheckedChange={() => handlePermissionChange(permission._id)}
                                            />
                                            <Label htmlFor={permission._id} className="text-sm">
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
                        <Button variant="outline" onClick={() => setShowPermissions(false)}>
                            Cancel
                        </Button>
                        <Button disabled={isProcessing} onClick={handleUpdateRole}>
                            {isProcessing ? "Processing..." : "Save Permissions"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete Role</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this role? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </Button>
                        <Button disabled={isProcessing} variant="destructive" onClick={handleDeleteRole}>
                            {isProcessing ? 'Processing...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RoleCard;