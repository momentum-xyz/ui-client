import React, {lazy} from 'react';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

const Widgets = lazy(() => import('./widgets/Widgets'));
const SignInPage = lazy(() => import('./auth/pages/SignInPage/SignInPage'));
const SignInAccountPage = lazy(() => import('./auth/pages/SignInAccountPage/SignInAccountPage'));
const BirthOfMePage = lazy(() => import('./birthOfMe/pages/BirthOfMePage/BirthOfMePage'));
const BirthAnimationPage = lazy(
  () => import('./birthOfMe/pages/BirthAnimationPage/BirthAnimationPage')
);
const ExplorePage = lazy(() => import('./explore/pages/ExplorePage/ExplorePage'));
const Map3dPage = lazy(() => import('./map3d/pages/Map3dPage/Map3dPage'));
const OdysseyPage = lazy(() => import('./odyssey/pages/OdysseyPage/OdysseyPage'));
const Object = lazy(() => import('./object/Object'));
const DisconnectedPage = lazy(() => import('./system/pages/DisconnectedPage/DisconnectedPage'));
const WrongBrowserPage = lazy(() => import('./system/pages/WrongBrowserPage/WrongBrowserPage'));
const MaintenancePage = lazy(() => import('./system/pages/MaintenancePage/MaintenancePage'));
const StoryBook = lazy(() => import('./storyBook/StoryBook'));
const WorldBuilderCustomizePanel = lazy(
  () => import('./worldBuilder/pages/WorldBuilderCustomizePanel/WorldBuilderCustomizePanel')
);

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

export const PUBLIC_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.signIn,
    main: () => (
      <>
        <Map3dPage />
        <SignInPage />
      </>
    )
  },
  {
    path: ROUTES.signInAccount,
    main: () => (
      <>
        <Map3dPage />
        <SignInAccountPage />
      </>
    )
  },
  {
    path: ROUTES.storyBook.base,
    main: () => <StoryBook />
  }
];

export const PRIVATE_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.birth,
    exact: true,
    main: () => (
      <>
        <Map3dPage />
        <BirthOfMePage />
        <Widgets isExplorePage />
      </>
    )
  },
  {
    path: ROUTES.birthAnimation,
    main: () => (
      <>
        <BirthAnimationPage />
      </>
    )
  },
  {
    path: ROUTES.explore,
    main: () => (
      <>
        <Map3dPage isClickActive />
        <ExplorePage />
        <Widgets isExplorePage />
      </>
    )
  }
];

/* !!! EACH ROUTE MUST HAVE WORLD ID IN ORDER TO LOAD UNITY !!! */
export const PRIVATE_ROUTES_WITH_UNITY: RouteConfigInterface[] = [
  {
    path: ROUTES.odyssey.base,
    main: () => <OdysseyPage />,
    exact: true
  },
  {
    path: ROUTES.odyssey.builder.base,
    main: () => <WorldBuilderCustomizePanel />,
    renderBackground: false
  },
  {
    path: ROUTES.odyssey.object.root,
    renderBackground: false,
    main: () => <Object />
  }
];
