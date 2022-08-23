import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {SpaceTopBar, Button, TextChat} from 'ui-kit';
import {BroadcastStatusEnum} from 'core/enums';

import * as styled from './LiveStreamPage.styled';
import {VideoPanel} from './components';

const LiveStreamPage: FC = () => {
  const {mainStore, sessionStore, spaceAdminStore, collaborationStore} = useStore();
  const {space, textChatStore} = collaborationStore;
  const {broadcastStore} = spaceAdminStore;
  const {favoriteStore} = mainStore;

  if (!space) {
    return null;
  }

  return (
    <styled.Inner data-testid="LiveStreamPage-test">
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle="sub title"
        isAdmin={space.isAdmin}
        spaceId={space.id}
        isSpaceFavorite={favoriteStore.isFavorite(space?.id || '')}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        editSpaceHidden
        isChatOpen={textChatStore.textChatDialog.isOpen}
        toggleChat={textChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={textChatStore.numberOfUnreadMessages}
      >
        {broadcastStore.broadcastStatus === BroadcastStatusEnum.PLAY && space.isAdmin && (
          <Button
            label="stop streaming"
            variant="danger"
            onClick={() => broadcastStore.disableBroadcast(space?.id)}
          />
        )}
      </SpaceTopBar>
      <styled.Container>
        <VideoPanel />
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
