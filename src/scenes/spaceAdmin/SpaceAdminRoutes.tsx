import React from 'react';

import {RouteConfigInterface} from 'core/interfaces';

import {BroadcastPage, SpaceAdminPage} from './pages';

export const PRIVATE_ROUTES = (path: string) => {
  const routes: RouteConfigInterface[] = [
    {
      path: `${path}/`,
      main: () => <SpaceAdminPage />,
      exact: true
    },
    {
      path: `${path}/broadcast`,
      main: () => <BroadcastPage />,
      exact: true
    }
  ];

  return routes;
};
