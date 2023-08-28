import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {toast} from 'react-toastify';
import cn from 'classnames';
import {ErrorBoundary} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import {
  PluginInterface,
  PluginPropsInterface,
  ObjectGlobalPropsContextProvider
} from '@momentum-xyz/sdk';

import {ToastContent} from 'ui-kit';
import {PluginLoaderModelType} from 'core/models';
import {PosBusService} from 'shared/services';

import * as styled from './PluginViewer.styled';

interface PropsInterface {
  objectId: string;
  plugin: PluginInterface;
  pluginLoader: PluginLoaderModelType;
  isAdmin: boolean;
  hideWhenUnset?: boolean;
  // onClose: () => void;
}

const PluginViewer: FC<PropsInterface> = ({
  plugin,
  pluginLoader,
  isAdmin,
  hideWhenUnset = false,
  objectId
}) => {
  const theme = useTheme();
  const {t} = useI18n();

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

  const pluginProps: PluginPropsInterface = {
    // @ts-ignore: FIXME
    theme,
    isAdmin,
    objectId,
    isExpanded: pluginLoader.isExpanded,
    onToggleExpand: pluginLoader.toggleIsExpanded,
    pluginApi: pluginLoader.attributesManager.pluginApi,
    api: pluginLoader.attributesManager.api,
    onClose: () => {}
  };

  return (
    <ErrorBoundary errorMessage={t('errors.errorWhileLoadingPlugin')}>
      <ObjectGlobalPropsContextProvider props={pluginProps}>
        <PluginInnerWrapper
          pluginProps={pluginProps}
          hideWhenUnset={hideWhenUnset}
          plugin={plugin}
          pluginLoader={pluginLoader}
        />
      </ObjectGlobalPropsContextProvider>
    </ErrorBoundary>
  );
};

const PluginInnerWrapper = ({
  pluginProps,
  hideWhenUnset,
  plugin,
  pluginLoader
}: {
  pluginProps: PluginPropsInterface;
  plugin: PluginInterface;
  pluginLoader: PluginLoaderModelType;
  hideWhenUnset: boolean;
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
        hideWhenUnset && objectView.isEmpty ? null : (
          <styled.Wrapper>
            <styled.HeadingWrapper>
              <styled.Title>{objectView.title}</styled.Title>
            </styled.HeadingWrapper>
            <styled.ContentWrapper>{objectView.content}</styled.ContentWrapper>
          </styled.Wrapper>
        )
      ) : (
        <div>{t('errors.errorPluginContactDev')}</div>
      )}
    </>
  ) : (
    <div>{t('errors.errorWhileLoadingPlugin')}</div>
  );
};

export default observer(PluginViewer);
