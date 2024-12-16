'use client'
import AddCareers from '@/components/Careers/AddCareers';
import CareerCard from '@/components/Careers/CareerCard';
import Loader from '@/components/Common/Loader'
import { careerServices } from '@/services/careerServices';
import { AddCareer, Career } from '@/types/Career';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

// /careers/page.tsx

const page = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [careers, setCareers] = useState<Career[]>([]);
    const router = useRouter();

    // Fetch initial data
    const fetchCareers = async () => {
        const result = await careerServices.getCareers();
        if (result.success) {
            console.log(result);
            setCareers(result.data);
            console.log(result.data);
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    const handleAddCareer = async (newCareer: AddCareer) => {
        const { success, data, message } = await careerServices.addCareer(newCareer);

        if (success) {
            console.log('Upload successful:', data);
            toast.success('Career added successfully');
            router.push('/careers');
        } else {
            setError(message);
        }
        await fetchCareers();
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCareers();
    }, [])

    return (
        <div>
            <h1>Careers</h1>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    {error ? (
                        <p className="text-red-600">{error}</p>
                    ) : (
                        <>
                            <AddCareers onAddCareer={handleAddCareer} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {careers.map((career) => (
                                    <CareerCard key={career._id} career={career} fetchCareers={fetchCareers} />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default page
