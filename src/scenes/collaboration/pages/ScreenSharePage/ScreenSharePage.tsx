import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SpaceTopBar, Button} from 'ui-kit';
import {StreamChat} from 'scenes/collaboration/components/StreamChat';

import {ScreenChoice, ScreenVideo} from './components/templates';
import * as styled from './ScreenSharePage.styled';

const ScreenSharePage: FC = () => {
  const {mainStore, sessionStore, collaborationStore, leaveMeetingSpace} = useStore();
  const {space, screenShareStore, streamChatStore} = collaborationStore;
  const {screenShareTitle} = screenShareStore;
  const {agoraStore, favoriteStore} = mainStore;
  const {agoraScreenShareStore, agoraStageModeStore} = agoraStore;
  const {videoTrack} = agoraScreenShareStore;

  const {t} = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (videoTrack) {
      screenShareStore.relayScreenShare(space?.id ?? '');

      const agoraUserId = videoTrack.getUserId() as string;
      screenShareStore.setScreenOwner(agoraUserId);
    } else {
      screenShareStore.setScreenOwner(null);
    }
  }, [videoTrack, screenShareStore, sessionStore.userId]);

  const startScreenSharing = useCallback(() => {
    agoraScreenShareStore.startScreenSharing(sessionStore.userId);
  }, [agoraScreenShareStore, sessionStore.userId]);

  const stopScreenSharing = useCallback(() => {
    screenShareStore.setScreenOwner(null);
    agoraScreenShareStore.stopScreenSharing();
  }, [agoraScreenShareStore, screenShareStore]);

  if (!space) {
    return null;
  }

  return (
    <styled.Inner data-testid="ScreenSharePage-test">
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle={screenShareTitle}
        isAdmin={space.isAdmin}
        spaceId={space.id}
        isSpaceFavorite={favoriteStore.isFavorite(space?.id || '')}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        editSpaceHidden
        isChatOpen={streamChatStore.textChatDialog.isOpen}
        toggleChat={streamChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={streamChatStore.numberOfUnreadMessages}
        onLeave={async () => {
          await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
      >
        {((videoTrack && space.isAdmin) ||
          screenShareStore.screenOwnerId === sessionStore.userId) && (
          <Button label={t('actions.cancel')} variant="danger" onClick={stopScreenSharing} />
        )}
      </SpaceTopBar>
      <styled.Container>
        {!videoTrack ? (
          <ScreenChoice
            isSettingUp={agoraScreenShareStore.isSettingUp}
            canShare={
              (agoraStore.isStageMode && agoraStageModeStore.isOnStage) || !agoraStore.isStageMode
            }
            startScreenShare={startScreenSharing}
          />
        ) : (
          <ScreenVideo videoTrack={videoTrack} />
        )}
        {streamChatStore.textChatDialog.isOpen &&
          streamChatStore.client &&
          streamChatStore.currentChannel && (
            <StreamChat client={streamChatStore.client} channel={streamChatStore.currentChannel} />
          )}
      </styled.Container>
    </styled.Inner>
  );
};

export default observer(ScreenSharePage);
