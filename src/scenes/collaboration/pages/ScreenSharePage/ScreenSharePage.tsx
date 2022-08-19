import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {SpaceTopBar, Button, TextChat} from 'ui-kit';

import {ScreenChoice, ScreenVideo} from './components/templates';
import * as styled from './ScreenSharePage.styled';

const ScreenSharePage: FC = () => {
  const {mainStore, sessionStore, collaborationStore} = useStore();
  const {space, screenShareStore, textChatStore} = collaborationStore;
  const {isSettingUp, screenShareTitle} = screenShareStore;
  const {agoraStore, favoriteStore} = mainStore;
  const {agoraScreenShareStore, agoraStageModeStore} = agoraStore;
  const {videoTrack} = agoraScreenShareStore;

  const {t} = useTranslation();

  useEffect(() => {
    if (videoTrack) {
      // IRemoteVideoTrack doesn't have getUserId method
      if ('getUserId' in videoTrack) {
        const agoraUserId = videoTrack.getUserId() as string;
        screenShareStore.setScreenOwner(agoraUserId);
      } else {
        screenShareStore.setScreenOwner(sessionStore.userId);
      }
      screenShareStore.setIsSettingUp(false);
    } else {
      screenShareStore.setScreenOwner(null);
    }
  }, [videoTrack, screenShareStore, sessionStore.userId]);

  const startScreenSharing = useCallback(() => {
    screenShareStore.setIsSettingUp(true);
    agoraScreenShareStore.startScreenSharing();
  }, [agoraScreenShareStore, screenShareStore]);

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
        isChatOpen={textChatStore.textChatDialog.isOpen}
        toggleChat={textChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={textChatStore.numberOfUnreadMessages}
      >
        {videoTrack && (
          <Button label={t('actions.cancel')} variant="danger" onClick={stopScreenSharing} />
        )}
      </SpaceTopBar>
      <styled.Container>
        {!videoTrack ? (
          <ScreenChoice
            isSettingUp={isSettingUp}
            canShare={space.isAdmin || agoraStageModeStore.isOnStage}
            startScreenShare={startScreenSharing}
          />
        ) : (
          <ScreenVideo videoTrack={videoTrack} />
        )}
        {textChatStore.textChatDialog.isOpen && (
          <TextChat
            currentChannel={textChatStore.currentChannel}
            userId={sessionStore.userId}
            sendMessage={textChatStore.sendMessage}
            messages={textChatStore.messages}
            messageSent={textChatStore.messageSent}
          />
        )}
      </styled.Container>
    </styled.Inner>
  );
};

export default observer(ScreenSharePage);
