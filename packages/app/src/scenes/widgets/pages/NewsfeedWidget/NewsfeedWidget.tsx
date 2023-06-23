import {FC, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import AutoSizer, {Size} from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import {VariableSizeList} from 'react-window';
import {useI18n} from '@momentum-xyz/core';
import {Panel} from '@momentum-xyz/ui-kit';

import {useNavigation, useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {PostEntityRow} from 'ui-kit';

import * as styled from './NewsfeedWidget.styled';

const NewsfeedWidget: FC = () => {
  const {widgetManagerStore, widgetStore, sessionStore, universeStore} = useStore();
  const {worldId} = universeStore;
  const {newsfeedStore} = widgetStore;
  const {user} = sessionStore;

  const infiniteRef = useRef(null);
  const scrollListRef = useRef<VariableSizeList | null>();
  const entityHeightsRef = useRef({});

  const {t} = useI18n();
  const {goToOdysseyHome} = useNavigation();

  useEffect(() => {
    newsfeedStore.open();
    newsfeedStore.loadMore(0);

    return () => {
      newsfeedStore.close();
    };
  }, [newsfeedStore, sessionStore, worldId]);

  const handleVisit = (worldId: string) => {
    goToOdysseyHome(worldId);
  };

  const setRowHeight = (index: number, size: number) => {
    scrollListRef.current?.resetAfterIndex(index);
    entityHeightsRef.current = {...entityHeightsRef.current, [index]: size};
  };

  const getRowHeight = (index: number) => {
    return (entityHeightsRef.current as any)[index] || 0;
  };

  if (!user) {
    return <></>;
  }

  console.log('[Newsfeed]: Entities', newsfeedStore.entityList);

  return (
    <styled.Container data-testid="NewsfeedWidget-test">
      <Panel
        size="normal"
        isFullHeight
        isScrollDisabled
        variant="primary"
        icon="newsfeed"
        title={t('labels.newsfeed')}
        onClose={() => widgetManagerStore.close(WidgetEnum.NEWSFEED)}
      >
        <styled.Wrapper>
          <AutoSizer>
            {({height, width}: Size) => {
              return (
                <styled.InfinityList>
                  <InfiniteLoader
                    threshold={5}
                    ref={infiniteRef}
                    itemCount={newsfeedStore.itemCount}
                    isItemLoaded={(index) => index < newsfeedStore.entityList.length}
                    loadMoreItems={(startIndex) => newsfeedStore.loadMore(startIndex)}
                  >
                    {({onItemsRendered, ref}) => {
                      return (
                        <VariableSizeList
                          width={width}
                          height={height}
                          ref={(list) => {
                            ref(list);
                            scrollListRef.current = list;
                          }}
                          itemSize={getRowHeight}
                          itemCount={newsfeedStore.itemCount}
                          itemKey={(index) => index}
                          itemData={{
                            items: newsfeedStore.entityList,
                            setRowHeight,
                            handleVisit
                          }}
                          onItemsRendered={onItemsRendered}
                          estimatedItemSize={300}
                        >
                          {PostEntityRow}
                        </VariableSizeList>
                      );
                    }}
                  </InfiniteLoader>
                </styled.InfinityList>
              );
            }}
          </AutoSizer>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(NewsfeedWidget);
