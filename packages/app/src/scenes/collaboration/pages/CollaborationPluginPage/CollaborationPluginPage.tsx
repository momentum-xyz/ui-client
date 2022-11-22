import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {ErrorBoundary, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {ObjectPluginPropsInterface, PluginInterface} from '@momentum-xyz/sdk';
import {generatePath, useHistory} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';
import {PluginLoaderModelType} from 'core/models';
import {PosBusService} from 'shared/services';
import {ROUTES} from 'core/constants';

interface PropsInterface {
  plugin: PluginInterface<ObjectPluginPropsInterface>;
  pluginLoader: PluginLoaderModelType;
}

const CollaborationPluginPage: FC<PropsInterface> = ({plugin, pluginLoader}) => {
  const {collaborationStore} = useStore();
  const {spaceStore} = collaborationStore;
  const {attributesManager} = pluginLoader;
  const {space} = spaceStore;

  const theme = useTheme();
  const {t} = useTranslation();
  const history = useHistory();

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

  const {content} = plugin.usePlugin({
    theme,
    isSpaceAdmin: spaceStore.isAdmin,
    spaceId: space?.id,
    pluginApi: attributesManager.pluginApi,
    api: attributesManager.api,
    onClose: () => {
      if (!space) {
        return;
      }
      history.push(generatePath(ROUTES.base, {spaceId: space.id}));
    }
  });

  return !pluginLoader.isError ? (
    <ErrorBoundary errorMessage={t('errors.errorWhileLoadingPlugin')}>{content}</ErrorBoundary>
  ) : (
    <Text text={t('errors.errorWhileLoadingPlugin')} size="l" />
  );
};

export default observer(CollaborationPluginPage);
