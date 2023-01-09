import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {ErrorBoundary, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {ObjectPluginPropsInterface, PluginInterface} from '@momentum-xyz/sdk';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import cn from 'classnames';

import {ToastContent} from 'ui-kit';
import {PluginLoaderModelType} from 'core/models';
import {PosBusService} from 'shared/services';
import {ROUTES} from 'core/constants';

import * as styled from './ObjectPluginPage.styled';

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

  const {worldId} = useParams<{worldId: string}>();

  useEffect(() => {
    PosBusService.subscribe(pluginLoader.pluginId);

    return () => {
      PosBusService.unsubscribe(pluginLoader.pluginId);
    };
  }, [pluginLoader.pluginId]);

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
    isAdmin: true,
    isExpanded: pluginLoader.isExpanded,
    onToggleExpand: pluginLoader.toggleIsExpanded,
    objectId,
    pluginApi: attributesManager.pluginApi,
    api: attributesManager.api,
    onClose: () => {
      history.push(generatePath(ROUTES.odyssey.base, {worldId}));
    }
  });

  return !pluginLoader.isError ? (
    <styled.Wrapper>
      <styled.Container className={cn(pluginLoader.isExpanded && 'expanded')}>
        <ErrorBoundary errorMessage={t('errors.errorWhileLoadingPlugin')}>{content}</ErrorBoundary>
      </styled.Container>
    </styled.Wrapper>
  ) : (
    <Text text={t('errors.errorWhileLoadingPlugin')} size="l" />
  );
};

export default observer(ObjectPluginPage);
