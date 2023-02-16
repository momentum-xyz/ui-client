import {ReactElement} from 'react';
import {Link, matchPath, Navigate, Route, Routes, RoutesProps} from 'react-router-dom';

import {createProtectedRouteElement} from 'ui-kit/utils/create-protected-route-element';
import {ProtectedRouteListInterface, RouteConfigInterface} from 'core/interfaces';

const isDevEnv = process.env.NODE_ENV === 'development';

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
      {createRoutesByConfig({routes, defaultRedirect, hasRights})}
      {defaultRedirect && (
        <Route
          path="*"
          element={
            isDevEnv ? (
              <div style={{color: '#a9a9a9', pointerEvents: 'all'}}>
                <div>Route not found</div>
                <pre>{JSON.stringify(routes, null, 2)}</pre>
                <Link to={defaultRedirect}>Go to defaultRedirect route: "{defaultRedirect}"</Link>
              </div>
            ) : (
              <Navigate to={defaultRedirect} replace />
            )
          }
        />
      )}
    </Routes>
  );
};

export const constructTargetTabUrl = (tabParam: string, url: string): string => {
  const baseUrl = url.split('/').slice(0, -1).join('/');
  return `${baseUrl}/${tabParam}`;
};
