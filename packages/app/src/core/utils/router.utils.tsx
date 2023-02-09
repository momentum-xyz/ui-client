import React, {ReactElement} from 'react';
import {matchPath, Navigate, Route, Routes, RoutesProps} from 'react-router-dom';

import {ProtectedRoute} from 'ui-kit';
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

  return routes.map((route) => (
    <ProtectedRoute
      key={route.path}
      {...route}
      hasRights={hasRights}
      defaultRedirect={defaultRedirect}
    >
      <route.main />
    </ProtectedRoute>
  ));
};

export const createSwitchByConfig = (
  routes: RouteConfigInterface[],
  defaultRedirect?: string,
  hasRights?: () => boolean
): ReactElement<RoutesProps, any> => {
  return (
    <Routes>
      {createRoutesByConfig({routes, defaultRedirect, hasRights})}
      {defaultRedirect && <Route path="*" element={<Navigate to={defaultRedirect} replace />} />}
    </Routes>
  );
};
