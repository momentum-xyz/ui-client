import {FC} from 'react';
import {Button, ErrorBoundary} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {
  PluginInterface,
  PluginPropsInterface,
  ObjectGlobalPropsContextProvider
} from '@momentum-xyz/sdk';

import {useStore} from 'shared/hooks';
import {PluginLoaderModelType} from 'core/models';

import * as styled from './AssignVideo.styled';

interface PropsInterface {
  objectId: string;
  plugin: PluginInterface;
  pluginLoader: PluginLoaderModelType;
  isEditing: boolean;
  onDelete: () => void;
  onBack: () => void;
  onSaved: () => void;
}

const AssignVideo: FC<PropsInterface> = ({
  objectId,
  isEditing,
  plugin,
  pluginLoader,
  onSaved,
  onDelete,
  onBack
}) => {
  const {universeStore} = useStore();
  const {attributesManager} = pluginLoader;

  const {t} = useI18n();
  const theme = useTheme();

  const isAdmin = universeStore.isCurrentUserWorldAdmin;

  if (!pluginLoader) {
    return null;
  }

  const pluginProps: PluginPropsInterface = {
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
            <PluginInnerWrapper
              pluginProps={pluginProps}
              plugin={plugin}
              isEditing={isEditing}
              onDelete={onDelete}
              onSaved={onSaved}
              onBack={onBack}
            />
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
  isEditing,
  onSaved,
  onDelete,
  onBack
}: {
  pluginProps: PluginPropsInterface;
  plugin: PluginInterface;
  onSaved: () => void;
  isEditing: boolean;
  onDelete: () => void;
  onBack: () => void;
}) => {
  const {objectView} = plugin.usePlugin(pluginProps);
  const {editModeContent, saveChanges} = objectView || {};

  const {t} = useI18n();

  return (
    <>
      {!editModeContent ? (
        <div>
          This version of <strong>plugin_video</strong> doesn't support edit
        </div>
      ) : (
        <>
          {editModeContent}

          <styled.ActionBar>
            <Button variant="secondary" label={t('actions.back')} onClick={onBack} />

            {isEditing && (
              <Button variant="secondary" label={t('actions.delete')} onClick={onDelete} />
            )}

            <Button
              label={isEditing ? t('actions.save') : t('actions.embed')}
              onClick={() => {
                saveChanges?.().catch((err) => {
                  console.error(err);
                });
                onSaved();
              }}
            />
          </styled.ActionBar>
        </>
      )}
    </>
  );
};

export default observer(AssignVideo);
