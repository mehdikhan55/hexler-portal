
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Notfound() {
    return (
        <>
            <div className='flex flex-col w-full h-screen bg-[#001524] items-center justify-center gap-5'>
                <div className=' flex w-4/5 items-center justify-center'>
                    <Image
                        priority
                        src="/404Custom.svg"
                        width={600}
                        height={600}
                        alt="404 error image"
                    />
                </div>
                <p className='text-base text-gray-500 sm:text-lg text-center'>The page you are looking for might have been removed,<br /> had its name changed or is temporarily unavailable. </p>
                <Link href='/'>
                    <Button className='p-6 rounded-full bg-white hover:bg-gray-800 font-bold text-gray-800 hover:text-gray-900'>GO TO HOMEPAGE</Button>
                </Link>
            </div>
        </>
    )
}
