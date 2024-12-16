'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CareerApplication } from '@/types/Career';
import { careerServices } from '@/services/careerServices';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Download, Mail, MapPin, Phone, User2 } from 'lucide-react';
import Loader from '@/components/Common/Loader';
import toast from 'react-hot-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import Link from 'next/link';

// /careers/applications/[applicationId]/page.tsx

const page = ({ params }: { params: { applicationId: string } }) => {
    const [application, setApplication] = useState<CareerApplication | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchApplication = async () => {
            const result = await careerServices.getApplicationDetails(params.applicationId);
            if (result.success) {
                setApplication(result.data);
            } else {
                setError(result.message);
            }
            setIsLoading(false);
        };

        fetchApplication();
    }, [params.applicationId]);

    const handleStatusChange = async (newStatus: string) => {
        if (!application?._id) return;

        try {
            setIsProcessing(true);
            const result = await careerServices.updateApplicationStatus(
                application._id,
                newStatus as CareerApplication['status']
            );

            if (result.success) {
                setApplication(result.data);
                toast.success(`Status updated to ${newStatus}`);
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.error('An error occurred while updating status');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteApplication = async () => {
        if (!application?._id) return;

        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                setIsProcessing(true);
                const result = await careerServices.deleteApplication(application._id);
                if (result.success) {
                    toast.success('Application deleted successfully');
                    router.push('/careers/applications');
                } else {
                    toast.error('Failed to delete application');
                }
            } catch (error) {
                toast.error('An error occurred while deleting the application');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!application) return <div>Application not found</div>;

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'bg-yellow-500',
            reviewing: 'bg-blue-500',
            shortlisted: 'bg-green-500',
            rejected: 'bg-red-500',
            hired: 'bg-purple-500'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-500';
    };

    const getStatusTimeline = () => {
        const timeline = [
            {
                status: 'pending',
                label: 'Application Submitted',
                date: new Date(application.createdAt || '').toLocaleDateString(),
                reached: true
            },
            {
                status: 'reviewing',
                label: 'Under Review',
                reached: ['reviewing', 'shortlisted', 'hired', 'rejected'].includes(application.status)
            },
            {
                status: 'shortlisted',
                label: 'Shortlisted',
                reached: ['shortlisted', 'hired'].includes(application.status)
            },
            {
                status: 'hired',
                label: 'Hired',
                reached: application.status === 'hired'
            }
        ];

        if (application.status === 'rejected') {
            timeline.push({
                status: 'rejected',
                label: 'Application Rejected',
                reached: true
            });
        }

        return timeline;
    };

    return (
        <>
            {isProcessing && <LoadingOverlay />}
            <div className="container mx-auto p-4 max-w-5xl">
                <div className="mb-6 flex justify-between items-center">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>

                    <div className="flex gap-2">
                        <Select
                            value={application.status}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="reviewing">Reviewing</SelectItem>
                                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                <SelectItem value="hired">Hired</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="destructive" onClick={handleDeleteApplication}>
                            Delete Application
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Header Card */}
                    <Card className="dark:bg-gray-800 dark:text-white">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="w-24 h-24 bg-gray-400 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <User2 className="w-12 text-gray-800 dark:text-gray-300 h-12" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-2xl font-bold mb-2">
                                        {application.firstName} {application.lastName}
                                    </h1>
                                    <p className="text-gray-400 mb-3">
                                        {typeof application.career === 'object' ? application.career.name : 'Position'}
                                    </p>
                                    <Badge className={`${getStatusColor(application.status)}`}>
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className='dark:bg-gray-800'>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span>{application.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <span>{application.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <span>{application.address}, {application.city}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <span>Born: {new Date(application.DOB).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Links */}
                    {(application.linkedinProfile || application.githubProfile || application.projectLinks) && (
                        <Card className='dark:bg-gray-800'>
                            <CardHeader>
                                <CardTitle>Professional Links</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {application.linkedinProfile && (
                                    <a
                                        href={application.linkedinProfile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        LinkedIn Profile
                                    </a>
                                )}
                                {application.githubProfile && (
                                    <a
                                        href={application.githubProfile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        GitHub Profile
                                    </a>
                                )}

                                <CardTitle>Project Links</CardTitle>

                                {application.projectLinks && (
                                    <div
                                        className="text-blue-500 hover:underline flex flex-col gap-1"
                                    >
                                        {application.projectLinks.split(' ').map((link, index) => (
                                            <div key={index}>
                                                <p
                                                    className="block hover:underline"
                                                >
                                                    {link}
                                                </p>
                                                <br />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Resume */}
                    {application.resume && (
                        <Card className='dark:bg-gray-800'>
                            <CardHeader>
                                <CardTitle>Resume</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-blue-500 hover:underline cursor-pointer'>{application?.resume}</p>
                                <Link href={application.resume} target='_blank' >
                                    <Button className="flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Download Resume
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Application Timeline */}
                    <Card className='dark:bg-gray-800'>
                        <CardHeader>
                            <CardTitle>Application Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                {/* Timeline events */}
                                <div className="space-y-8">
                                    {getStatusTimeline().map((event, index) => (
                                        <div key={index} className="relative pl-8">
                                            {/* Timeline dot */}
                                            <div className={`absolute left-0 w-3.5 h-3.5 rounded-full border-2 ${event.reached
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'bg-gray-100 border-gray-300'
                                                }`}></div>

                                            {/* Event content */}
                                            <div className="flex flex-col">
                                                <h4 className="text-sm font-medium">{event.label}</h4>
                                                {event.date && (
                                                    <span className="text-sm text-gray-500">{event.date}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Actions */}
                    <Card className='dark:bg-gray-800'>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4">
                                <Button onClick={() => handleStatusChange('reviewing')}>
                                    Start Review
                                </Button>
                                <Button onClick={() => handleStatusChange('shortlisted')}>
                                    Shortlist Candidate
                                </Button>
                                <Button onClick={() => handleStatusChange('hired')} className="bg-green-600 hover:bg-green-700">
                                    Mark as Hired
                                </Button>
                                <Button onClick={() => handleStatusChange('rejected')} variant="destructive">
                                    Reject Application
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default page;