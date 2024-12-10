"use client"
import React, { useEffect, useState } from 'react';
import {
    Building2, Mail, Phone, Calendar, MapPin,
    Briefcase, BadgeDollarSign, Clock, User2
} from 'lucide-react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { employeeServices } from '@/services/employeeServices';
import { Employee } from '@/types/Employee';
import Loader from "@/components/Common/Loader"

const EmployeeDetailsPage = ({ params: { employeeId } }: any) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employee, setEmployee] = useState<Employee | null>(null);

    const fetchEmployee = async () => {
        setLoading(true);
        const result = await employeeServices.getSingleEmployee(employeeId);
        if (result.success) {
            setEmployee(result.data);
            setLoading(false);
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, [employeeId]);

    return (
        <div className="">
            {loading ? (
                <Loader />
            ) : (
                <>
                    {error ? (
                        <div className="flex items-center justify-center min-h-[50vh]">
                            <p className="text-destructive text-lg">{error}</p>
                        </div>
                    ) : (
                        <div className="container mx-auto px-4 py-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Profile Section */}
                                <div className="lg:col-span-1 p-6  dark:bg-gray-800 rounded-xl shadow-sm">
                                    <div className="flex flex-col items-center">
                                        <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
                                            {employee?.profilePhoto ? (
                                                <Image
                                                    src={(employee?.profilePhoto === "/images/default-profile.jpg") ? "/assets/default-profile.jpg" : employee.profilePhoto}
                                                    alt={`${employee.firstName} ${employee.lastName}`}
                                                    width={160}
                                                    height={160}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-4xl font-semibold">
                                                    {employee?.firstName[0]}{employee?.lastName[0]}
                                                </div>
                                            )}
                                        </div>
                                        <h1 className="text-2xl font-bold mb-1 dark:text-white">
                                            {employee?.firstName} {employee?.lastName}
                                        </h1>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-sm font-medium mb-4",
                                            {
                                                "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200": employee?.status === 'active',
                                                "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200": employee?.status === 'inactive',
                                                "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200": employee?.status === 'terminated'
                                            }
                                        )}>
                                            {employee?.status?.charAt(0).toUpperCase()}{employee?.status?.slice(1)}
                                        </span>
                                        <div className="w-full space-y-3">
                                            <InfoItem icon={Mail} label="Email" value={employee?.email} />
                                            <InfoItem icon={Phone} label="Phone" value={employee?.phoneNumber} />
                                            <InfoItem icon={Building2} label="Department" value={employee?.department} />
                                        </div>
                                    </div>
                                </div>

                                {/* Details Section */}
                                <div className="lg:col-span-2 p-6 dark:bg-gray-800 rounded-xl shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <section>
                                            <h2 className="text-xl font-semibold mb-4 dark:text-white">Professional Details</h2>
                                            <div className="space-y-4">
                                                <InfoItem icon={Briefcase} label="Position" value={employee?.position} />
                                                <InfoItem
                                                    icon={BadgeDollarSign}
                                                    label="Salary"
                                                    value={employee?.salary ? `${employee.salary.toLocaleString()}` : undefined}
                                                />
                                                <InfoItem
                                                    icon={Calendar}
                                                    label="Hire Date"
                                                    value={employee?.hireDate ? new Date(employee.hireDate).toLocaleDateString() : undefined}
                                                />
                                            </div>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-semibold mb-4 dark:text-white">Personal Information</h2>
                                            <div className="space-y-4">
                                                {employee?.dateOfBirth && (
                                                    <InfoItem
                                                        icon={User2}
                                                        label="Date of Birth"
                                                        value={new Date(employee.dateOfBirth).toLocaleDateString()}
                                                    />
                                                )}
                                                {employee?.address && (
                                                    <InfoItem
                                                        icon={MapPin}
                                                        label="Address"
                                                        value={`${employee.address.street}, ${employee.address.city}, ${employee.address.state} ${employee.address.zip}`}
                                                    />
                                                )}
                                                <InfoItem
                                                    icon={Clock}
                                                    label="Last Updated"
                                                    value={employee?.updatedAt || employee?.createdAt ?
                                                        // @ts-ignore
                                                        new Date(employee.updatedAt || employee.createdAt).toLocaleDateString() : undefined}
                                                />
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }: {
    icon: any,
    label: string,
    value?: string | null
}) => {
    if (!value) return null;

    return (
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="font-medium dark:text-gray-200">{value}</p>
            </div>
        </div>
    );
};

export default EmployeeDetailsPage;