import {FC, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import AutoSizer, {Size} from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import {VariableSizeList} from 'react-window';
import cn from 'classnames';
import {Event3dEmitter, TimelineTypeEnum, useI18n} from '@momentum-xyz/core';
import {
  Panel,
  ImageSizeEnum,
  PostImageForm,
  PostVideoForm,
  PostFormInterface
} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {TimelineEntryModelInterface} from 'core/models';
import {getImageAbsoluteUrl, getVideoAbsoluteUrl} from 'core/utils';
import {PostEntityRow} from 'ui-kit';

import * as styled from './TimelineWidget.styled';

const TimelineWidget: FC = () => {
  const {widgetManagerStore, widgetStore, sessionStore, universeStore} = useStore();
  const {world3dStore, worldId} = universeStore;
  const {timelineStore} = widgetStore;
  const {user} = sessionStore;

  // it's important to extract it here,
  // using isPending={timelineStore.isPending} below in the components doesn't lead to re-render
  const {isPending} = timelineStore;

  const infiniteRef = useRef(null);
  const scrollListRef = useRef<VariableSizeList | null>();
  const entityHeightsRef = useRef({});

  const [postTypeIntent, setPostTypeIntent] = useState<TimelineTypeEnum | null>(null);
  const [selectedPost, setSelectedPost] = useState<TimelineEntryModelInterface | null>(null);

  const {t} = useI18n();

  useEffect(() => {
    timelineStore.open(sessionStore.isGuest);
    timelineStore.loadMore(0);

    return () => {
      timelineStore.close();
    };
  }, [timelineStore, sessionStore, worldId]);

  useEffect(() => {
    return () => {
      world3dStore?.clearSnapshotOrVideo();
      world3dStore?.setIsScreenRecording(false);
    };
  }, [timelineStore, world3dStore]);

  const handleCreatePost = async (form: PostFormInterface, postType: TimelineTypeEnum) => {
    const isDone = await timelineStore.createItem(form, postType, worldId);
    if (isDone) {
      world3dStore?.clearSnapshotOrVideo();
      setPostTypeIntent(null);
    }
  };

  const handleUpdatePost = async (form: PostFormInterface, entry: TimelineEntryModelInterface) => {
    const isDone = await timelineStore.updateItem(form, entry, worldId);
    if (isDone) {
      world3dStore?.clearSnapshotOrVideo();
      setSelectedPost(null);
    }
  };

  const handleDelete = async (entry: TimelineEntryModelInterface) => {
    const isDone = await timelineStore.deleteItem(entry, worldId);
    if (isDone) {
      setSelectedPost(null);
    }
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
    setSelectedPost(entry);
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
              return (
                <>
                  <styled.InfinityList
                    className={cn((postTypeIntent || !!selectedPost) && 'hidden')}
                  >
                    <InfiniteLoader
                      threshold={5}
                      ref={infiniteRef}
                      itemCount={timelineStore.itemCount}
                      isItemLoaded={(index) => index < timelineStore.entityList.length}
                      loadMoreItems={(startIndex) => timelineStore.loadMore(startIndex)}
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
                              user: sessionStore.user,
                              items: timelineStore.entityList,
                              isCreationShown: timelineStore.isCreationShown,
                              isMyWorld: universeStore.isMyWorld,
                              setRowHeight,
                              setPostTypeIntent,
                              handleEdit,
                              handleDelete
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

                  {/* A NEW SCREENSHOT FORM */}
                  {postTypeIntent === TimelineTypeEnum.SCREENSHOT && (
                    <styled.Overlay>
                      <PostImageForm
                        author={{
                          id: user.id,
                          name: user.name,
                          avatarSrc: user.avatarSrc || null,
                          isItMe: true
                        }}
                        isPending={isPending}
                        screenshot={world3dStore?.screenshotOrVideo?.file}
                        onMakeScreenshot={handleMakeScreenshot}
                        onCreateOrUpdate={(form) => handleCreatePost(form, postTypeIntent)}
                        onClearScreenshot={handleClearFile}
                        onCancel={() => {
                          handleClearFile();
                          setPostTypeIntent(null);
                        }}
                      />
                    </styled.Overlay>
                  )}

                  {/* A NEW VIDEO FORM */}
                  {postTypeIntent === TimelineTypeEnum.VIDEO && (
                    <styled.Overlay>
                      <PostVideoForm
                        author={{
                          id: user.id,
                          name: user.name,
                          avatarSrc: user.avatarSrc || null,
                          isItMe: true
                        }}
                        isPending={isPending}
                        video={world3dStore?.screenshotOrVideo?.file}
                        isScreenRecording={universeStore.isScreenRecording}
                        onStartRecording={handleStartRecording}
                        onStopRecording={handleStopRecording}
                        onCreateOrUpdate={(form) => handleCreatePost(form, postTypeIntent)}
                        onClearVideo={handleClearFile}
                        onCancel={() => {
                          handleClearFile();
                          setPostTypeIntent(null);
                        }}
                      />
                    </styled.Overlay>
                  )}

                  {/* EDIT SCREENSHOT FORM */}
                  {selectedPost?.type === TimelineTypeEnum.SCREENSHOT && (
                    <styled.Overlay>
                      <PostImageForm
                        author={{
                          id: user.id,
                          name: user.name,
                          avatarSrc: user.avatarSrc || null,
                          isItMe: true
                        }}
                        entry={{
                          id: selectedPost.activity_id,
                          description: selectedPost.data.description,
                          type: selectedPost.type,
                          objectId: selectedPost.object_id,
                          objectName: selectedPost.world_name,
                          created: selectedPost.created_at,
                          hashSrc: getImageAbsoluteUrl(selectedPost.data.hash, ImageSizeEnum.S5)
                        }}
                        isPending={isPending}
                        screenshot={world3dStore?.screenshotOrVideo?.file}
                        onMakeScreenshot={handleMakeScreenshot}
                        onCreateOrUpdate={(form) => handleUpdatePost(form, selectedPost)}
                        onDelete={() => handleDelete(selectedPost)}
                        onClearScreenshot={handleClearFile}
                        onCancel={() => {
                          handleClearFile();
                          setSelectedPost(null);
                        }}
                      />
                    </styled.Overlay>
                  )}

                  {/* EDIT VIDEO FORM */}
                  {selectedPost?.type === TimelineTypeEnum.VIDEO && (
                    <styled.Overlay>
                      <PostVideoForm
                        author={{
                          id: user.id,
                          name: user.name,
                          avatarSrc: user.avatarSrc || null,
                          isItMe: true
                        }}
                        entry={{
                          id: selectedPost.activity_id,
                          description: selectedPost.data.description,
                          type: selectedPost.type,
                          objectId: selectedPost.object_id,
                          objectName: selectedPost.world_name,
                          created: selectedPost.created_at,
                          hashSrc: getVideoAbsoluteUrl(selectedPost.data.hash)
                        }}
                        isPending={isPending}
                        video={world3dStore?.screenshotOrVideo?.file}
                        isScreenRecording={universeStore.isScreenRecording}
                        onStartRecording={handleStartRecording}
                        onStopRecording={handleStopRecording}
                        onCreateOrUpdate={(form) => handleUpdatePost(form, selectedPost)}
                        onDelete={() => handleDelete(selectedPost)}
                        onClearVideo={handleClearFile}
                        onCancel={() => {
                          handleClearFile();
                          setSelectedPost(null);
                        }}
                      />
                    </styled.Overlay>
                  )}
                </>
              );
            }}
          </AutoSizer>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(TimelineWidget);
