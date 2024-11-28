import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If not authenticated, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
