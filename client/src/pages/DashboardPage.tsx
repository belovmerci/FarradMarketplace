import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in to access your dashboard.</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <p>Your User ID: {user.userId}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Loading your details...</p>
      )}
    </div>
  );
};

export default DashboardPage;
