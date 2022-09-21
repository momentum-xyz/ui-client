import {FC} from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SpaceTopBar, TextChat} from 'ui-kit';

import * as styled from './CollaborationPluginPage.styled';

const CollaborationPluginPage: FC = ({children}) => {
  const {collaborationStore, mainStore, sessionStore, leaveMeetingSpace} = useStore();
  const {space, textChatStore} = collaborationStore;
  const {favoriteStore} = mainStore;

  const history = useHistory();

  if (!space) {
    return null;
  }

  return (
    <styled.Inner>
      <SpaceTopBar
        title={space.name ?? ''}
        // TODO: Take that from API
        subtitle="Miro document"
        isAdmin={space.isAdmin}
        spaceId={space?.id}
        isSpaceFavorite={favoriteStore.isFavorite(space.id)}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        isChatOpen={textChatStore.textChatDialog.isOpen}
        toggleChat={textChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={textChatStore.numberOfUnreadMessages}
        editSpaceHidden
        onLeave={async () => {
          await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
      >
        {/* TODO: Implement */}
        {/* {space.isAdmin && !!googleDocument?.data?.url && (
          <>
            <Button label={t('actions.changeDocument')} variant="primary" onClick={pickDocument} />
            <Button label={t('actions.close')} variant="danger" onClick={closeDocument} />
          </>
        )} */}
      </SpaceTopBar>
      <styled.Container>
        {children}
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

export default observer(CollaborationPluginPage);
