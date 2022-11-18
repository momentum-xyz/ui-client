import {FC, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {ErrorBoundary, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {PluginInterface} from '@momentum-xyz/sdk';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SpacePage, SpaceTopBar, ToastContent} from 'ui-kit';
import {StreamChat} from 'scenes/collaboration/components';
import {PluginLoaderModelType} from 'core/models';
import {PosBusService} from 'shared/services';

import * as styled from './CollaborationPluginPage.styled';

interface PropsInterface {
  plugin: PluginInterface;
  pluginLoader: PluginLoaderModelType;
}

const CollaborationPluginPage: FC<PropsInterface> = ({plugin, pluginLoader}) => {
  const {collaborationStore, mainStore, leaveMeetingSpace} = useStore();
  const {spaceStore, streamChatStore} = collaborationStore;
  const {favoriteStore} = mainStore;
  const {attributesManager} = pluginLoader;

  const history = useHistory();
  const theme = useTheme();
  const {t} = useTranslation();

  useEffect(() => {
    PosBusService.subscribe(pluginLoader.id);

    return () => {
      PosBusService.unsubscribe(pluginLoader.id);
    };
  }, [pluginLoader.id]);

  useEffect(() => {
    if (pluginLoader.isErrorWhileLoadingDynamicScript) {
      toast.error(
        <ToastContent
          isDanger
          showCloseButton
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('errors.failedToLoadDynamicScript', {url: pluginLoader.scriptUrl})}
        />
      );
    }
  }, [pluginLoader.isErrorWhileLoadingDynamicScript, pluginLoader.scriptUrl, t]);

  const {content, topBar, subtitle} = plugin.usePlugin({
    theme,
    isSpaceAdmin: spaceStore.isAdmin,
    spaceId: spaceStore.id,
    pluginApi: attributesManager.pluginApi,
    api: attributesManager.api
  });

  return (
    <SpacePage dataTestId="SpacePlugin-test">
      <SpaceTopBar
        title={spaceStore.space?.name ?? ''}
        subtitle={subtitle}
        isAdmin={spaceStore.isAdmin}
        spaceId={spaceStore.id}
        isSpaceFavorite={favoriteStore.isFavorite(spaceStore.id)}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        isChatOpen={streamChatStore.isOpen}
        toggleChat={streamChatStore.textChatDialog.toggle}
        numberOfUnreadMessages={streamChatStore.numberOfUnreadMessages}
        editSpaceHidden
        onLeave={async () => {
          await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
      >
        {topBar}
      </SpaceTopBar>
      <styled.Container>
        {!pluginLoader.isError ? (
          <ErrorBoundary errorMessage={t('errors.errorWhileLoadingPlugin')}>
            {content}
          </ErrorBoundary>
        ) : (
          <Text text={t('errors.errorWhileLoadingPlugin')} size="l" />
        )}
        {streamChatStore.isOpen && streamChatStore.client && streamChatStore.currentChannel && (
          <StreamChat client={streamChatStore.client} channel={streamChatStore.currentChannel} />
        )}
      </styled.Container>
    </SpacePage>
  );
};

export default observer(CollaborationPluginPage);
