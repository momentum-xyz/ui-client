import {ReactElement} from 'react';
import {matchPath, Navigate, Route, Routes, RoutesProps} from 'react-router-dom';

import {createProtectedRouteElement} from 'ui-kit/utils/create-protected-route-element';
import {ProtectedRouteListInterface, RouteConfigInterface} from 'core/interfaces';

export const isTargetRoute = (currentPath: string, routes: RouteConfigInterface[]): boolean => {
  return routes.some((route) => {
    return !!matchPath({path: route.path, end: true}, currentPath);
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
      ></Route>
    );
  });
};

export const createSwitchByConfig = (
  routes: RouteConfigInterface[],
  defaultRedirect?: string,
  hasRights?: () => boolean
): ReactElement<RoutesProps, any> => {
  return (
    <Routes>
      <Route path="/">
        {createRoutesByConfig({routes, defaultRedirect, hasRights})}
        {defaultRedirect && <Route path="*" element={<Navigate to={defaultRedirect} replace />} />}
      </Route>
    </Routes>
  );
};
