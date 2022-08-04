import React from 'react';
import {Redirect} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';

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
