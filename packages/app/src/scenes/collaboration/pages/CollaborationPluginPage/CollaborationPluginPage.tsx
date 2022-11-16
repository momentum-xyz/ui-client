import {FC, useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {PluginTopBarActionInterface, SpaceGlobalPropsContextProvider} from '@momentum-xyz/sdk';
import {ErrorBoundary, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SpacePage, SpaceTopBar, ToastContent} from 'ui-kit';
import {StreamChat} from 'scenes/collaboration/components';
import {PluginLoaderModelType} from 'core/models';
import {PosBusService} from 'shared/services';

import * as styled from './CollaborationPluginPage.styled';

interface PropsInterface {
  pluginLoader: PluginLoaderModelType;
}

const CollaborationPluginPage: FC<PropsInterface> = ({pluginLoader}) => {
  const {collaborationStore, mainStore, leaveMeetingSpace} = useStore();
  const {spaceStore, streamChatStore} = collaborationStore;
  const {favoriteStore, pluginsStore} = mainStore;
  const {plugin, attributesManager} = pluginLoader;

  const history = useHistory();
  const theme = useTheme();
  const [actions, setActions] = useState<PluginTopBarActionInterface>({main: () => null});
  const {t} = useTranslation();

  const isDynamicScriptLoaded =
    pluginsStore.dynamicScriptsStore.getScript(pluginLoader.scopeName)?.isLoaded ?? false;

  pluginsStore.loadPluginIfNeeded(pluginLoader, isDynamicScriptLoaded);

  const renderTopBarActions = useCallback((actions: PluginTopBarActionInterface) => {
    console.info('Recieved actions', actions);
    setActions(actions);
  }, []);

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

  if (!spaceStore) {
    return null;
  }

  return (
    <SpacePage dataTestId="SpacePlugin-test">
      <SpaceTopBar
        title={spaceStore.space?.name ?? ''}
        subtitle={pluginLoader.subtitle}
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
        <actions.main />
      </SpaceTopBar>
      <styled.Container>
        {!pluginLoader.isError ? (
          plugin?.SpaceExtension ? (
            <ErrorBoundary errorMessage={t('errors.errorWhileLoadingPlugin')}>
              <SpaceGlobalPropsContextProvider
                props={{
                  theme,
                  isSpaceAdmin: spaceStore.isAdmin,
                  spaceId: spaceStore.id,
                  pluginApi: attributesManager.pluginApi,
                  api: attributesManager.api,
                  renderTopBarActions
                }}
              >
                <plugin.SpaceExtension />
              </SpaceGlobalPropsContextProvider>
            </ErrorBoundary>
          ) : (
            <Text text={t('messages.loadingPlugin')} size="l" />
          )
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
