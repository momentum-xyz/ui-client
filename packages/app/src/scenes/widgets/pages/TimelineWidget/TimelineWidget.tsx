import {FC, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import AutoSizer, {Size} from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import {VariableSizeList} from 'react-window';
import cn from 'classnames';
import {Event3dEmitter, PostTypeEnum, useI18n} from '@momentum-xyz/core';
import {Panel, PostFormInterface} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {TimelineEntryModelInterface} from 'core/models';

import {EntityRow} from './components';
import * as styled from './TimelineWidget.styled';

const TimelineWidget: FC = () => {
  const {widgetManagerStore, widgetStore, sessionStore, universeStore} = useStore();
  const {world3dStore, worldId} = universeStore;
  const {timelineStore} = widgetStore;
  const {user} = sessionStore;

  const infiniteRef = useRef(null);
  const scrollListRef = useRef<VariableSizeList | null>();
  const entityHeightsRef = useRef({});

  const [postTypeIntent, setPostTypeIntent] = useState<PostTypeEnum | null>(null);

  const {t} = useI18n();

  useEffect(() => {
    timelineStore.init(sessionStore.isGuest);
    timelineStore.loadMore(worldId, 0);

    return () => {
      timelineStore.resetModel();
    };
  }, [timelineStore, sessionStore, worldId]);

  useEffect(() => {
    return () => {
      world3dStore?.clearSnapshotOrVideo();
      world3dStore?.setIsScreenRecording(false);
    };
  }, [timelineStore, world3dStore]);

  const handleCreatePost = async (form: PostFormInterface, postType: PostTypeEnum) => {
    const isDone = await timelineStore.createItem(form, postType, worldId);
    if (isDone) {
      world3dStore?.clearSnapshotOrVideo();
      timelineStore.fetch(worldId);
    }
    return isDone;
  };

  const handleUpdatePost = async (form: PostFormInterface, entry: TimelineEntryModelInterface) => {
    const isDone = await timelineStore.updateItem(form, entry, worldId);
    if (isDone) {
      world3dStore?.clearSnapshotOrVideo();
    }
    return isDone;
  };

  const handleDeletePost = async (entry: TimelineEntryModelInterface) => {
    const isDone = await timelineStore.deleteItem(entry, worldId);
    if (isDone) {
      timelineStore.fetch(worldId);
    }
    return isDone;
  };

  const handleClearFile = () => {
    world3dStore?.clearSnapshotOrVideo();
  };

  const handleMakeScreenshot = () => {
    Event3dEmitter.emit('MakeScreenshot');
  };

  const handleStartRecording = (maxDuration: number) => {
    Event3dEmitter.emit('StartRecordingVideo', maxDuration);
    world3dStore?.setIsScreenRecording(true);
  };

  const handleStopRecording = () => {
    Event3dEmitter.emit('StopRecordingVideo');
    world3dStore?.setIsScreenRecording(false);
  };

  const handleEdit = (entry: TimelineEntryModelInterface) => {
    console.log(entry);
  };

  const handleShare = (entry: TimelineEntryModelInterface) => {
    console.log(entry);
  };

  const getRowHeight = (index: number) => {
    return (entityHeightsRef.current as any)[index] || 0;
  };

  const setRowHeight = (index: number, size: number) => {
    scrollListRef.current?.resetAfterIndex(index);
    entityHeightsRef.current = {...entityHeightsRef.current, [index]: size};
  };

  if (!user) {
    return <></>;
  }

  console.log('[Timeline]: Entities', timelineStore.entityList);
  console.log('[Timeline]: File', world3dStore?.screenshotOrVideo);

  return (
    <styled.Container data-testid="TimelineWidget-test">
      <Panel
        size="normal"
        isFullHeight
        isScrollDisabled
        variant="primary"
        icon="clock-two"
        title={t('labels.timeline')}
        isCloseDisabled={universeStore.isScreenRecording}
        onClose={() => widgetManagerStore.close(WidgetEnum.TIMELINE)}
      >
        <styled.Wrapper>
          <AutoSizer>
            {({height, width}: Size) => {
              console.log('[Timeline]: AutoSizer', height);
              return (
                <styled.InfinityList className={cn(postTypeIntent && 'hidden')}>
                  <InfiniteLoader
                    threshold={5}
                    ref={infiniteRef}
                    itemCount={timelineStore.itemCount}
                    isItemLoaded={(index) => index < timelineStore.entityList.length}
                    loadMoreItems={(startIndex) => {
                      timelineStore.loadMore(worldId, startIndex);
                    }}
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
                          itemCount={timelineStore.itemCount}
                          itemKey={(index) => index}
                          itemData={{
                            setRowHeight,
                            user: sessionStore.user,
                            items: timelineStore.entityList,
                            isMyWorld: universeStore.isMyWorld,
                            isPending: timelineStore.isPending,
                            isCreationShown: timelineStore.isCreationShown,
                            screenshotOrVideo: world3dStore?.screenshotOrVideo,
                            isScreenRecording: universeStore.isScreenRecording,
                            handleCreatePost,
                            handleClearFile,
                            handleMakeScreenshot,
                            handleStartRecording,
                            handleStopRecording,
                            handleUpdatePost,
                            handleDeletePost,
                            setPostTypeIntent,
                            handleEdit,
                            handleShare
                          }}
                          onItemsRendered={onItemsRendered}
                          estimatedItemSize={300}
                        >
                          {EntityRow}
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

export default observer(TimelineWidget);
