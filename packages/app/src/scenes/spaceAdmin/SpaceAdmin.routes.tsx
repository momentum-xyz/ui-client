import React from 'react';
import {generatePath} from 'react-router-dom';
import {NavigationTabInterface} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

import {BroadcastPage, SpaceAdminPage} from './pages';

export const ADMIN_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.spaceAdmin.base,
    main: () => <SpaceAdminPage />,
    exact: true
  },
  {
    path: ROUTES.spaceAdmin.broadcast,
    main: () => <BroadcastPage />,
    exact: true
  }
];

export const buildAdminNavigationTabs = (spaceId: string): NavigationTabInterface[] => {
  return [
    {
      path: generatePath(ROUTES.spaceAdmin.base, {spaceId}),
      iconName: 'tiles',
      canGoBack: true,
      replace: true,
      exact: true
    },
    {
      path: generatePath(ROUTES.spaceAdmin.broadcast, {spaceId}),
      iconName: 'airport-signal',
      canGoBack: true,
      replace: true,
      exact: true
    }
  ];
};
