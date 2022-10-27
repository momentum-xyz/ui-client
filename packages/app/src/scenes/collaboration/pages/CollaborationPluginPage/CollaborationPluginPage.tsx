import {FC, useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {PluginTopBarActionInterface} from '@momentum-xyz/sdk';
import {ErrorBoundary, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SpacePage, SpaceTopBar, ToastContent} from 'ui-kit';
import {StreamChat} from 'scenes/collaboration/components';
import {PluginLoaderModelType} from 'core/models';
import {api} from 'api';

import * as styled from './CollaborationPluginPage.styled';

interface PropsInterface {
  pluginLoader: PluginLoaderModelType;
}

const CollaborationPluginPage: FC<PropsInterface> = ({pluginLoader}) => {
  const {collaborationStore, mainStore, leaveMeetingSpace} = useStore();
  const {space, streamChatStore} = collaborationStore;
  const {favoriteStore, pluginsStore, worldStore} = mainStore;
  const {plugin} = pluginLoader;

  const history = useHistory();
  const theme = useTheme();
  const [actions, setActions] = useState<PluginTopBarActionInterface>({main: () => null});
  const {t} = useTranslation();

  pluginsStore.loadPluginIfNeeded(pluginLoader);

  const renderTopBarActions = useCallback((actions: PluginTopBarActionInterface) => {
    console.info('Recieved actions', actions);
    setActions(actions);
  }, []);

  const setSharedState = async (field: string, value: unknown) => {
    if (!space?.id) {
      return;
    }

    await pluginLoader.sharedState.set(
      api.spaceAttributeRepository.setSpaceSubAttribute,
      {
        worldId: worldStore.worldId,
        spaceId: space.id
      },
      field,
      value
    );
  };

  const init = async (options: {fields: string[]}) => {
    if (!space?.id) {
      return;
    }

    await pluginLoader.sharedState.init(
      api.spaceAttributeRepository.getSpaceSubAttribute,
      {
        worldId: worldStore.worldId,
        spaceId: space.id
      },
      pluginLoader.id,
      options.fields
    );
  };

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

  if (!space) {
    return null;
  }

  return (
    <SpacePage dataTestId="SpacePlugin-test">
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle={pluginLoader.subtitle}
        isAdmin={space.isAdmin}
        spaceId={space?.id}
        isSpaceFavorite={favoriteStore.isFavorite(space.id)}
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
              <plugin.SpaceExtension
                theme={theme}
                isSpaceAdmin={space.isAdmin}
                spaceId={space.id}
                init={init}
                reload={async () => {
                  await pluginLoader.sharedState.reload();
                }}
                sharedState={pluginLoader.sharedState.data}
                setSharedState={setSharedState}
                renderTopBarActions={renderTopBarActions}
              />
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
