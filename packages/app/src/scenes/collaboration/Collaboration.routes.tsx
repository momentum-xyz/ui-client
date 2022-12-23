import React from 'react';
import {generatePath} from 'react-router-dom';
import {NavigationTabInterface} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';

import {StageModePage, LiveStreamPage} from './pages';

export const COLLABORATION_ROUTES = [
  {
    path: ROUTES.collaboration.stageMode,
    main: () => <StageModePage />
  },
  {
    path: ROUTES.collaboration.liveStream,
    main: () => <LiveStreamPage />
  }
];

export const buildNavigationTabs = (
  spaceId: string,
  isStageMode: boolean,
  isScreenSharing: boolean,
  isLiveStreaming?: boolean
): NavigationTabInterface[] => {
  const tabs: NavigationTabInterface[] = [
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
      path: generatePath(ROUTES.collaboration.liveStream, {spaceId}),
      iconName: 'live',
      isHidden: !isLiveStreaming,
      isActive: isLiveStreaming
    }
  ];

  return tabs;
};
