import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, i18n} from '@momentum-xyz/core';
import {TabInterface, Tabs, Panel} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {NewsfeedTypeEnum, WidgetEnum} from 'core/enums';
import {NewsfeedEntryModelInterface} from 'core/models';

import * as styled from './NewsfeedWidget.styled';

type NewsfeedTabTypes = 'universal' | 'my_connections';

const TABS_LIST: TabInterface<NewsfeedTabTypes>[] = [
  {id: 'universal', icon: 'clock', label: i18n.t('labels.universal')},
  {id: 'my_connections', icon: 'connect', label: i18n.t('labels.myConnections')}
];

const NewsfeedWidget: FC = () => {
  const {widgetManagerStore, widgetStore} = useStore();
  const {newsfeedStore} = widgetStore;
  const {close} = widgetManagerStore;

  const [activeTab, setActiveTab] = useState<NewsfeedTabTypes>(newsfeedStore.newsfeedType);

  const {t} = useI18n();

  console.log(newsfeedStore.entries);

  const renderEntry = (entry: NewsfeedEntryModelInterface) => {
    if ([NewsfeedTypeEnum.CREATED, NewsfeedTypeEnum.BOOST].includes(entry.entry_type)) {
      return <></>;
    }
    return <></>;
  };

  return (
    <styled.Container data-testid="NewsfeedWidget-test">
      <Panel
        isFullHeight
        size="large"
        icon="no_fire"
        variant="primary"
        title={t('labels.newsfeed')}
        onClose={() => close(WidgetEnum.NEWSFEED)}
      >
        <styled.Wrapper>
          <styled.Tabs>
            <Tabs tabList={TABS_LIST} activeId={activeTab} onSelect={setActiveTab} />
          </styled.Tabs>
          <styled.Content>{newsfeedStore.entries.map(renderEntry)}</styled.Content>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(NewsfeedWidget);
