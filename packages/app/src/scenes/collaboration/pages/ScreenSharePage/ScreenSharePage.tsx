import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {Button, SpacePage, SpaceTopBar} from '@momentum-xyz/ui-kit';
import {generatePath} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {StreamChat} from 'scenes/collaboration/components';

import {ScreenChoice, ScreenVideo} from './components/templates';
import * as styled from './ScreenSharePage.styled';

const ScreenSharePage: FC = () => {
  const {mainStore, sessionStore, collaborationStore, leaveMeetingSpace} = useStore();
  const {spaceStore, screenShareStore, streamChatStore} = collaborationStore;
  const {screenShareTitle} = screenShareStore;
  const {agoraStore, favoriteStore} = mainStore;
  const {agoraScreenShareStore, agoraStageModeStore} = agoraStore;
  const {videoTrack} = agoraScreenShareStore;
  const {space} = spaceStore;

  const {t} = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (videoTrack) {
      const agoraUserId = videoTrack.getUserId()?.toString();
      if (screenShareStore.screenOwnerId !== agoraUserId) {
        screenShareStore.setScreenOwner(agoraUserId);
      }
    } else {
      screenShareStore.setScreenOwner(null);
    }
  }, [videoTrack, screenShareStore, sessionStore.userId]);

  const startScreenSharing = useCallback(async () => {
    const wasStarted: boolean = await agoraScreenShareStore.startScreenSharing(sessionStore.userId);
    if (wasStarted && spaceStore.id) {
      screenShareStore.relayScreenShare(spaceStore.id);
    }
  }, [agoraScreenShareStore, screenShareStore, sessionStore.userId, spaceStore.id]);

  const stopScreenSharing = useCallback(() => {
    screenShareStore.setScreenOwner(null);
    agoraScreenShareStore.stopScreenSharing();
  }, [agoraScreenShareStore, screenShareStore]);

  if (!space) {
    return null;
  }

  return (
    <SpacePage dataTestId="ScreenSharePage-test" withMeeting>
      <SpaceTopBar
        title={space.name}
        subtitle={screenShareTitle}
        isAdmin={spaceStore.isAdmin}
        spaceId={space.id}
        isSpaceFavorite={favoriteStore.isFavorite(space.id)}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        editSpaceHidden
        isChatOpen={streamChatStore.isOpen}
        toggleChat={streamChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={streamChatStore.numberOfUnreadMessages}
        onLeave={async () => {
          await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
        adminLink={generatePath(ROUTES.spaceAdmin.base, {spaceId: space.id})}
        baseLink={generatePath(ROUTES.base, {spaceId: space.id})}
      >
        {((videoTrack && spaceStore.isAdmin) ||
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
        {streamChatStore.isOpen && streamChatStore.client && streamChatStore.currentChannel && (
          <StreamChat client={streamChatStore.client} channel={streamChatStore.currentChannel} />
        )}
      </styled.Container>
    </SpacePage>
  );
};

export default observer(ScreenSharePage);
