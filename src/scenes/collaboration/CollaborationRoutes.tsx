import React from 'react';
import {Redirect} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {RouteConfigInterface} from 'core/interfaces';
// TODO: Refactor
import ScreenShareLayout from 'component/layout/Collaboration/ScreenShareLayout';
import GoogleDriveLayout from 'component/layout/Collaboration/GoogleDriveLayout';

import {DashboardPage, CalendarPage, StageModePage, MiroBoardPage} from './pages';

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
    main: () => <ScreenShareLayout />
  },
  {
    path: ROUTES.collaboration.googleDrive,
    main: () => <GoogleDriveLayout />
  },
  {
    path: ROUTES.collaboration.base,
    exact: true,
    main: () => <Redirect to={ROUTES.collaboration.dashboard} />
  }
];
