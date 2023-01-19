import React, {ReactElement} from 'react';
import {matchPath, Navigate, Route, Routes} from 'react-router-dom';
import {RoutesProps} from 'react-router';

import {RouteConfigInterface} from 'core/interfaces';

export const isTargetRoute = (currentPath: string, routes: RouteConfigInterface[]): boolean => {
  return routes.some((route) => {
    return !!matchPath({path: route.path}, currentPath);
  });
};

export const createRoutesByConfig = (
  routes: RouteConfigInterface[]
): ReactElement<string, any>[] => {
  return routes.map(({path, exact, ...rest}) => (
    <Route key={path} path={path}>
      <rest.main />
    </Route>
  ));
};

export const createSwitchByConfig = (
  routes: RouteConfigInterface[],
  defaultRedirect?: string
): ReactElement<RoutesProps, any> => (
  <Routes>
    {createRoutesByConfig(routes)}
    {defaultRedirect && <Route path="*" element={<Navigate to={defaultRedirect} replace />} />}
  </Routes>
);
