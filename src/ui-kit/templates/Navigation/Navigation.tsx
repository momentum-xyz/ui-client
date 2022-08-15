import React, {FC} from 'react';

import {NavigationTabInterface} from 'core/interfaces';
import {NavigationBar, NavigationBarItem, Tooltip} from 'ui-kit';

import * as styled from './Navigation.styled';

interface PropsInterface {
  tabs: NavigationTabInterface[];
}

const Navigation: FC<PropsInterface> = ({tabs}) => {
  return (
    <styled.Container data-testid="Navigation-test">
      <NavigationBar>
        {tabs.map((tab) => (
          <Tooltip key={tab.path} placement="right" label={tab.title}>
            <NavigationBarItem
              exact={tab.exact}
              iconName={tab.iconName}
              path={tab.path}
              isActive={tab.isActive}
              replace={tab.replace}
              state={{canGoBack: tab.canGoBack}}
            />
          </Tooltip>
        ))}
      </NavigationBar>
    </styled.Container>
  );
};

export default Navigation;
