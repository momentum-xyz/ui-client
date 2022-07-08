import React, {FC} from 'react';

import {NavigationBar, NavigationBarItem} from 'ui-kit';
import {ROUTES} from 'core/constants';
import {useAgoraScreenShare} from 'hooks/communication/useAgoraScreenShare';
import useCollaboration from 'context/Collaboration/hooks/useCollaboration';

import * as styled from './SubNav.styled';

interface TabInterface {
  path: string;
  iconName: IconName;
}

const SubNav: FC = () => {
  const tabs: TabInterface[] = [
    {
      path: ROUTES.collaboration.dashboard,
      iconName: 'tiles'
    },
    {
      path: ROUTES.collaboration.calendar,
      iconName: 'calendar'
    },
    {
      path: ROUTES.collaboration.stageMode,
      iconName: 'stage'
    },
    {
      path: ROUTES.collaboration.screenShare,
      iconName: 'screenshare'
    },
    {
      path: ROUTES.collaboration.miro,
      iconName: 'miro'
    },
    {
      path: ROUTES.collaboration.googleDrive,
      iconName: 'drive'
    }
  ];

  const {screenShare} = useAgoraScreenShare();
  const {
    collaborationState: {stageMode}
  } = useCollaboration();

  return (
    <styled.Container>
      <NavigationBar>
        {tabs.map((tab) => (
          <NavigationBarItem
            key={tab.path}
            iconName={tab.iconName}
            path={tab.path}
            isActive={
              (tab.path === ROUTES.collaboration.screenShare && !!screenShare) ||
              (tab.path === ROUTES.collaboration.stageMode && stageMode)
            }
          />
        ))}
      </NavigationBar>
    </styled.Container>
  );
};

export default SubNav;
