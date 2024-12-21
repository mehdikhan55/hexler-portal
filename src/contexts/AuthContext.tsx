// contexts/AuthContext.tsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { Permission } from '@/types/permission';
import Loader from '@/components/Common/Loader';

interface AuthContextType {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        permissions: Permission[];
    } | null;
    loadingUser: boolean;
    initAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loadingUser: true,
    initAuth: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Fetch user data on initial load
    const initAuth = async () => {
        setLoadingUser(true);
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loadingUser,initAuth }}>
            {loadingUser ? (
                <Loader />
            ):(
                <>
            {children}
            </>
            )
        }
        </AuthContext.Provider>
    );
}

// Hook to use auth context
export function useAuth() {
    return useContext(AuthContext);
}