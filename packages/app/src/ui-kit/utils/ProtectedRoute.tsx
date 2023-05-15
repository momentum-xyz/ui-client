import {FC} from 'react';
import {Navigate} from 'react-router-dom';

export const protectedRoute = (
  Component: FC,
  hasRights?: () => boolean,
  defaultRedirect?: string
) => {
  return !hasRights || hasRights() ? (
    <Component />
  ) : (
    <Navigate to={defaultRedirect || '/'} replace />
  );
};
