import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {useHistory} from 'react-router';
import {Button} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {SpaceTopBar, TextChat, VideoPanel} from 'ui-kit';
import {ROUTES} from 'core/constants';

import * as styled from './LiveStreamPage.styled';

const LiveStreamPage: FC = () => {
  const {mainStore, sessionStore, collaborationStore, leaveMeetingSpace} = useStore();
  const {space, textChatStore} = collaborationStore;
  const {favoriteStore, liveStreamStore} = mainStore;

  const history = useHistory();

  useEffect(() => {
    liveStreamStore.showWidget();
  }, [liveStreamStore]);

  if (!space) {
    return null;
  }

  return (
    <styled.Inner data-testid="LiveStreamPage-test">
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle={t('liveStream.subtitle')}
        isAdmin={space.isAdmin}
        spaceId={space.id}
        isSpaceFavorite={favoriteStore.isFavorite(space?.id || '')}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        editSpaceHidden
        isChatOpen={textChatStore.textChatDialog.isOpen}
        toggleChat={textChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={textChatStore.numberOfUnreadMessages}
        onLeave={async () => {
          await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
      >
        {liveStreamStore.isStreaming && space.isAdmin && (
          <Button
            label={t('liveStream.stopStream')}
            variant="danger"
            onClick={() => liveStreamStore.disableBroadcast(space?.id)}
          />
        )}
      </SpaceTopBar>
      <styled.Container>
        <VideoPanel youtubeHash={liveStreamStore.broadcast.url} />
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

export default observer(LiveStreamPage);
