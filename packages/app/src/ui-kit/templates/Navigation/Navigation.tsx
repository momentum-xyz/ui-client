import React, {FC} from 'react';
import {PropsWithThemeInterface} from '@momentum/ui-kit';
import {NavigationTabInterface} from 'ui-kit/interfaces';
import {NavigationBar, NavigationBarItem} from 'ui-kit';

import * as styled from './Navigation.styled';

interface PropsInterface extends PropsWithThemeInterface {
  tabs: NavigationTabInterface[];
}

const Navigation: FC<PropsInterface> = ({tabs}) => {
  return (
    <styled.Container data-testid="Navigation-test">
      <NavigationBar>
        {tabs.map((tab) => (
          <NavigationBarItem
            key={tab.path}
            exact={tab.exact}
            iconName={tab.iconName}
            path={tab.path}
            isActive={tab.isActive}
            isHidden={tab.isHidden}
            replace={tab.replace}
            state={{canGoBack: tab.canGoBack}}
          />
        ))}
      </NavigationBar>
    </styled.Container>
  );
};

export default Navigation;
