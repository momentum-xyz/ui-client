import React, {lazy} from 'react';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

const Widgets = lazy(() => import('./widgets/Widgets'));
const WidgetManager = lazy(() => import('./widgetManager/WidgetManager'));
const SignInPage = lazy(() => import('./auth/pages/SignInPage/SignInPage'));
const SignInAccountPage = lazy(() => import('./auth/pages/SignInAccountPage/SignInAccountPage'));
const BirthOfMePage = lazy(() => import('./auth/pages/BirthOfMePage/BirthOfMePage'));
const BirthAnimationPage = lazy(() => import('./auth/pages/BirthAnimationPage/BirthAnimationPage'));
const MagicPage = lazy(() => import('./magic/pages/MagicPage/MagicPage'));
//const ExplorePage = lazy(() => import('./explore/pages/ExplorePage/ExplorePage'));
//const Map3dPage = lazy(() => import('./map3d/pages/Map3dPage/Map3dPage'));
const OdysseyHomePage = lazy(() => import('./odysseyHome/pages/OdysseyHomePage/OdysseyHomePage'));
const Object = lazy(() => import('./object/Object'));
const DisconnectedPage = lazy(() => import('./system/pages/DisconnectedPage/DisconnectedPage'));
const WrongBrowserPage = lazy(() => import('./system/pages/WrongBrowserPage/WrongBrowserPage'));
const MaintenancePage = lazy(() => import('./system/pages/MaintenancePage/MaintenancePage'));
const OdysseyCreator = lazy(() => import('./odysseyCreator/OdysseyCreator'));

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

export const PRIVATE_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.signIn,
    main: () => (
      <>
        <SignInPage />
        <WidgetManager />
      </>
    )
  },
  {
    path: ROUTES.signInAccount,
    main: () => <SignInAccountPage />
  },
  {
    path: ROUTES.birth,
    exact: true,
    main: () => <BirthOfMePage />
  },
  {
    path: ROUTES.birthAnimation,
    main: () => (
      <>
        <BirthAnimationPage />
        <Widgets isExplorePage />
      </>
    )
  },
  {
    path: ROUTES.explore,
    main: () => <WidgetManager />
  },
  {
    path: ROUTES.magic,
    main: () => <MagicPage />
  }
];

/* !!! EACH ROUTE MUST HAVE WORLD ID IN ORDER TO LOAD UNITY !!! */
export const PRIVATE_ROUTES_WITH_UNITY: RouteConfigInterface[] = [
  {
    path: ROUTES.odyssey.base,
    main: () => <OdysseyHomePage />,
    exact: true
  },
  {
    path: ROUTES.odyssey.creator.base,
    main: () => <OdysseyCreator />
  },
  {
    path: ROUTES.odyssey.object.root,
    main: () => <Object />
  }
];
