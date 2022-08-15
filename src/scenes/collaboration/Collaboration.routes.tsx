import React from 'react';
import {generatePath, Redirect} from 'react-router-dom';
import {t} from 'i18next';

import {ROUTES} from 'core/constants';
import {NavigationTabInterface, RouteConfigInterface} from 'core/interfaces';

import {
  DashboardPage,
  CalendarPage,
  StageModePage,
  MiroBoardPage,
  ScreenSharePage,
  GoogleDrivePage
} from './pages';

export const COLLABORATION_ROUTES: RouteConfigInterface[] = [
  {
    path: ROUTES.collaboration.dashboard,
    exact: true,
    main: () => <DashboardPage />
  },
  {
    path: ROUTES.collaboration.calendarEvent,
    main: () => <CalendarPage />
  },
  {
    path: ROUTES.collaboration.calendar,
    main: () => <CalendarPage />,
    exact: true
  },
  {
    path: ROUTES.collaboration.stageMode,
    main: () => <StageModePage />
  },
  {
    path: ROUTES.collaboration.miro,
    exact: true,
    main: () => <MiroBoardPage />
  },
  {
    path: ROUTES.collaboration.screenShare,
    main: () => <ScreenSharePage />
  },
  {
    path: ROUTES.collaboration.googleDrive,
    main: () => <GoogleDrivePage />
  },
  {
    path: ROUTES.collaboration.base,
    exact: true,
    main: () => <Redirect to={ROUTES.collaboration.dashboard} />
  }
];

export const buildNavigationTabs = (
  spaceId: string,
  isStageMode: boolean,
  isScreenSharing: boolean
): NavigationTabInterface[] => {
  return [
    {
      path: generatePath(ROUTES.collaboration.dashboard, {spaceId}),
      iconName: 'tiles',
      title: t('labels.dashboard')
    },
    {
      path: generatePath(ROUTES.collaboration.calendar, {spaceId}),
      iconName: 'calendar',
      title: t('labels.calendar')
    },
    {
      path: generatePath(ROUTES.collaboration.stageMode, {spaceId}),
      iconName: 'stage',
      isActive: isStageMode,
      title: t('labels.stageMode')
    },
    {
      path: generatePath(ROUTES.collaboration.screenShare, {spaceId}),
      iconName: 'screenshare',
      isActive: isScreenSharing,
      title: t('labels.screenShare')
    },
    {
      path: generatePath(ROUTES.collaboration.miro, {spaceId}),
      iconName: 'miro',
      title: t('labels.miro')
    },
    {
      path: generatePath(ROUTES.collaboration.googleDrive, {spaceId}),
      iconName: 'drive',
      title: t('labels.googleDrive')
    }
  ];
};
