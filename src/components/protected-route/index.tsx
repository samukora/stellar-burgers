import { Preloader } from '@ui';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

interface ProtectedRouteProps {
  children: ReactNode;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isAuthenticated && onlyUnAuth) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  if (!isAuthenticated && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
