import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('CEO' | 'OPS_MGR' | 'SALES' | 'MARKETING' | 'TRAINER' | 'FINANCE' | 'HR' | 'INTERN')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg)' }}>
        <div className="loader" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>Loading Operations Control...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
        textAlign: 'center',
        gap: '1rem',
        color: 'var(--color-text-main)'
      }}>
        <ShieldAlert size={64} color="var(--color-error)" />
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Access Denied</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px' }}>
          Your current role (<strong>{user.role}</strong>) does not have permission to access the <strong>{location.pathname}</strong> module. Please contact Sarah Admin (CEO) for access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
