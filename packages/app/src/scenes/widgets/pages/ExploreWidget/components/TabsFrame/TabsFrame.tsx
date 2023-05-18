import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {TabInterface, Tabs, Input, stringInputMask, Frame} from '@momentum-xyz/ui-kit';

import {SearchQueryModelModelType} from 'core/models';

import {ExploreTabType} from '../../ExploreWidget';

import * as styled from './TabsFrame.styled';

interface PropsInterface {
  tabs: TabInterface<ExploreTabType>[];
  activeTab: ExploreTabType;
  searchQuery: SearchQueryModelModelType;
  setActiveTab: (tab: ExploreTabType) => void;
}

const TabsFrame: FC<PropsInterface> = (props) => {
  const {tabs, activeTab, setActiveTab, searchQuery} = props;
  const {t} = useI18n();

  return (
    <styled.Container data-testid="TabsFrame-test">
      <styled.Tabs>
        <Tabs tabList={tabs} activeId={activeTab} onSelect={setActiveTab} />
      </styled.Tabs>

      <Frame>
        <styled.Search>
          <Input
            wide
            isSearch
            isClearable
            opts={stringInputMask}
            value={searchQuery.query}
            placeholder={
              activeTab === 'worlds' ? t('actions.searchOdysseys') : t('actions.searchMembers')
            }
            onChange={searchQuery.setQuery}
          />
        </styled.Search>
      </Frame>
    </styled.Container>
  );
};

export default observer(TabsFrame);
