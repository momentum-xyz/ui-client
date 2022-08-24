import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import YouTube from 'react-youtube';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {Button, SectionPanel, TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {BroadcastStatusEnum} from 'core/enums';

import * as styled from './BroadcastPreviewPanel.styled';

const BroadcastPreviewPanel: FC = () => {
  const {spaceAdminStore} = useStore();
  const {broadcastStore, spaceManagerStore} = spaceAdminStore;
  const {space} = spaceManagerStore;

  const {t} = useTranslation();

  const opts = {
    playerVars: {
      autoplay: 1,
      mute: 0
    }
  };

  const handleStartBroadcasting = async () => {
    const success = await broadcastStore.enableBroadcast(space?.id ?? '');
    if (success) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('broadcastAdmin.enableSuccess')}
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('broadcastAdmin.enableError')}
          isDanger
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  };

  const handleStopBroadcasting = async () => {
    const success = await broadcastStore.disableBroadcast(space?.id ?? '');
    if (success) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('broadcastAdmin.disableSuccess')}
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('broadcastAdmin.disableError')}
          isDanger
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  };

  return (
    <SectionPanel title={t('broadcastAdmin.previewTitle')} isCustom>
      <styled.Body data-testid="BroadcastPreviewPanel-test">
        <styled.VideoPanel>
          {broadcastStore.previewHash && (
            <YouTube
              videoId={broadcastStore.previewHash}
              className="youtube"
              iframeClassName="youtubeIframe"
              opts={opts}
            />
          )}
        </styled.VideoPanel>
        <styled.ButtonWrapper>
          {broadcastStore.isYoutubeHash && !broadcastStore.isStreaming ? (
            <Button
              label={t('broadcastAdmin.broadcastStart')}
              onClick={handleStartBroadcasting}
              variant="primary"
            />
          ) : BroadcastStatusEnum.PLAY === broadcastStore.broadcast.broadcastStatus ? (
            <Button
              label={t('broadcastAdmin.broadcastStop')}
              onClick={handleStopBroadcasting}
              variant="danger"
            />
          ) : (
            <Button label={t('broadcastAdmin.broadcastStart')} disabled />
          )}
        </styled.ButtonWrapper>
      </styled.Body>
    </SectionPanel>
  );
};

export default observer(BroadcastPreviewPanel);
