import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useUser();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                <div className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-brand-500 animate-spin"></div>
            </div>
        );
    }

    if (!user || !user.token) {
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // If they have a role but it's wrong, redirect to their correct dashboard
        if (user.role === 'business') return <Navigate to="/business-dashboard" replace />;
        if (user.role === 'influencer') return <Navigate to="/influencer-dashboard" replace />;

        // If they have no role (rare but possible during signup flow), go to selection
        return <Navigate to="/role-selection" replace />;
    }

    return children;
};

export default ProtectedRoute;
