import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("PrivateRoute musi być używany wewnątrz AuthProvider");
  }

  return auth.token ? <>{children}</> : <Navigate to="/login" replace />;
}