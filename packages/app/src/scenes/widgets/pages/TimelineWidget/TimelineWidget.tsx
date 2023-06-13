import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
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

  const {t} = useI18n();

  useEffect(() => {
    timelineStore.fetch(worldId);
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

  if (!user) {
    return <></>;
  }

  return (
    <styled.Container data-testid="TimelineWidget-test">
      <Panel
        isFullHeight
        size="normal"
        variant="primary"
        icon="clock-two"
        title={t('labels.timeline')}
        isCloseDisabled={universeStore.isScreenRecording}
        onClose={() => widgetManagerStore.close(WidgetEnum.TIMELINE)}
      >
        <styled.Wrapper>
          {/* CREATE A NEW ONE FORM */}
          {!sessionStore.isGuest && (
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
          <styled.ListContainer>
            {timelineStore.entries.map((entry) => (
              <PostEntry
                key={entry.activity_id}
                author={{
                  id: entry.user_id,
                  name: entry.user_id, // FIXME
                  avatarSrc: null, // FIXME
                  isItMe: entry.user_id === sessionStore.userId
                }}
                entry={{
                  id: entry.activity_id,
                  description: entry.data.description,
                  type: entry.type,
                  objectId: entry.object_id,
                  objectName: entry.object_id, // FIXME
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
            ))}
          </styled.ListContainer>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(TimelineWidget);
