import {FC, ReactElement} from 'react';
import {matchPath, Navigate, Route, Routes, RoutesProps, useLocation} from 'react-router-dom';

import {createProtectedRouteElement} from 'ui-kit/utils/create-protected-route-element';
import {ProtectedRouteListInterface, RouteConfigInterface} from 'core/interfaces';
import {ROUTES} from 'core/constants';

export const isTargetRoute = (currentPath: string, routes: RouteConfigInterface[]): boolean => {
  return routes.some((route) => {
    const {path, exact = false} = route;
    return !!matchPath({path, end: exact}, currentPath);
  });
};

export const createRoutesByConfig = (
  config: ProtectedRouteListInterface
): ReactElement<string, any>[] => {
  const {routes, defaultRedirect, hasRights} = config;

  return routes.map((route, idx) => {
    const protectedRouteElement = createProtectedRouteElement(
      route.main,
      hasRights,
      defaultRedirect
    );
    return (
      <Route
        key={idx}
        path={`${route.path}${route.exact ? '' : '/*'}`}
        element={protectedRouteElement}
      />
    );
  });
};

const NavigateFallback: FC<{url: string; debugInfo: string}> = ({url, debugInfo}) => {
  const location = useLocation();

  const isAlreadyMatched = location.pathname === url;
  if (isAlreadyMatched) {
    console.log('Route already matched', {url, location, debugInfo});
    return (
      <div>Something went wrong! Bad routing on {location.pathname}. Contact the development!</div>
    );
  }

  return <Navigate to={url} replace />;
};

export const createSwitchByConfig = (
  routes: RouteConfigInterface[],
  defaultRedirect = ROUTES.explore,
  hasRights?: () => boolean
): ReactElement<RoutesProps, any> => {
  return (
    <Routes>
      {createRoutesByConfig({routes, defaultRedirect, hasRights})}
      {defaultRedirect && (
        <Route
          path="*"
          element={
            <NavigateFallback url={defaultRedirect} debugInfo={JSON.stringify(routes, null, 2)} />
          }
        />
      )}
    </Routes>
  );
};
