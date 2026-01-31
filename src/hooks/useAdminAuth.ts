import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, adminLogout, isAdminAuthenticated } from '@/lib/adminStorage';

export const useAdminAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = isAdminAuthenticated();
            setIsAuthenticated(authenticated);
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = (email: string, password: string): boolean => {
        const success = adminLogin(email, password);
        if (success) {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        adminLogout();
        setIsAuthenticated(false);
        navigate('/admin');
    };

    return {
        isAuthenticated,
        isLoading,
        login,
        logout,
    };
};
