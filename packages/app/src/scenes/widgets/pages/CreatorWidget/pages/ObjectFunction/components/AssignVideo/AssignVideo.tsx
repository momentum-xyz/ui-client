import React, {FC, MutableRefObject} from 'react';
import {ErrorBoundary} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import {
  PluginInterface,
  PluginPropsInterface,
  ObjectGlobalPropsContextProvider
} from '@momentum-xyz/sdk';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';

import {PluginLoaderModelType} from 'core/models';
import {useStore} from 'shared/hooks';

import * as styled from './AssignVideo.styled';

interface PropsInterface {
  actionRef: MutableRefObject<{doSave: () => void}>;
  objectId: string;
  plugin: PluginInterface;
  pluginLoader: PluginLoaderModelType;
}

const AssignVideo: FC<PropsInterface> = ({actionRef, objectId, plugin, pluginLoader}) => {
  const {universeStore} = useStore();
  const {attributesManager} = pluginLoader;

  const {t} = useI18n();
  const theme = useTheme();

  const isAdmin = universeStore.isCurrentUserWorldAdmin;

  if (!pluginLoader) {
    return null;
  }

  const pluginProps: PluginPropsInterface = {
    // @ts-ignore: FIXME
    theme,
    isAdmin,
    isExpanded: pluginLoader.isExpanded,
    onToggleExpand: pluginLoader.toggleIsExpanded,
    objectId,
    pluginApi: attributesManager.pluginApi,
    api: attributesManager.api,
    onClose: () => {}
  };

  return (
    <styled.Container>
      <ErrorBoundary errorMessage={t('errors.errorWhileLoadingPlugin')}>
        <ObjectGlobalPropsContextProvider props={pluginProps}>
          {!pluginLoader?.isError ? (
            <PluginInnerWrapper pluginProps={pluginProps} plugin={plugin} actionRef={actionRef} />
          ) : (
            t('errors.errorWhileLoadingPlugin')
          )}
        </ObjectGlobalPropsContextProvider>
      </ErrorBoundary>
    </styled.Container>
  );
};

const PluginInnerWrapper = ({
  pluginProps,
  plugin,
  actionRef
}: {
  pluginProps: PluginPropsInterface;
  plugin: PluginInterface;
  actionRef: React.MutableRefObject<{doSave: () => void}>;
}) => {
  const {objectView} = plugin.usePlugin(pluginProps);
  const {editModeContent, saveChanges} = objectView || {};

  actionRef.current = {
    doSave: () =>
      saveChanges &&
      saveChanges().catch((err) => {
        console.error(err);
      })
  };

  return (
    <>
      {editModeContent || (
        <div>
          This version of <strong>plugin_video</strong> doesn't support edit
        </div>
      )}
    </>
  );
};

export default observer(AssignVideo);
