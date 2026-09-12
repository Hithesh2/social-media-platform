import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem', borderWidth: '3px' }}></div>
          <p style={{ marginTop: '12px', color: '#6B7280', fontSize: '14px' }}>Loading Red Cross Platform...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
