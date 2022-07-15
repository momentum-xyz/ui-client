import React from 'react';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

// TODO: Refactor each page
import DashboardSpaceLayout from '../component/layout/DashboardSpaceLayout';

import {
  LoginPage,
  LoginCallback,
  LoginEmailPage,
  Web3ChoicePage,
  Web3ChallengePage,
  Web3ConsentPage
} from './auth/pages';
import {HomePage, IntroPage} from './default/pages';
import {SignUpCompletePage} from './profile';
import {StoryBookPage} from './system/pages';
import {Collaboration} from './collaboration';
import {SpaceAdmin} from './spaceAdmin';
import {WorldCalendar} from './worldCalendar';
import {MagicPage} from './magic/pages';

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
    path: ROUTES.storyBook,
    exact: true,
    main: () => <StoryBookPage />
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
    path: ROUTES.intro,
    exact: true,
    main: () => <IntroPage />
  }
];

export const PRIVATE_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.base,
    exact: true,
    main: () => <HomePage />
  },
  {
    path: ROUTES.spaceDashboard,
    exact: true,
    main: () => <DashboardSpaceLayout />,
    renderBackground: true
  },
  {
    path: ROUTES.spaceAdmin.base,
    main: () => <SpaceAdmin />,
    renderBackground: true
  },
  {
    path: ROUTES.collaboration.base,
    main: () => <Collaboration />,
    renderBackground: true
  },
  {
    path: ROUTES.magic,
    main: () => <MagicPage />,
    renderBackground: true
  },
  {
    path: ROUTES.worldCalendar,
    main: () => <WorldCalendar />
  }
];
