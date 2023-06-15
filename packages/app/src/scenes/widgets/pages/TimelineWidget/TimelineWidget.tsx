import {FC, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import AutoSizer, {Size} from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import {ListChildComponentProps, VariableSizeList} from 'react-window';
import {Event3dEmitter, PostTypeEnum, useI18n} from '@momentum-xyz/core';
import {ImageSizeEnum, Panel, PostEntry, PostFormInterface} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {TimelineEntryModelInterface} from 'core/models';
import {getImageAbsoluteUrl, getVideoAbsoluteUrl} from 'core/utils';

import * as styled from './TimelineWidget.styled';

const TimelineWidget: FC = () => {
  const {widgetManagerStore, widgetStore, sessionStore, universeStore} = useStore();
  const {world3dStore, worldId} = universeStore;
  const {timelineStore} = widgetStore;
  const {user} = sessionStore;

  const infiniteRef = useRef(null);
  const scrollListRef = useRef<VariableSizeList | null>();
  const entityHeightsRef = useRef({});

  const {t} = useI18n();

  useEffect(() => {
    timelineStore.loadMore(worldId, 0);

    return () => {
      timelineStore.resetModel();
    };
  }, [timelineStore, worldId]);

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

  const handleShare = (entry: TimelineEntryModelInterface) => {
    console.log(entry);
  };

  const getRowHeight = (index: number) => {
    return (entityHeightsRef.current as any)[index] || 0;
  };

  const setRowHeight = (index: number, size: number) => {
    scrollListRef.current?.resetAfterIndex(0);
    entityHeightsRef.current = {...entityHeightsRef.current, [index]: size};
  };

  const EntityRenderer: FC<ListChildComponentProps> = ({index, style, data}) => {
    const rowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (rowRef.current) {
        setRowHeight(index, rowRef.current.clientHeight);
      }
    }, [index, rowRef]);

    const entry = data.items[index];

    if (!entry) {
      return <></>;
    }

    return (
      <div style={style}>
        <styled.EntryItem ref={rowRef}>
          <PostEntry
            author={{
              id: entry.user_id,
              name: entry.user_name,
              avatarSrc: getImageAbsoluteUrl(entry.avatar_hash),
              isItMe: entry.user_id === sessionStore.userId
            }}
            entry={{
              id: entry.activity_id,
              description: entry.data.description,
              type: entry.type,
              objectId: entry.object_id,
              objectName: entry.world_name,
              created: entry.created_at,
              hashSrc:
                entry.type === PostTypeEnum.VIDEO
                  ? getVideoAbsoluteUrl(entry.data.hash)
                  : getImageAbsoluteUrl(entry.data.hash, ImageSizeEnum.S5)
            }}
            canEdit={universeStore.isMyWorld || entry.user_id === sessionStore.userId}
            videoOrScreenshot={world3dStore?.screenshotOrVideo}
            isPending={timelineStore.isPending}
            isScreenRecording={universeStore.isScreenRecording}
            onClearVideoOrScreenshot={handleClearFile}
            onMakeScreenshot={handleMakeScreenshot}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onCreateOrUpdatePost={(form) => {
              return handleUpdatePost(form, entry);
            }}
            onDelete={() => handleDeletePost(entry)}
            onCancelCreation={handleClearFile}
            onShare={() => handleShare(entry)}
          />
        </styled.EntryItem>
      </div>
    );
  };

  console.log('[Timeline]: Entities', timelineStore.entityList);
  console.log('[Timeline]: Entity Heights', entityHeightsRef.current);

  if (!user) {
    return <></>;
  }

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
          {/* CREATE A NEW ONE FORM */}
          {sessionStore.isGuest && (
            <PostEntry
              author={{
                id: user.id,
                name: user.name,
                avatarSrc: user.avatarSrc || null,
                isItMe: true
              }}
              videoOrScreenshot={world3dStore?.screenshotOrVideo}
              isPending={timelineStore.isPending}
              isScreenRecording={universeStore.isScreenRecording}
              onClearVideoOrScreenshot={handleClearFile}
              onMakeScreenshot={handleMakeScreenshot}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onCreateOrUpdatePost={handleCreatePost}
              onCancelCreation={handleClearFile}
            />
          )}

          {/* LIST OF ENTRIES */}
          <AutoSizer>
            {({height, width}: Size) => {
              console.log('[Timeline]: AutoSizer', height);
              return (
                <InfiniteLoader
                  threshold={5}
                  ref={infiniteRef}
                  itemCount={timelineStore.itemCount}
                  isItemLoaded={(index) => index < timelineStore.entityList.length}
                  loadMoreItems={(startIndex, stopIndex) => {
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
                        itemData={{items: timelineStore.entityList}}
                        onItemsRendered={onItemsRendered}
                        estimatedItemSize={300}
                      >
                        {EntityRenderer}
                      </VariableSizeList>
                    );
                  }}
                </InfiniteLoader>
              );
            }}
          </AutoSizer>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(TimelineWidget);
