'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { cmsClientsServices } from '@/services/cmsClientServices';
import toast from 'react-hot-toast';
import { ImagePlus } from 'lucide-react';

export default function AddClientPage() {
    const [loading, setLoading] = useState(false);
    const [clientName, setClientName] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!clientName.trim() || !selectedImage) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const result = await cmsClientsServices.addClient({
                name: clientName,
                image: selectedImage
            });

            if (result.success) {
                toast.success('Client added successfully');
                router.push('/cms/clients');
            } else {
                throw new Error(result.message || 'Failed to add client');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add client';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Client</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="clientName">Client Name</Label>
                            <Input
                                id="clientName"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Enter client name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Client Logo</Label>
                            <div className="mt-2">
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="image-upload"
                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <ImagePlus className="w-8 h-8 mb-4 text-gray-500" />
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                    Click to upload client logo
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    PNG, JPG or JPEG (MAX. 800x400px)
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            required
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Client'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}