import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {useHistory} from 'react-router';
import {Button} from '@momentum/ui-kit';

import {useStore} from 'shared/hooks';
import {SpaceTopBar} from 'ui-kit';
import {StreamChat} from 'scenes/collaboration/components/StreamChat';
import {ROUTES} from 'core/constants';

import * as styled from './LiveStreamPage.styled';
import {VideoPanel} from './components';

const LiveStreamPage: FC = () => {
  const {mainStore, collaborationStore, leaveMeetingSpace} = useStore();
  const {space, streamChatStore, liveStreamStore} = collaborationStore;
  const {favoriteStore} = mainStore;

  const history = useHistory();

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
        isChatOpen={streamChatStore.textChatDialog.isOpen}
        toggleChat={streamChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={streamChatStore.numberOfUnreadMessages}
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
        {streamChatStore.textChatDialog.isOpen &&
          streamChatStore.client &&
          streamChatStore.currentChannel && (
            <StreamChat client={streamChatStore.client} channel={streamChatStore.currentChannel} />
          )}
      </styled.Container>
    </styled.Inner>
  );
};

export default observer(LiveStreamPage);
