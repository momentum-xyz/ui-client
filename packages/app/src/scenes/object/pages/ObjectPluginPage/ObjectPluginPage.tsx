import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {ErrorBoundary, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {ObjectPluginPropsInterface, PluginInterface} from '@momentum-xyz/sdk';
import {generatePath, useHistory} from 'react-router-dom';

import {ToastContent} from 'ui-kit';
import {PluginLoaderModelType} from 'core/models';
import {PosBusService} from 'shared/services';
import {ROUTES} from 'core/constants';

interface PropsInterface {
  objectId: string;
  plugin: PluginInterface<ObjectPluginPropsInterface>;
  pluginLoader: PluginLoaderModelType;
}

const ObjectPluginPage: FC<PropsInterface> = ({plugin, pluginLoader, objectId}) => {
  const {attributesManager} = pluginLoader;

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
    isSpaceAdmin: true,
    spaceId: objectId,
    pluginApi: attributesManager.pluginApi,
    api: attributesManager.api,
    onClose: () => {
      history.push(generatePath(ROUTES.base, {spaceId: objectId}));
    }
  });

  return !pluginLoader.isError ? (
    <ErrorBoundary errorMessage={t('errors.errorWhileLoadingPlugin')}>{content}</ErrorBoundary>
  ) : (
    <Text text={t('errors.errorWhileLoadingPlugin')} size="l" />
  );
};

export default observer(ObjectPluginPage);
