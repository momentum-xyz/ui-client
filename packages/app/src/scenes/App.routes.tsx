import {lazy} from 'react';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

const ExplorePage = lazy(() => import('./explore/pages/ExplorePage/ExplorePage'));
const WorldBasePage = lazy(() => import('./world/pages/WorldBasePage/WorldBasePage'));
const Object = lazy(() => import('./object/Object'));
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
    main: () => <ExplorePage />
  }
];

/* !!! EACH ROUTE MUST HAVE WORLD ID IN ORDER TO LOAD UNITY !!! */
export const WORLD_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.odyssey.base,
    main: () => <WorldBasePage />,
    exact: true
  },
  // {
  //   path: ROUTES.odyssey.creator.base,
  //   main: () => <OdysseyCreator />
  // },
  {
    path: ROUTES.odyssey.object.root,
    main: () => <Object />
  }
];
