import React, {FC} from 'react';

import {NavigationTabInterface} from 'core/interfaces';
import {NavigationBar, NavigationBarItem} from 'ui-kit';

import * as styled from './Navigation.styled';

interface PropsInterface {
  tabs: NavigationTabInterface[];
}

const Navigation: FC<PropsInterface> = ({tabs}) => {
  return (
    <styled.Container>
      <NavigationBar>
        {tabs.map((tab) => (
          <NavigationBarItem
            key={tab.path}
            exact={tab.exact}
            iconName={tab.iconName}
            path={tab.path}
            isActive={tab.isActive}
            replace={tab.replace}
            state={{canGoBack: tab.canGoBack}}
          />
        ))}
      </NavigationBar>
    </styled.Container>
  );
};

export default Navigation;
