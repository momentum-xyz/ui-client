import React from 'react';

import {RouteConfigInterface} from 'core/interfaces';
import {ROUTES} from 'core/constants';
// TODO: Refactor each page

import {SubNav, SubNavAdmin} from '../component/molucules';
import DashboardSpaceLayout from '../component/layout/DashboardSpaceLayout';

import {
  LoginPage,
  LoginCallback,
  LoginEmailPage,
  Web3ChoicePage,
  Web3ChallengePage,
  Web3ConsentPage
} from './auth/pages';
import {HomePage, IntoPage} from './default/pages';
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
    sidebar: () => null,
    main: () => <LoginPage />
  },
  {
    path: ROUTES.loginEmail,
    exact: true,
    sidebar: () => null,
    main: () => <LoginEmailPage />
  },
  {
    path: ROUTES.web3,
    exact: true,
    sidebar: () => null,
    main: () => <Web3ChoicePage />
  },
  {
    path: ROUTES.loginWeb3,
    exact: true,
    sidebar: () => null,
    main: () => <Web3ChallengePage />
  },
  {
    path: ROUTES.consentWeb3,
    exact: true,
    sidebar: () => null,
    main: () => <Web3ConsentPage />
  },
  {
    path: ROUTES.storyBook,
    exact: true,
    sidebar: () => null,
    main: () => <StoryBookPage />
  }
];

export const CORE_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.signUpComplete,
    exact: true,
    sidebar: () => null,
    main: () => <SignUpCompletePage />
  },
  {
    path: ROUTES.web3CallBack,
    exact: true,
    sidebar: () => null,
    main: () => <LoginCallback />
  },
  {
    path: ROUTES.callBack,
    exact: true,
    sidebar: () => null,
    main: () => <LoginCallback />
  },
  {
    path: ROUTES.guestCallBack,
    exact: true,
    sidebar: () => null,
    main: () => <LoginCallback />
  },
  {
    path: ROUTES.intro,
    exact: true,
    sidebar: () => null,
    main: () => <IntoPage />
  }
];

export const PRIVATE_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.base,
    exact: true,
    sidebar: () => null,
    main: () => <HomePage />
  },
  {
    path: ROUTES.spaceDashboard,
    exact: true,
    sidebar: () => null,
    main: () => <DashboardSpaceLayout />,
    renderBackground: true
  },
  {
    path: ROUTES.spaceAdmin,
    sidebar: () => <SubNavAdmin />,
    main: () => <SpaceAdmin />,
    renderBackground: true
  },
  {
    path: ROUTES.collaboration,
    sidebar: () => <SubNav />,
    main: () => <Collaboration />,
    renderBackground: true
  },
  {
    path: ROUTES.magic,
    sidebar: () => null,
    main: () => <MagicPage />,
    renderBackground: true
  },
  {
    path: ROUTES.worldCalendar,
    sidebar: () => null,
    main: () => <WorldCalendar />
  }
];
