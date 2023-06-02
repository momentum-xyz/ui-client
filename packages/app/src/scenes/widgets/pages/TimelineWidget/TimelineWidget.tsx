import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Event3dEmitter, PostTypeEnum, useI18n} from '@momentum-xyz/core';
import {Panel, PostCreator, PostFormInterface} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import * as styled from './TimelineWidget.styled';

const MAX_VIDEO_DURATION_SEC = 15;

const TimelineWidget: FC = () => {
  const {widgetManagerStore, widgetStore, sessionStore, universeStore} = useStore();
  const {world3dStore} = universeStore;
  const {timelineStore} = widgetStore;
  const {user} = sessionStore;

  const {t} = useI18n();

  useEffect(() => {
    return () => {
      world3dStore?.clearSnapshotOrVideo();
    };
  }, [world3dStore]);

  const handleCreatePost = async (form: PostFormInterface, postType: PostTypeEnum) => {
    const isDone = await timelineStore.create(form, postType);
    if (isDone) {
      world3dStore?.clearSnapshotOrVideo();
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
        onClose={() => widgetManagerStore.close(WidgetEnum.TIMELINE)}
      >
        <styled.Wrapper>
          {!sessionStore.isGuest && (
            <PostCreator
              author={{id: user.id, name: user.name, avatarSrc: user.avatarSrc}}
              videoOrScreenshot={world3dStore?.screenshotOrVideo}
              maxVideoDurationSec={MAX_VIDEO_DURATION_SEC}
              isCreating={false}
              onMakeScreenshot={() => {
                Event3dEmitter.emit('MakeScreenshot');
              }}
              onStartRecording={() => {
                Event3dEmitter.emit('StartRecordingVideo', MAX_VIDEO_DURATION_SEC);
              }}
              onStopRecording={() => {
                Event3dEmitter.emit('StopRecordingVideo');
              }}
              onCreatePost={handleCreatePost}
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
