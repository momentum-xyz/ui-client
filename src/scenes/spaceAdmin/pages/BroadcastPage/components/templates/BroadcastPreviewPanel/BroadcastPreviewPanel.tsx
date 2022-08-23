import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import YouTube from 'react-youtube';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {Button, SectionPanel, TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {BroadcastStatusEnum} from 'core/enums';

import * as styled from './BroadcastPreviewPanel.styled';
// TODO translation
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
          text="The video has broadcast successfully"
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text="there was a problem broadcasting this video"
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
          text="Broadcasting has disabled successfully"
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text="there was a problem disabling the broadcast"
          isDanger
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  };

  return (
    <SectionPanel title="Preview" isCustom>
      <styled.Body data-testid="BroadcastPreviewPanel-test">
        <styled.VideoPanel>
          {broadcastStore.youtubeHash && (
            <YouTube
              videoId={broadcastStore.youtubeHash}
              className="youtube"
              iframeClassName="youtubeIframe"
              opts={opts}
            />
          )}
        </styled.VideoPanel>
        <styled.ButtonWrapper>
          {broadcastStore.isYoutubeHash &&
          broadcastStore.broadcastStatus === BroadcastStatusEnum.STOP ? (
            <Button
              label="start broadcasting"
              onClick={handleStartBroadcasting}
              variant="primary"
            />
          ) : BroadcastStatusEnum.PLAY === broadcastStore.broadcastStatus ? (
            <Button label="stop broadcasting" onClick={handleStopBroadcasting} variant="danger" />
          ) : (
            <Button label="start broadcasting" disabled />
          )}
        </styled.ButtonWrapper>
      </styled.Body>
    </SectionPanel>
  );
};

export default observer(BroadcastPreviewPanel);
