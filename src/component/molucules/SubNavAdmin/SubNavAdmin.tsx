import React from 'react';
import {useParams} from 'react-router-dom';

import {NavigationBar, NavigationBarItem} from 'ui-kit';

import * as styled from './SubNavAdmin.styled';

interface TabInterface {
  path: string;
  iconName: IconName;
}

const SubNavAdmin = () => {
  const {spaceId} = useParams<{spaceId: string}>();

  const tabs: TabInterface[] = [
    {
      path: '/space/' + spaceId + '/admin',
      iconName: 'tiles'
    },
    {
      path: '/space/' + spaceId + '/admin/broadcast',
      iconName: 'airport-signal'
    }
  ];

  return (
    <styled.Container>
      <NavigationBar>
        {tabs.map((tab) => (
          <NavigationBarItem exact key={tab.path} iconName={tab.iconName} path={tab.path} />
        ))}
      </NavigationBar>
    </styled.Container>
  );
};

export default SubNavAdmin;
