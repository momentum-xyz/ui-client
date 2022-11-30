import React, {lazy} from 'react';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

const Map3dPage = lazy(() => import('./map3d/pages/UniverseMapPage/Map3dPage'));
const Object = lazy(() => import('./object/Object'));
const SignInPage = lazy(() => import('./birthOfMe/pages/SignInPage/SignInPage'));
const StartAccountPage = lazy(() => import('./birthOfMe/pages/StartAccountPage/StartAccountPage'));
const BirthOfMePage = lazy(() => import('./birthOfMe/pages/BirthOfMePage/BirthOfMePage'));
const ExplorePage = lazy(() => import('./birthOfMe/pages/ExplorePage/ExplorePage'));
const LoginPage = lazy(() => import('./auth/pages/LoginPage/LoginPage'));
const WorldBuilderLoginPage = lazy(
  () => import('./auth/pages/WorldBuilderLoginPage/WorldBuilderLoginPage')
);
const LoginCallback = lazy(() => import('./auth/pages/LoginCallback/LoginCallback'));
const LoginEmailPage = lazy(() => import('./auth/pages/LoginEmailPage/LoginEmailPage'));
const Web3ChoicePage = lazy(() => import('./auth/pages/Web3ChoicePage/Web3ChoicePage'));
const Web3ChallengePage = lazy(() => import('./auth/pages/Web3ChallengePage/Web3ChallengePage'));
const Web3ConsentPage = lazy(() => import('./auth/pages/Web3ConsentPage/Web3ConsentPage'));
const HomePage = lazy(() => import('./home/pages/HomePage/HomePage'));
const SignUpPage = lazy(() => import('./profile/pages/SignUpCompletePage/SignUpCompletePage'));
const WelcomePage = lazy(() => import('./welcome/pages/WelcomePage/WelcomePage'));
// const Collaboration = lazy(() => import('./collaboration/Collaboration'));
const GrabTablePage = lazy(() => import('./grabTable/pages/GrabTablePage/GrabTablePage'));
const SpaceAdmin = lazy(() => import('./spaceAdmin/SpaceAdmin'));
const WorldBuilderCustomizePanel = lazy(
  () => import('./worldBuilder/pages/WorldBuilderCustomizePanel/WorldBuilderCustomizePanel')
);
const FlyWithMePage = lazy(() => import('./flight/pages/FlyWithMePage/FlyWithMePage'));
const CalendarPage = lazy(() => import('./calendar/pages/CalendarPage/CalendarPage'));
const MagicPage = lazy(() => import('./magic/pages/MagicPage/MagicPage'));
const VideoPage = lazy(() => import('./video/pages/VideoPage/VideoPage'));
const DisconnectedPage = lazy(() => import('./system/pages/DisconnectedPage/DisconnectedPage'));
const WrongBrowserPage = lazy(() => import('./system/pages/WrongBrowserPage/WrongBrowserPage'));
const MaintenancePage = lazy(() => import('./system/pages/MaintenancePage/MaintenancePage'));
const StoryBook = lazy(() => import('./storyBook/StoryBook'));
const WorldBuilder = lazy(() => import('./worldBuilder/WorldBuilder'));
const WorldBuilderStartPage = lazy(
  () => import('./worldBuilder/pages/WorldBuilderStartPage/WorldBuilderStartPage')
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
    path: ROUTES.birthOfMe.signIn,
    main: () => (
      <>
        <Map3dPage />
        <SignInPage />
      </>
    )
  },
  {
    path: ROUTES.birthOfMe.startAccount,
    main: () => (
      <>
        <Map3dPage />
        <StartAccountPage />
      </>
    )
  },
  {
    path: ROUTES.birthOfMe.birth,
    main: () => (
      <>
        <Map3dPage />
        <BirthOfMePage />
      </>
    )
  },
  {
    path: ROUTES.birthOfMe.explore,
    main: () => (
      <>
        <Map3dPage />
        <ExplorePage />
      </>
    )
  },
  {
    path: ROUTES.login,
    exact: true,
    main: () => <LoginPage />
  },
  {
    path: ROUTES.worldBuilderLogin,
    exact: true,
    main: () => <WorldBuilderLoginPage />
  },
  {
    path: ROUTES.loginEmail,
    exact: true,
    main: () => <LoginEmailPage />
  },
  {
    path: ROUTES.web3,
    exact: true,
    main: () => <Web3ChoicePage />
  },
  {
    path: ROUTES.loginWeb3,
    exact: true,
    main: () => <Web3ChallengePage />
  },
  {
    path: ROUTES.consentWeb3,
    exact: true,
    main: () => <Web3ConsentPage />
  },
  {
    path: ROUTES.storyBook.base,
    main: () => <StoryBook />
  },
  {
    path: ROUTES.worldBuilder.login,
    main: () => <WorldBuilderStartPage />
  }
];

export const CORE_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.signUpComplete,
    exact: true,
    main: () => <SignUpPage />
  },
  {
    path: ROUTES.web3CallBack,
    exact: true,
    main: () => <LoginCallback />
  },
  {
    path: ROUTES.callBack,
    exact: true,
    main: () => <LoginCallback />
  },
  {
    path: ROUTES.guestCallBack,
    exact: true,
    main: () => <LoginCallback />
  },
  {
    path: ROUTES.welcome,
    exact: true,
    main: () => <WelcomePage />
  }
];

export const PRIVATE_ROUTES_WITH_UNITY: RouteConfigInterface[] = [
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
  // {
  //   path: ROUTES.collaboration.base,
  //   renderBackground: true,
  //   main: () => <Collaboration />
  // },
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
    path: ROUTES.calendar,
    main: () => <CalendarPage />,
    renderBackground: true
  }
];

export const PRIVATE_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.worldBuilder.base,
    main: () => <WorldBuilder />
  }
];
