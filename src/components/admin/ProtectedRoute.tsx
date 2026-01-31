import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '@/lib/adminStorage';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = isAdminAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
};
