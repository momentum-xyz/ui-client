import React, {FC, useEffect, useState} from 'react';

import {PropsWithThemeInterface, TabBarTabInterface} from 'ui-kit/interfaces';
import {IconSvg} from 'ui-kit/atoms';

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
    <styled.TabBar theme={theme}>
      {tabs.map((tab) => (
        <styled.Tab
          disabled={tab.disabled}
          key={tab.label}
          className={currentTab?.id === tab.id ? 'active' : ''}
          onClick={() => handleTabSelect(tab)}
          title={tab.label}
          style={{flexBasis: 100 / tabs.length + '%'}}
        >
          {tab.icon && <IconSvg name={tab.icon} size="medium" isCustom />}{' '}
          <span className="tab-label">{tab.label}</span>
        </styled.Tab>
      ))}
    </styled.TabBar>
  );
};

export default TabBar;
