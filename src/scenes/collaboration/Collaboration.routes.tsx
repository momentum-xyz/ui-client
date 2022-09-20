import React from 'react';
import {generatePath, Redirect} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {NavigationTabInterface, RouteConfigInterface} from 'core/interfaces';
import {ThemeInterface} from 'ui-kit';
import ModuleLoader from 'core/utils/dynamicModule.utils';

import {
  DashboardPage,
  CalendarPage,
  StageModePage,
  ScreenSharePage,
  GoogleDrivePage,
  LiveStreamPage
} from './pages';

interface PluginInterface extends Omit<RouteConfigInterface, 'main'> {
  name: string;
  module: string;
  url: string;
}

// This list later could be passed as parameters from API
const PLUGINS: PluginInterface[] = [
  {
    name: 'miro',
    module: './App',
    url: 'http://localhost:3001/remoteEntry.js',
    path: ROUTES.collaboration.miro,
    exact: true
  }
];

export const COLLABORATION_ROUTES = (theme: ThemeInterface) => {
  const baseRoutes: RouteConfigInterface[] = [
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
  ];

  PLUGINS.forEach((plugin) => {
    baseRoutes.push({
      ...plugin,
      main: () => <ModuleLoader url={plugin.url} module={plugin.module} scope={plugin.name} />
    });
  });

  return baseRoutes;
};

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
