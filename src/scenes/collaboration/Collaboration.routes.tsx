import React from 'react';
import {generatePath, Redirect} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {NavigationTabInterface, RouteConfigInterface} from 'core/interfaces';
import PluginLoader from 'core/utils/dynamicModule.utils';
import {PluginInterface} from 'core/interfaces/plugin.interface';

import {
  DashboardPage,
  CalendarPage,
  StageModePage,
  ScreenSharePage,
  GoogleDrivePage,
  LiveStreamPage,
  CollaborationPluginPage
} from './pages';

export const COLLABORATION_ROUTES = (plugins: PluginInterface[]) => {
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

  plugins.forEach((plugin) => {
    baseRoutes.push({
      ...plugin,
      main: () => (
        <CollaborationPluginPage>
          <PluginLoader url={plugin.url} name={plugin.name} config={{...plugin.config}} />
        </CollaborationPluginPage>
      )
    });
  });

  return baseRoutes;
};

export const buildNavigationTabs = (
  spaceId: string,
  isStageMode: boolean,
  isScreenSharing: boolean,
  plugins: PluginInterface[],
  isLiveStreaming?: boolean
): NavigationTabInterface[] => {
  const pluginTabs: NavigationTabInterface[] = plugins.map((plugin) => ({
    path: generatePath(plugin.path, {spaceId}),
    iconName: plugin.iconName
  }));

  const tabs: NavigationTabInterface[] = [
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

  tabs.push(...pluginTabs);

  return tabs;
};
