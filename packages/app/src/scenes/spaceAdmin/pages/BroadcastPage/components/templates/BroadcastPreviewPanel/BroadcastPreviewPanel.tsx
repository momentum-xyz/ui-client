import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import YouTubeOG, {YouTubeProps} from 'react-youtube';
import {useTranslation} from 'react-i18next';
import {Button, SectionPanel} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import * as styled from './BroadcastPreviewPanel.styled';

const YouTube = YouTubeOG as unknown as FC<YouTubeProps>;

const BroadcastPreviewPanel: FC = () => {
  const {spaceAdminStore} = useStore();
  const {broadcastStore} = spaceAdminStore;

  const {t} = useTranslation();

  const youtubeOptions = {
    playerVars: {
      autoplay: 1,
      mute: 0
    }
  };

  return (
    <SectionPanel title={t('broadcastAdmin.previewTitle')}>
      <styled.Body data-testid="BroadcastPreviewPanel-test">
        <styled.VideoPanel>
          {broadcastStore.previewHash && (
            <YouTube
              videoId={broadcastStore.previewHash}
              className="youtube"
              iframeClassName="youtubeIframe"
              opts={youtubeOptions}
            />
          )}
        </styled.VideoPanel>
        <styled.ButtonWrapper>
          {broadcastStore.previewHash && !broadcastStore.isStreaming ? (
            <Button
              label={t('broadcastAdmin.broadcastStart')}
              onClick={broadcastStore.countdownDialog.open}
              variant="primary"
            />
          ) : broadcastStore.isStreaming ? (
            <Button
              label={t('broadcastAdmin.broadcastStop')}
              onClick={broadcastStore.stopBroadcastingDialog.open}
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
