import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../loaders/Skeleton';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length && !roles.includes(user.role)) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center text-center">
        <p className="font-display text-2xl font-semibold">Access restricted</p>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Your role ({user.role}) doesn't have permission to view this page. Contact an administrator if you believe this is a mistake.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
