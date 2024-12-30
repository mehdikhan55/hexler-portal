'use client'
// /manage-accounts/page.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authServices } from '@/services/authServices';
import toast from 'react-hot-toast';
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import AccountCard from '@/components/AccountManagement/AccountCard';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const AccountManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddAccount, setShowAddAccount] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const [newAccount, setNewAccount] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: ''
    });

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [usersResult, rolesResult] = await Promise.all([
                authServices.getUsers(),
                authServices.getRoles()
            ]);

            if (usersResult.success) {
                console.log('usersResult.data:', usersResult.data)
                setUsers(usersResult.data);
            }
            if (rolesResult.success) {
                console.log('rolesResult.data:', rolesResult.data)
                setRoles(rolesResult.data);
            }
        } catch (error) {
            toast.error('Failed to load data');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddAccount = async () => {
        if (!newAccount.email || !newAccount.password || !newAccount.firstName ||
            !newAccount.lastName || !newAccount.role) {
            toast.error('All fields are required');
            return;
        }

        setIsLoading(true);
        try {
            const result = await authServices.registerUser(newAccount);
            if (result.success) {
                toast.success('Account created successfully');
                setShowAddAccount(false);
                setNewAccount({
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    role: ''
                });
                loadData();
            } else {
                toast.error(result.message || 'Failed to create account');
            }
        } catch (error) {
            toast.error('Failed to create account');
        }
        setIsLoading(false);
    };

    return (
        <div className="container mx-auto p-4">
            {isLoading && <LoadingOverlay />}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Account Management</h1>
                <div className="space-x-2">
                    <Button onClick={() => setShowAddAccount(true)}>
                        Add Account
                    </Button>
                    <Button onClick={() => router.push('/manage-roles')} variant="outline">
                        Manage Roles
                    </Button>
                </div>
            </div>

            {/* Accounts Section */}
            <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user: any) => (
                        <AccountCard key={user._id} user={user} onRefresh={loadData} />
                    ))}
                </div>
            </div>

            {/* Add Account Dialog */}
            <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
                <DialogContent  className='z-[5000]'>
                    <DialogHeader>
                        <DialogTitle>Add New Account</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={newAccount.email}
                                onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                                placeholder="Enter email address"
                            />
                        </div>
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={newAccount.firstName}
                                onChange={(e) => setNewAccount({ ...newAccount, firstName: e.target.value })}
                                placeholder="Enter first name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={newAccount.lastName}
                                onChange={(e) => setNewAccount({ ...newAccount, lastName: e.target.value })}
                                placeholder="Enter last name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={newAccount.password}
                                    onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                                    placeholder="Enter password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={newAccount.role}
                                onValueChange={(value) => setNewAccount({ ...newAccount, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role: any) => (
                                        <SelectItem key={role._id} value={role._id}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowAddAccount(false)}>
                                Cancel
                            </Button>
                            <Button disabled={isLoading} onClick={handleAddAccount}>
                                {
                                    isLoading ? "Processing..," : "Create Account"
                                }
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AccountManagementPage;