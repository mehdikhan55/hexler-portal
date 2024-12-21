import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreVertical, Edit, Trash, Lock, Ban } from "lucide-react";
import { authServices } from '@/services/authServices';
import toast from 'react-hot-toast';
import LoadingOverlay from '@/components/Common/LoadingOverlay';

// Account Card Component
const AccountCard = ({ user, onRefresh }: { user: any, onRefresh: () => void }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDeleteAccount = async () => {
        setIsProcessing(true);
        try {
            const result = await authServices.deleteUser(user._id);
            if (result.success) {
                toast.success('Account deleted successfully');
                onRefresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to delete account');
        }
        setIsProcessing(false);
        setShowDeleteConfirm(false);
    };

    const handleStatusChange = async () => {
        setIsProcessing(true);
        try {
            const result = await authServices.updateUserStatus(user._id, !user.isActive);
            if (result.success) {
                toast.success(`Account ${result.data.isActive ? 'activated' : 'deactivated'} successfully`);
                onRefresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to update account status');
        }
        setIsProcessing(false);
    };

    const handleResetPassword = async () => {
        if (!newPassword) {
            toast.error('Please enter a new password');
            return;
        }
        setIsProcessing(true);
        try {
            const result = await authServices.resetUserPassword(user._id, newPassword);
            if (result.success) {
                toast.success('Password reset successfully');
                setNewPassword('');
                setShowResetPassword(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to reset password');
        }
        setIsProcessing(false);
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
                            {/* <DropdownMenuItem onClick={() => setShowDetails(true)}>
                                <Edit className="mr-2 h-4 w-4" />Edit Account
                            </DropdownMenuItem> */}
                            <DropdownMenuItem onClick={() => setShowResetPassword(true)}>
                                <Lock className="mr-2 h-4 w-4" />Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleStatusChange}>
                                <Ban className="mr-2 h-4 w-4" />
                                {user.isActive ? 'Deactivate' : 'Activate'} Account
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <Trash className="mr-2 h-4 w-4" />Delete Account
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <CardTitle className="text-xl font-bold text-white">
                        {user.firstName} {user.lastName}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-gray-300">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role.name}</p>
                        <p><strong>Status:</strong> 
                            <span className={user.isActive ? "text-green-500" : "text-red-500"}>
                                {user.isActive ? ' Active' : ' Inactive'}
                            </span>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete Account</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this account? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </Button>
                        <Button disabled={isProcessing} variant="destructive" onClick={handleDeleteAccount}>
                          {
                            isProcessing ? 'Processing...' : 'Delete'
                          }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowResetPassword(false)}>
                                Cancel
                            </Button>
                            <Button disabled={isProcessing} onClick={handleResetPassword}>
                               {
                                 isProcessing ? 'Processing...' : 'Reset Password'
                               }
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AccountCard;