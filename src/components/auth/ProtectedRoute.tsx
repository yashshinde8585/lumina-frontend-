import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

interface ProtectedRouteProps {
    children: ReactNode;
    adminOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
    const token = authService.getToken();
    const location = useLocation();

    // In a real production app, you should decode the JWT to check the role/expiration.
    // For this MVP, we check the stored email as a proxy for the 'admin' role.
    const isAdmin = authService.getUserEmail() === 'admin@resumeai.com';

    if (!token) {
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
