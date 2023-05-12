import {lazy} from 'react';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

const Universe2dPage = lazy(() => import('./universe/pages/Universe2dPage/Universe2dPage'));
const World2dPage = lazy(() => import('./world/pages/World2dPage/World2dPage'));
const DisconnectedPage = lazy(() => import('./system/pages/DisconnectedPage/DisconnectedPage'));
const WrongBrowserPage = lazy(() => import('./system/pages/WrongBrowserPage/WrongBrowserPage'));
const MaintenancePage = lazy(() => import('./system/pages/MaintenancePage/MaintenancePage'));

export const SYSTEM_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.system.disconnected,
    exact: true,
    main: () => <DisconnectedPage />
  },
  {
    path: ROUTES.system.maintenance,
    exact: true,
    main: () => <MaintenancePage />
  },
  {
    path: ROUTES.system.wrongBrowser,
    exact: true,
    main: () => <WrongBrowserPage />
  }
];

export const UNIVERSE_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.explore,
    main: () => <Universe2dPage />
  }
];

/* !!! EACH ROUTE MUST HAVE WORLD ID IN ORDER TO LOAD UNITY !!! */
export const WORLD_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.odyssey.base,
    main: () => <World2dPage />,
    exact: true
  }
];
