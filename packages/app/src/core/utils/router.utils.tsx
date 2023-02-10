import React, {ReactElement} from 'react';
import {matchPath, Redirect, Switch} from 'react-router-dom';
import {SwitchProps} from 'react-router';

import {ProtectedRoute} from 'ui-kit';
import {ProtectedRouteListInterface, RouteConfigInterface} from 'core/interfaces';

export const isTargetRoute = (currentPath: string, routes: RouteConfigInterface[]): boolean => {
  return routes.some((route) => {
    return !!matchPath(currentPath, {path: route.path, exact: route.exact});
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
): ReactElement<SwitchProps, any> => {
  return (
    <Switch>
      {createRoutesByConfig({routes, defaultRedirect, hasRights})}
      {defaultRedirect && <Redirect to={defaultRedirect} />}
    </Switch>
  );
};
