import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useEffect, useRef } from 'react';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const hasShownToast = useRef(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Only reset the initial load flag after authentication is checked
    if (!isLoading) {
      // After first check, it's no longer the initial load
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      }
    }
  }, [isLoading]);

  // Only show toast if:
  // 1. We're not in the initial loading phase
  // 2. The user is definitively not authenticated
  // 3. We haven't shown the toast already for this route
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isInitialLoad.current && !hasShownToast.current) {
      // Show the toast only once
      toast.error('Please sign in to access this feature');
      hasShownToast.current = true;
    }
  }, [isLoading, isAuthenticated]);

  // While loading, don't redirect or show anything
  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    // Redirect to login while preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Reset the toast flag when the route changes
  hasShownToast.current = false;
  
  return <Outlet />;
};

export default ProtectedRoute;
