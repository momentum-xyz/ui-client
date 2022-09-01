import React from 'react';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

import {
  LoginPage,
  LoginCallback,
  LoginEmailPage,
  Web3ChoicePage,
  Web3ChallengePage,
  Web3ConsentPage
} from './auth/pages';
import {HomePage} from './home';
import {WelcomePage} from './welcome';
import {SignUpCompletePage} from './profile';
import {Collaboration} from './collaboration';
import {SpaceAdmin} from './spaceAdmin';
import {WorldCalendar} from './worldCalendar';
import {MagicPage} from './magic/pages';
import {VideoPage} from './video/pages';
import {GrabTablePage} from './grabTable';
import {StoryBook} from './storyBook';
import {DisconnectedPage, MaintenancePage, WrongBrowserPage} from './system';
import {WorldBuilder} from './worldBuilder';
import {WorldBuilderStartPage} from './worldBuilder/pages';

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
    main: () => <SignUpCompletePage />
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
