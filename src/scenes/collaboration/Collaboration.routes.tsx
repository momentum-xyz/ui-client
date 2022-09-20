import React, {lazy} from 'react';
import {generatePath, Redirect} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {NavigationTabInterface, RouteConfigInterface} from 'core/interfaces';
import {ThemeInterface} from 'ui-kit';

import {
  DashboardPage,
  CalendarPage,
  StageModePage,
  ScreenSharePage,
  GoogleDrivePage,
  LiveStreamPage
} from './pages';

const MiroPlugin = lazy(() => import('miro/App'));

export const COLLABORATION_ROUTES = (theme: ThemeInterface) =>
  [
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
      main: () => <MiroPlugin theme={theme} />
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
      path: ROUTES.collaboration.liveStream,
      main: () => <LiveStreamPage />
    },
    {
      path: ROUTES.collaboration.base,
      exact: true,
      main: () => <Redirect to={ROUTES.collaboration.dashboard} />
    }
  ] as RouteConfigInterface[];

export const buildNavigationTabs = (
  spaceId: string,
  isStageMode: boolean,
  isScreenSharing: boolean,
  isLiveStreaming?: boolean
): NavigationTabInterface[] => {
  return [
    {
      path: generatePath(ROUTES.collaboration.dashboard, {spaceId}),
      iconName: 'tiles'
    },
    {
      path: generatePath(ROUTES.collaboration.calendar, {spaceId}),
      iconName: 'calendar'
    },
    {
      path: generatePath(ROUTES.collaboration.stageMode, {spaceId}),
      iconName: 'stage',
      isActive: isStageMode
    },
    {
      path: generatePath(ROUTES.collaboration.screenShare, {spaceId}),
      iconName: 'screenshare',
      isActive: isScreenSharing
    },
    {
      path: generatePath(ROUTES.collaboration.miro, {spaceId}),
      iconName: 'miro'
    },
    {
      path: generatePath(ROUTES.collaboration.googleDrive, {spaceId}),
      iconName: 'drive'
    },
    {
      path: generatePath(ROUTES.collaboration.liveStream, {spaceId}),
      iconName: 'live',
      isHidden: !isLiveStreaming,
      isActive: isLiveStreaming
    }
  ];
};
