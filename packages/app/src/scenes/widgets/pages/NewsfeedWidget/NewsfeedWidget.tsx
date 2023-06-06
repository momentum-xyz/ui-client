import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, i18n, NewsfeedTypeEnum} from '@momentum-xyz/core';
import {TabInterface, Tabs, Panel, NewsfeedEntry} from '@momentum-xyz/ui-kit';
import {ListChildComponentProps} from 'react-window';

import {InfiniteScroll} from 'ui-kit';
import {useNavigation, useStore} from 'shared/hooks';
import {NewsfeedTabTypeEnum, WidgetEnum} from 'core/enums';

import * as styled from './NewsfeedWidget.styled';

const TABS_LIST: TabInterface<NewsfeedTabTypeEnum>[] = [
  {id: NewsfeedTabTypeEnum.UNIVERSAL, icon: 'clock', label: i18n.t('labels.universal')},
  {id: NewsfeedTabTypeEnum.MY_CONNECTIONS, icon: 'connect', label: i18n.t('labels.myConnections')}
];

const PADDING = 10;
const BASE_IMAGE_SIZE = 272 + PADDING;
const BASE_TEXT_SIZE = 116 + PADDING;

const calculateApproximateTextRowCount = (text: string) => {
  return text.length / 50;
}

const NewsfeedWidget: FC = () => {
  const {widgetManagerStore, widgetStore} = useStore();
  const {close} = widgetManagerStore;
  const {newsfeedStore} = widgetStore;
  const {newsfeedType, currentTabEntries, itemCount, setActiveNewsfeedType, loadMore} =
    newsfeedStore;

  const {t} = useI18n();
  const {goToOdysseyHome} = useNavigation();

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  const handleWorldOpen = useCallback(
    (worldId: string) => {
      console.log('Open newsfeed entry world', worldId);
      if (!worldId) {
        return;
      }
      goToOdysseyHome(worldId);
    },
    [goToOdysseyHome]
  );


  const isItemLoaded = (index: number) => index < currentTabEntries.length;

  const calcItemSize = (index: number) => {
    if (!isItemLoaded(index)) {
      return 100;
    }
    const entry = currentTabEntries[index];
    if ([NewsfeedTypeEnum.IMAGE, NewsfeedTypeEnum.VIDEO].includes(entry.entry_type)) {
      if (!entry.data.comment) {
        return BASE_IMAGE_SIZE;
      }
      const approximateTextRowCount = calculateApproximateTextRowCount(entry.data.comment);
      return BASE_IMAGE_SIZE + 10 + approximateTextRowCount * 22;
    }
    return BASE_TEXT_SIZE;
  };

  const Row: FC<ListChildComponentProps<any>> = ({index, style, data}) => {
    const {entries, onWorldOpen} = data;
    const entry = entries[index];
    return (
      <div style={style}>
        {isItemLoaded(index) ? (
          <NewsfeedEntry
            key={entry.id}
            entry={entry}
            onWorldOpen={onWorldOpen}
            onShare={() => {}}
          />
        ) : (
          'Loading ...'
        )}
      </div>
    );
  };

  console.log('currentTabEntries', currentTabEntries);

  return (
    <styled.Container data-testid="NewsfeedWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="newsfeed"
        variant="primary"
        title={t('labels.newsfeed')}
        onClose={() => close(WidgetEnum.NEWSFEED)}
      >
        <styled.Wrapper className="wrapper-test">
          <styled.Tabs>
            <Tabs
              tabList={TABS_LIST}
              activeId={newsfeedType}
              onSelect={setActiveNewsfeedType}
            />
          </styled.Tabs>
          <InfiniteScroll
            itemCount={itemCount}
            items={currentTabEntries}
            estimatedItemSize={116}
            width={370}
            height={1000}
            itemData={{entries: currentTabEntries, onWorldOpen: handleWorldOpen}}
            row={Row}
            calcItemSize={calcItemSize}
            isItemLoaded={isItemLoaded}
            loadMore={loadMore}
            itemKey={(index: number) => currentTabEntries[index]?.id || `loading-${index}`}
          />
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(NewsfeedWidget);
