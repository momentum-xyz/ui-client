import React, {lazy} from 'react';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

const LoginPage = lazy(() => import('./auth/pages/LoginPage/LoginPage'));
const LoginCallback = lazy(() => import('./auth/pages/LoginCallback/LoginCallback'));
const LoginEmailPage = lazy(() => import('./auth/pages/LoginEmailPage/LoginEmailPage'));
const Web3ChoicePage = lazy(() => import('./auth/pages/Web3ChoicePage/Web3ChoicePage'));
const Web3ChallengePage = lazy(() => import('./auth/pages/Web3ChallengePage/Web3ChallengePage'));
const Web3ConsentPage = lazy(() => import('./auth/pages/Web3ConsentPage/Web3ConsentPage'));
const HomePage = lazy(() => import('./home/pages/HomePage/HomePage'));
const SignUpPage = lazy(() => import('./profile/pages/SignUpCompletePage/SignUpCompletePage'));
const WelcomePage = lazy(() => import('./welcome/pages/WelcomePage/WelcomePage'));
const Collaboration = lazy(() => import('./collaboration/Collaboration'));
const GrabTablePage = lazy(() => import('./grabTable/pages/GrabTablePage/GrabTablePage'));
const SpaceAdmin = lazy(() => import('./spaceAdmin/SpaceAdmin'));
const WorldCalendar = lazy(() => import('./worldCalendar/WorldCalendar'));
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

export const PUBLIC_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.login,
    exact: true,
    main: () => <LoginPage />
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
  },
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
    path: ROUTES.collaboration.base,
    renderBackground: true,
    main: () => <Collaboration />
  },
  {
    path: ROUTES.grabTable,
    main: () => (
      <>
        <HomePage />
        <GrabTablePage />
      </>
    )
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
    path: ROUTES.worldCalendar,
    main: () => <WorldCalendar />,
    renderBackground: true
  },
  {
    path: ROUTES.base,
    main: () => <WorldBuilder />
  }
];

export const PRIVATE_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.worldBuilder.base,
    main: () => <WorldBuilder />
  }
];
