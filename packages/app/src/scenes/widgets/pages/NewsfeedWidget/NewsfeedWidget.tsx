/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC, PureComponent, useCallback, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, i18n, NewsfeedTypeEnum} from '@momentum-xyz/core';
import {TabInterface, Tabs, Panel, NewsfeedEntry, InfiniteScroll} from '@momentum-xyz/ui-kit';
import {ListOnItemsRenderedProps} from 'react-window';

import {useNavigation, useStore} from 'shared/hooks';
import {NewsfeedTabTypeEnum, WidgetEnum} from 'core/enums';

import * as styled from './NewsfeedWidget.styled';

const TABS_LIST: TabInterface<NewsfeedTabTypeEnum>[] = [
  {id: NewsfeedTabTypeEnum.UNIVERSAL, icon: 'clock', label: i18n.t('labels.universal')},
  {id: NewsfeedTabTypeEnum.MY_CONNECTIONS, icon: 'connect', label: i18n.t('labels.myConnections')}
];

class ItemRenderer extends PureComponent<{data: any; index: number; style: any}> {
  render() {
    const {data, index, style} = this.props;
    const {entries, onWorldOpen} = data;
    const entry = entries[index];
    return (
      <div style={style}>
        <NewsfeedEntry
          key={entry.id}
          entry={entry}
          onWorldOpen={onWorldOpen}
          // onWorldOpen={(id) => { console.log(id); }}
          onShare={() => {}}
        />
      </div>
    );
  }
}

const NewsfeedWidget: FC = () => {
  const {widgetManagerStore, widgetStore} = useStore();
  const {close} = widgetManagerStore;
  const {newsfeedStore} = widgetStore;
  const {newsfeedType, currentTabEntries, itemCount, setActiveNewsfeedType, loadMore} =
    newsfeedStore;

  const {t} = useI18n();
  const {goToOdysseyHome} = useNavigation();

  const contentRef = useRef(null);
  const observerTargetRef = useRef(null);

  const contentRef2 = useRef(null);

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

  const handleTabChange = (type: NewsfeedTabTypeEnum) => {
    setActiveNewsfeedType(type);
    // (contentRef as any).current.scroll({
    //   top: 0,
    //   behavior: 'smooth'
    // });
  };

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (d) => {
  //       if (d[0].isIntersecting) {
  //         loadMore();
  //       }
  //     },
  //     {threshold: 1}
  //   );

  //   if (observerTargetRef.current) {
  //     observer.observe(observerTargetRef.current);
  //   }

  //   return () => {
  //     if (observerTargetRef.current) {
  //       observer.unobserve(observerTargetRef.current);
  //     }
  //   };
  // }, [loadMore, observerTargetRef]);

  const isItemLoaded = (index: number) => {
    // console.log(`isItemLoaded ${index}`);
    return index < currentTabEntries.length;
  };

  const calcItemSize = (index: number) => {
    const entry = currentTabEntries[index];
    if (entry.entry_type === NewsfeedTypeEnum.IMAGE) {
      return 272;
    }
    return 116;
  };

  const handleItemsRendered = (props: ListOnItemsRenderedProps) => {
    console.log(props);
  };

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
              onSelect={(type: NewsfeedTabTypeEnum) => handleTabChange(type)}
            />
          </styled.Tabs>
          {/* <styled.Content ref={contentRef}>
            {currentTabEntries.map((entry) => (
              <NewsfeedEntry
                key={entry.id}
                entry={entry}
                onWorldOpen={handleWorldOpen}
                onShare={() => {}}
              />
            ))}
            <div ref={observerTargetRef}></div>
          </styled.Content> */}
          <InfiniteScroll
            itemCount={itemCount}
            items={currentTabEntries}
            estimatedItemSize={116}
            width={370}
            height={1000}
            itemData={{entries: currentTabEntries, onWorldOpen: handleWorldOpen}}
            row={ItemRenderer}
            calcItemSize={calcItemSize}
            isItemLoaded={isItemLoaded}
            loadMoreItems={() => {
              console.log('loadMoreItems');
              return loadMore();
            }}
            handleItemsRendered={handleItemsRendered}
            itemKey={(index: number) => currentTabEntries[index].id}
          />
          {/* <InfiniteLoader
            itemCount={itemCount}
            isItemLoaded={isItemLoaded}
            loadMoreItems={() => {
              console.log('loadMoreItems');
              return loadMore();
            }}
          >
            {({onItemsRendered, ref}) => {
              ref(contentRef2);
              return (
                <VariableSizeList
                  itemCount={itemCount}
                  itemKey={(index) => currentTabEntries[index].id}
                  onItemsRendered={(props: ListOnItemsRenderedProps) => {
                    onItemsRendered(props);
                    handleItemsRendered(props);
                  }}
                  ref={ref}
                  estimatedItemSize={116}
                  width={370}
                  height={1000}
                  itemSize={calcItemSize}
                  itemData={{entries: currentTabEntries, onWorldOpen: handleWorldOpen}}
                >
                  {ItemRenderer}
                </VariableSizeList>
              );
            }}
          </InfiniteLoader> */}
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(NewsfeedWidget);
