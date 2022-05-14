import React from 'react';
import {Redirect} from 'react-router-dom';

// TODO: Refactor
import {RouteConfigInterface} from 'core/interfaces';
import DashboardSpaceLayout from 'component/layout/DashboardSpaceLayout';
import StageModeRouter from 'component/layout/StageMode/StageModeRouter';
import WhiteBoardLayout from 'component/layout/Collaboration/WhiteBoardLayout';
import ScreenShareLayout from 'component/layout/Collaboration/ScreenShareLayout';
import GoogleDriveLayout from 'component/layout/Collaboration/GoogleDriveLayout';

import {CalendarPage} from './pages';

export const PRIVATE_ROUTES = (path: string, spaceId: string) => {
  const routes: RouteConfigInterface[] = [
    {
      path: `${path}/`,
      exact: true,
      main: () => <Redirect to={`${path}/dashboard`} />
    },
    {
      path: `${path}/dashboard`,
      exact: true,
      main: () => <DashboardSpaceLayout id={spaceId} />
    },
    {
      path: `${path}/calendar/:eventId`,
      main: () => <CalendarPage />
    },
    {
      path: `${path}/calendar`,
      main: () => <CalendarPage />,
      exact: true
    },
    {
      path: `${path}/stage-mode`,
      main: () => <StageModeRouter />
    },
    {
      path: `${path}/miro`,
      exact: true,
      main: () => <WhiteBoardLayout />
    },
    {
      path: `${path}/screenshare`,
      main: () => <ScreenShareLayout />
    },
    {
      path: `${path}/google-drive`,
      main: () => <GoogleDriveLayout />
    }
  ];

  return routes;
};
