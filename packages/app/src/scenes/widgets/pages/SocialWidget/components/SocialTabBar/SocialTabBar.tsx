import React, {FC} from 'react';
import cn from 'classnames';

import * as styled from './SocialTabBar.styled';

export interface SocialPanelTabInterface {
  name: string;
  main: React.FC;
}

interface PropsInterface {
  selectedTabIndex: number;
  tabs: SocialPanelTabInterface[];
  onSelect: (tabIndex: number) => void;
}

const SocialTabBar: FC<PropsInterface> = ({selectedTabIndex, tabs, onSelect}) => {
  return (
    <styled.Container>
      <styled.TabsContainer>
        {tabs.map((tab, index) => (
          <styled.Tab
            key={tab.name}
            selectedTabIndex={selectedTabIndex}
            numberOfTabs={tabs.length}
            onClick={() => onSelect(index)}
          />
        ))}
      </styled.TabsContainer>
      <styled.TabSelectorContainer>
        <styled.TabSelector selectedTabIndex={selectedTabIndex} numberOfTabs={tabs.length} />
      </styled.TabSelectorContainer>
      <styled.TabsLabelsContainer>
        {tabs.map((tab, index) => (
          <styled.TabLabelContainer key={index}>
            <styled.TabHeading
              label={tab.name}
              transform="uppercase"
              type="h3"
              className={cn(index === selectedTabIndex && 'selected')}
            />
          </styled.TabLabelContainer>
        ))}
      </styled.TabsLabelsContainer>
    </styled.Container>
  );
};

export default SocialTabBar;
