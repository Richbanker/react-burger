import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation } from 'react-router-dom';

import { selectAuthIsChecked, selectIsAuthenticated } from '@services/auth/auth-slice';
import { useAppSelector } from '@services/hooks';

import type { Location } from 'react-router-dom';

type TProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

type TLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const isAuthChecked = useAppSelector(selectAuthIsChecked);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const state = location.state as TLocationState | null;
    const redirectPath = state?.from?.pathname ?? '/';

    return <Navigate replace to={redirectPath} />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return children;
};
