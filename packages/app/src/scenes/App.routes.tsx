import React, {lazy} from 'react';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

const Widgets = lazy(() => import('./widgets/Widgets'));
const SignInPage = lazy(() => import('./auth/pages/SignInPage/SignInPage'));
const SignInAccountPage = lazy(() => import('./auth/pages/SignInAccountPage/SignInAccountPage'));
const BirthOfMePage = lazy(() => import('./birthOfMe/pages/BirthOfMePage/BirthOfMePage'));
const ExplorePage = lazy(() => import('./explore/pages/ExplorePage/ExplorePage'));
const Map3dPage = lazy(() => import('./map3d/pages/Map3dPage/Map3dPage'));
const Object = lazy(() => import('./object/Object'));
const HomePage = lazy(() => import('./home/pages/HomePage/HomePage'));
const GrabTablePage = lazy(() => import('./grabTable/pages/GrabTablePage/GrabTablePage'));
const SpaceAdmin = lazy(() => import('./spaceAdmin/SpaceAdmin'));
const FlyWithMePage = lazy(() => import('./flight/pages/FlyWithMePage/FlyWithMePage'));
const MagicPage = lazy(() => import('./magic/pages/MagicPage/MagicPage'));
const VideoPage = lazy(() => import('./video/pages/VideoPage/VideoPage'));
const DisconnectedPage = lazy(() => import('./system/pages/DisconnectedPage/DisconnectedPage'));
const WrongBrowserPage = lazy(() => import('./system/pages/WrongBrowserPage/WrongBrowserPage'));
const MaintenancePage = lazy(() => import('./system/pages/MaintenancePage/MaintenancePage'));
const StoryBook = lazy(() => import('./storyBook/StoryBook'));
const WorldBuilderCustomizePanel = lazy(
  () => import('./worldBuilder/pages/WorldBuilderCustomizePanel/WorldBuilderCustomizePanel')
);
const SpawnAsset = lazy(() => import('./worldBuilder/components/SpawnAsset/SpawnAsset'));

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
    main: () => (
      <>
        <Map3dPage />
        <BirthOfMePage />
        <Widgets isExplorePage />
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

export const PRIVATE_ROUTES_WITH_UNITY: RouteConfigInterface[] = [
  {
    path: ROUTES.base,
    exact: true,
    main: () => <HomePage />
  },
  {
    path: ROUTES.spaceAdmin.base,
    main: () => <SpaceAdmin />,
    renderBackground: true
  },
  {
    path: ROUTES.worldBuilder.builder,
    main: () => (
      <>
        <WorldBuilderCustomizePanel />
        <HomePage />
      </>
    ),
    renderBackground: false
  },
  {
    path: ROUTES.object.root,
    renderBackground: false,
    main: () => <Object />
  },
  {
    path: ROUTES.grabTable,
    main: () => (
      <>
        <GrabTablePage />
        <HomePage />
      </>
    )
  },
  {
    path: ROUTES.flyWithMe.pilot,
    main: () => (
      <>
        <FlyWithMePage />
        <HomePage />
      </>
    ),
    exact: true
  },
  {
    path: ROUTES.flyWithMe.passenger,
    main: () => <FlyWithMePage />,
    exact: true
  },
  {
    path: ROUTES.magic,
    main: () => <MagicPage />
  },
  {
    path: ROUTES.video,
    main: () => <VideoPage />
  },
  {
    path: ROUTES.spawnAsset.base,
    renderBackground: false,
    main: () => <SpawnAsset />
  }
];
