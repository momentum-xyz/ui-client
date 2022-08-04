import React from 'react';

import {RouteConfigInterface} from 'core/interfaces';

import {BroadcastPage, SpaceAdminPage} from './pages';

export const ADMIN_ROUTES = (path: string): RouteConfigInterface[] => [
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
