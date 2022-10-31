import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {Button} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SpacePage, SpaceTopBar} from 'ui-kit';
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

  const {t} = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (videoTrack) {
      screenShareStore.relayScreenShare(spaceStore?.id ?? '');

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

  if (!spaceStore) {
    return null;
  }

  return (
    <SpacePage dataTestId="ScreenSharePage-test">
      <SpaceTopBar
        title={spaceStore.name ?? ''}
        subtitle={screenShareTitle}
        isAdmin={spaceStore.isAdmin}
        spaceId={spaceStore.id}
        isSpaceFavorite={favoriteStore.isFavorite(spaceStore.id)}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        editSpaceHidden
        isChatOpen={streamChatStore.isOpen}
        toggleChat={streamChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={streamChatStore.numberOfUnreadMessages}
        onLeave={async () => {
          await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
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
            canShare={spaceStore.isAdmin || agoraStageModeStore.isOnStage}
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
