import React, {ReactElement} from 'react';
import {matchPath, Route} from 'react-router-dom';

import {RouteConfigInterface} from 'core/interfaces';

export const isTargetRoute = (currentPath: string, routes: RouteConfigInterface[]): boolean => {
  return routes.some((route) => {
    return !!matchPath(currentPath, {path: route.path, exact: route.exact});
  });
};

export const createRoutesByConfig = (
  routes: RouteConfigInterface[]
): ReactElement<string, any>[] => {
  return routes.map(({path, exact, ...rest}) => (
    <Route key={path} path={path} exact={exact}>
      {!!rest.main() && rest.renderBackground && <div className="fixed inset-0 bg-dark-blue-70" />}
      {!!rest.sidebar && <rest.sidebar />}
      <rest.main />
    </Route>
  ));
};
