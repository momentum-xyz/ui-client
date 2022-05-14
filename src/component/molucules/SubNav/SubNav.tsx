import React from 'react';

import {NavigationBar, NavigationBarItem} from 'ui-kit';
import {ROUTES} from 'core/constants';

import * as styled from './SubNav.styled';

interface TabInterface {
  path: string;
  iconName: IconName;
}

const SubNav = () => {
  const tabs: TabInterface[] = [
    {
      path: ROUTES.dashboard,
      iconName: 'tiles'
    },
    {
      path: ROUTES.calendar,
      iconName: 'calendar'
    },
    {
      path: ROUTES.stageMode,
      iconName: 'stage'
    },
    {
      path: ROUTES.screenShare,
      iconName: 'screenshare'
    },
    {
      path: ROUTES.miro,
      iconName: 'miro'
    },
    {
      path: ROUTES.googleDrive,
      iconName: 'drive'
    }
  ];

  return (
    <styled.Container>
      <NavigationBar>
        {tabs.map((tab) => (
          <NavigationBarItem key={tab.path} iconName={tab.iconName} path={tab.path} />
        ))}
      </NavigationBar>
    </styled.Container>
  );
};

export default SubNav;
