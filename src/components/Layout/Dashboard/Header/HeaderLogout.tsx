'use client'

import LoadingOverlay from "@/components/Common/LoadingOverlay";
import { authServices } from "@/services/authServices";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function HeaderLogout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const logout = async () => {
        setError('');
        setIsLoading(true);
  
        try {
          const response = await authServices.logout();
          
          if (response.success) {
            router.push('/auth/login');
          } else {
            setError(response.message || 'Logout failed. Please check your credentials.');
            toast.error(response.message || 'Logout failed. Please check your credentials.');
          }
        } catch (err) {
          setError('An unexpected error occurred. Please try again.');
          toast.error('An unexpected error occurred. Please try again.');
        } finally {
          setIsLoading(false);
        }
  }

  return (
    <>
    {isLoading && <LoadingOverlay/>}
    <div onClick={logout} onKeyDown={logout} role="button" tabIndex={0}>
      {children}
    </div>
    </>
  )
}
