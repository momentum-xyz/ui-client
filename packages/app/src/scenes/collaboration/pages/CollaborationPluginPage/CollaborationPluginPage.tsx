import {FC, useCallback, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {PluginTopBarActionInterface, PluginTypeEnum} from '@momentum/sdk';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SpaceTopBar, TextChat} from 'ui-kit';
import {PluginLoader} from 'shared/hooks/pluginLoader';
import {CollaborationPluginInterface} from 'scenes/collaboration/stores/CollaborationPluginsStore/models';
import {request} from 'api/request';

import * as styled from './CollaborationPluginPage.styled';

interface PropsInterface {
  plugin: CollaborationPluginInterface;
}

const CollaborationPluginPage: FC<PropsInterface> = ({plugin}) => {
  const {collaborationStore, mainStore, sessionStore, leaveMeetingSpace} = useStore();
  const {space, textChatStore} = collaborationStore;
  const {favoriteStore} = mainStore;

  const history = useHistory();
  const theme = useTheme();
  const [actions, setActions] = useState<PluginTopBarActionInterface>({main: () => null});

  const renderTopBarActions = useCallback((actions: PluginTopBarActionInterface) => {
    console.info('Recieved actions', actions);
    setActions(actions);
  }, []);

  if (!space) {
    return null;
  }

  return (
    <styled.Inner>
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle={plugin.subtitle}
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
        <actions.main />
      </SpaceTopBar>
      <styled.Container>
        <PluginLoader
          url={plugin.url}
          pluginType={PluginTypeEnum.SPACE}
          props={{
            theme,
            isSpaceAdmin: space.isAdmin,
            spaceId: space.id,
            request: request,
            renderTopBarActions
          }}
        />
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
