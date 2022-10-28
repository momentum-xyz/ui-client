import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {useHistory} from 'react-router';
import {Button} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {SpacePage, SpaceTopBar, VideoPanel} from 'ui-kit';
import {StreamChat} from 'scenes/collaboration/components';
import {ROUTES} from 'core/constants';

import * as styled from './LiveStreamPage.styled';

const LiveStreamPage: FC = () => {
  const {mainStore, collaborationStore, leaveMeetingSpace} = useStore();
  const {spaceStore, streamChatStore} = collaborationStore;
  const {favoriteStore, liveStreamStore} = mainStore;

  const history = useHistory();

  useEffect(() => {
    liveStreamStore.showWidget();
    liveStreamStore.enteredLiveStreamTab();

    return () => liveStreamStore.leftLiveStreamTab();
  }, [liveStreamStore]);

  if (!spaceStore) {
    return null;
  }

  return (
    <SpacePage dataTestId="LiveStreamPage-test">
      <SpaceTopBar
        title={spaceStore.name ?? ''}
        subtitle={t('liveStream.subtitle')}
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
        {liveStreamStore.isStreaming && spaceStore.isAdmin && (
          <Button
            label={t('liveStream.stopStream')}
            variant="danger"
            onClick={() => liveStreamStore.disableBroadcast(spaceStore.id)}
          />
        )}
      </SpaceTopBar>
      <styled.Container>
        <VideoPanel youtubeHash={liveStreamStore.broadcast.url} />
        {streamChatStore.isOpen && streamChatStore.client && streamChatStore.currentChannel && (
          <StreamChat client={streamChatStore.client} channel={streamChatStore.currentChannel} />
        )}
      </styled.Container>
    </SpacePage>
  );
};

export default observer(LiveStreamPage);
