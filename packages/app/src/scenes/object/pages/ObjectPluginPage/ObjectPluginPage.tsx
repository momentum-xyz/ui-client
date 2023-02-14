import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {
  ErrorBoundary,
  ScreenSectionsEnum,
  SectionedScreenPortal,
  Text,
  WindowPanel
} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {
  PluginInterface,
  PluginPropsInterface,
  ObjectGlobalPropsContextProvider
} from '@momentum-xyz/sdk';
import {generatePath, useHistory, useParams} from 'react-router-dom';
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
  const {unityStore} = useStore();
  const {attributesManager} = pluginLoader;

  const theme = useTheme();
  const {t} = useTranslation();
  const history = useHistory();

  const {worldId} = useParams<{worldId: string}>();

  const isAdmin = unityStore.isCurrentUserWorldAdmin;

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

  const onClose = () => {
    history.push(generatePath(ROUTES.odyssey.base, {worldId}));
  };

  const pluginProps: PluginPropsInterface = {
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
  const {t} = useTranslation();

  const {content, objectView} = plugin.usePlugin(pluginProps);

  return !pluginLoader.isError ? (
    <SectionedScreenPortal
      data-testid="ObjectPluginPage-test"
      section={
        pluginLoader.isExpanded ? ScreenSectionsEnum.TOP_LEFT : ScreenSectionsEnum.BOTTOM_RIGHT
      }
      maximized={pluginLoader.isExpanded}
    >
      {content ? (
        <styled.Container className={cn(pluginLoader.isExpanded && 'expanded')}>
          {content}
        </styled.Container>
      ) : objectView ? (
        <WindowPanel
          title={objectView.title || ''}
          subtitle={objectView.subtitle}
          actions={objectView.actions}
          initialIsExpanded={pluginLoader.isExpanded}
          onToggleExpand={pluginProps.onToggleExpand}
          onClose={pluginProps.onClose}
        >
          {objectView.content}
        </WindowPanel>
      ) : (
        <Text text={t('errors.errorPluginContactDev')} size="l" />
      )}
    </SectionedScreenPortal>
  ) : (
    <Text text={t('errors.errorWhileLoadingPlugin')} size="l" />
  );
};

export default observer(ObjectPluginPage);
