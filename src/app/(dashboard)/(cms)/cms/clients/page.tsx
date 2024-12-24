'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus, Trash, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import { cmsClientsServices, CMSClient } from '@/services/cmsClientServices';
import toast from 'react-hot-toast';
import Loader from "@/components/Common/Loader";

interface ClientsState {
    clients: CMSClient[];
    loading: boolean;
    error: string | null;
    deletingClientId: string | null;
    isDeleting: boolean;
    isUpdating: boolean;
}

export default function ClientsPage(): JSX.Element {
    const [state, setState] = useState<ClientsState>({
        clients: [],
        loading: true,
        error: null,
        deletingClientId: null,
        isDeleting: false,
        isUpdating: false
    });
    
    const router = useRouter();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async (): Promise<void> => {
        try {
            setState(prev => ({ ...prev, loading: true }));
            const result = await cmsClientsServices.getClients();
            
            if (result.success) {
                setState(prev => ({
                    ...prev,
                    clients: result.data,
                    error: null
                }));
                console.log('fetched clients', result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch clients');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load clients';
            setState(prev => ({ ...prev, error: errorMessage }));
            toast.error(errorMessage);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const handleDelete = (clientId: string): void => {
        setState(prev => ({ ...prev, deletingClientId: clientId }));
    };

    const handleToggleDisplay = async (clientId: string, currentDisplay: boolean): Promise<void> => {
        try {
            setState(prev => ({ ...prev, isUpdating: true }));
            const result = await cmsClientsServices.updateClientDisplay(clientId, !currentDisplay);

            if (result.success) {
                toast.success(`Client ${!currentDisplay ? 'shown' : 'hidden'} successfully`);
                fetchClients();
            } else {
                throw new Error(result.message || 'Failed to update client display status');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update display status';
            toast.error(errorMessage);
        } finally {
            setState(prev => ({ ...prev, isUpdating: false }));
        }
    };

    const confirmDelete = async (): Promise<void> => {
        if (!state.deletingClientId) return;

        try {
            setState(prev => ({ ...prev, isDeleting: true }));
            const result = await cmsClientsServices.deleteClient(state.deletingClientId);

            if (result.success) {
                toast.success('Client deleted successfully');
                fetchClients();
            } else {
                throw new Error(result.message || 'Failed to delete client');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete client';
            toast.error(errorMessage);
        } finally {
            setState(prev => ({
                ...prev,
                isDeleting: false,
                deletingClientId: null
            }));
        }
    };

    if (state.loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Clients</h2>
                <p className="text-gray-600">{state.error}</p>
                <Button onClick={fetchClients} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Clients</h1>
                <Button onClick={() => router.push('/cms/clients/new')}>
                    <Plus className="w-4 h-4 mr-2" /> Add New Client
                </Button>
            </div>
            <div className="flex gap-4">
            <p>Total Clients: {state.clients.length}</p>
            <p>Total Clients Displayed: {state.clients.filter(client => client.display).length}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.clients.map((client) => (
                    <Card key={client._id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="relative">
                                <img 
                                    src={client.image} 
                                    alt={client.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-opacity-100">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem 
                                                onClick={() => handleToggleDisplay(client._id!, client.display)}
                                                disabled={state.isUpdating}
                                            >
                                                {client.display ? (
                                                    <>
                                                        <EyeOff className="w-4 h-4 mr-2" />
                                                        Hide from Website
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Show on Website
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-red-600"
                                                onClick={() => handleDelete(client._id!)}
                                            >
                                                <Trash className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="font-semibold text-lg">{client.name}</h3>
                                    <Badge variant={client.display ? "default" : "secondary"}>
                                        {client.display ? 'Visible' : 'Hidden'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {state.clients.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">No clients found.</p>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!state.deletingClientId} onOpenChange={() => setState(prev => ({ ...prev, deletingClientId: null }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this client? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setState(prev => ({ ...prev, deletingClientId: null }))}
                            disabled={state.isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={state.isDeleting}
                        >
                            {state.isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}