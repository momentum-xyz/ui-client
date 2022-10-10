import {FC, useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {PluginTopBarActionInterface} from '@momentum/sdk';
import {Text} from '@momentum/ui-kit';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SpaceTopBar, TextChat} from 'ui-kit';
import {CollaborationPluginInterface} from 'scenes/collaboration/stores/CollaborationPluginsStore/models';
import {request} from 'api/request';
import {useDynamicScript} from 'shared/hooks';

import * as styled from './CollaborationPluginPage.styled';

interface PropsInterface {
  plugin: CollaborationPluginInterface;
}

const CollaborationPluginPage: FC<PropsInterface> = ({plugin}) => {
  const {collaborationStore, mainStore, sessionStore, leaveMeetingSpace} = useStore();
  const {space, textChatStore} = collaborationStore;
  const {favoriteStore} = mainStore;
  const {ready, failed} = useDynamicScript(module && plugin.url);

  const history = useHistory();
  const theme = useTheme();
  const [actions, setActions] = useState<PluginTopBarActionInterface>({main: () => null});
  const {t} = useTranslation();

  const renderTopBarActions = useCallback((actions: PluginTopBarActionInterface) => {
    console.info('Recieved actions', actions);
    setActions(actions);
  }, []);

  useEffect(() => {
    if (ready && !failed) {
      plugin.init();
    }
  }, [plugin, ready, failed]);

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
        {!failed ? (
          ready && plugin.Component ? (
            <plugin.Component
              theme={theme}
              isSpaceAdmin={space.isAdmin}
              spaceId={space.id}
              request={request}
              renderTopBarActions={renderTopBarActions}
            />
          ) : (
            <Text text={t('messages.loadingPlugin')} size="l" />
          )
        ) : (
          <Text text={t('errors.failedToLoadDynamicScript', {url: plugin.url})} size="l" />
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

export default observer(CollaborationPluginPage);
