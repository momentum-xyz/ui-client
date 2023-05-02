import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {ErrorBoundary, Heading, Text} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import {toast} from 'react-toastify';
import {
  PluginInterface,
  PluginPropsInterface,
  ObjectGlobalPropsContextProvider
} from '@momentum-xyz/sdk';
import {generatePath, useNavigate, useParams} from 'react-router-dom';
import cn from 'classnames';

import {ToastContent} from 'ui-kit';
import {PluginLoaderModelType} from 'core/models';
import {PosBusService} from 'shared/services';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './ObjectPluginPage.styled';

interface PropsInterface {
  objectId: string;
  plugin: PluginInterface;
  pluginLoader: PluginLoaderModelType;
}

const ObjectPluginPage: FC<PropsInterface> = ({plugin, pluginLoader, objectId}) => {
  const {universeStore} = useStore();
  const {attributesManager} = pluginLoader;

  const theme = useTheme();
  const {t} = useI18n();
  const navigate = useNavigate();

  const {worldId} = useParams<{worldId: string}>();

  const isAdmin = universeStore.isCurrentUserWorldAdmin;

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
          icon="stake"
          text={t('errors.failedToLoadDynamicScript', {url: pluginLoader.scriptUrl})}
        />
      );
    }
  }, [pluginLoader.isErrorWhileLoadingDynamicScript, pluginLoader.scriptUrl, t]);

  const onClose = () => {
    navigate(generatePath(ROUTES.odyssey.base, {worldId}));
  };

  const pluginProps: PluginPropsInterface = {
    // @ts-ignore: FIXME
    theme,
    isAdmin,
    isExpanded: pluginLoader.isExpanded,
    onToggleExpand: pluginLoader.toggleIsExpanded,
    objectId,
    pluginApi: attributesManager.pluginApi,
    api: attributesManager.api,
    onClose
  };

  return (
    <ErrorBoundary errorMessage={t('errors.errorWhileLoadingPlugin')}>
      <ObjectGlobalPropsContextProvider props={pluginProps}>
        <PluginInnerWrapper pluginProps={pluginProps} plugin={plugin} pluginLoader={pluginLoader} />
      </ObjectGlobalPropsContextProvider>
    </ErrorBoundary>
  );
};

const PluginInnerWrapper = ({
  pluginProps,
  plugin,
  pluginLoader
}: {
  pluginProps: PluginPropsInterface;
  plugin: PluginInterface;
  pluginLoader: PluginLoaderModelType;
}) => {
  const {t} = useI18n();

  const {content, objectView} = plugin.usePlugin(pluginProps);

  return !pluginLoader.isError ? (
    <>
      {content ? (
        <styled.Container className={cn(pluginLoader.isExpanded && 'expanded')}>
          {content}
        </styled.Container>
      ) : objectView ? (
        <>
          <Heading type="h3" label={objectView.title || ''} align="left" transform="uppercase" />
          {objectView.content}
        </>
      ) : (
        <Text text={t('errors.errorPluginContactDev')} size="l" />
      )}
    </>
  ) : (
    <Text text={t('errors.errorWhileLoadingPlugin')} size="l" />
  );
};

export default observer(ObjectPluginPage);
