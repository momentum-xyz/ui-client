import React, {FC, useEffect, useState} from 'react';
import {PropsWithThemeInterface} from '@momentum/ui-kit';
import {TabBarTabInterface} from 'ui-kit/interfaces';

import * as styled from './TabBar.styled';

interface PropsInterface extends PropsWithThemeInterface {
  tabs: TabBarTabInterface[];
  selectedTab: TabBarTabInterface | undefined;
  onTabSelect: (option: TabBarTabInterface) => void;
}

const TabBar: FC<PropsInterface> = ({tabs = [], selectedTab, onTabSelect, theme}) => {
  const [currentTab, setCurrentTab] = useState<TabBarTabInterface | undefined>(selectedTab);

  useEffect(() => {
    setCurrentTab(selectedTab);
  }, [selectedTab]);

  const handleTabSelect = (tab: TabBarTabInterface) => {
    setCurrentTab(tab);
    onTabSelect(tab);
  };

  return (
    <styled.TabBar theme={theme} data-testid="TabBar-test">
      {tabs.map((tab) => (
        <styled.Tab
          disabled={tab.disabled}
          key={tab.label}
          className={currentTab?.id === tab.id ? 'active' : ''}
          onClick={() => handleTabSelect(tab)}
          title={tab.label}
          style={{flexBasis: 100 / tabs.length + '%'}}
        >
          {tab.icon && <styled.TabBarSvg name={tab.icon} size="medium" />}{' '}
          <styled.TabSpan>{tab.label}</styled.TabSpan>
        </styled.Tab>
      ))}
    </styled.TabBar>
  );
};

export default TabBar;
