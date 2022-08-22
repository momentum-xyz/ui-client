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
  return routes.map(({path, exact, renderBackground, ...rest}) => (
    <Route key={path} path={path} exact={exact}>
      {renderBackground && <div className="scene-bg" />}
      <rest.main />
    </Route>
  ));
};
