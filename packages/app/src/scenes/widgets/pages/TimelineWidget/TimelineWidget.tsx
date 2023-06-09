import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Event3dEmitter, PostTypeEnum, useI18n} from '@momentum-xyz/core';
import {Panel, PostEntry, PostFormInterface} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

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
    const isDone = await timelineStore.create(form, postType, worldId);
    if (isDone) {
      world3dStore?.clearSnapshotOrVideo();
      timelineStore.fetch(worldId);
    }
    return isDone;
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
          {!sessionStore.isGuest && (
            <PostEntry
              author={{
                id: user.id,
                name: user.name,
                avatarSrc: user.avatarSrc || null,
                isItMe: true
              }}
              videoOrScreenshot={world3dStore?.screenshotOrVideo}
              isCreating={false}
              isScreenRecording={universeStore.isScreenRecording}
              onClearVideoOrScreenshot={() => {
                world3dStore?.clearSnapshotOrVideo();
              }}
              onMakeScreenshot={() => {
                Event3dEmitter.emit('MakeScreenshot');
              }}
              onStartRecording={(maxDuration) => {
                Event3dEmitter.emit('StartRecordingVideo', maxDuration);
                world3dStore?.setIsScreenRecording(true);
              }}
              onStopRecording={() => {
                Event3dEmitter.emit('StopRecordingVideo');
                world3dStore?.setIsScreenRecording(false);
              }}
              onCreateOrUpdatePost={handleCreatePost}
              onCancel={() => {
                world3dStore?.clearSnapshotOrVideo();
              }}
            />
          )}
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(TimelineWidget);
