import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {ErrorBoundary, useMutableCallback} from '@momentum-xyz/ui-kit';
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
  onSaved: (success: boolean) => void;
}

// TODO remove
const AssignVideo: FC<PropsInterface> = ({
  objectId,
  isEditing,
  plugin,
  pluginLoader,
  onSaved,
  onDelete,
  onBack
}) => {
  return <styled.Container></styled.Container>;
};

export const useAssignVideo = ({
  objectId,
  plugin,
  pluginLoader
}: {
  objectId: string;
  plugin: PluginInterface | undefined;
  pluginLoader: PluginLoaderModelType | undefined;
}): {
  content: JSX.Element;
  isModified: boolean;
  isValid: boolean;
  save: () => Promise<void>;
  discardChanges: () => void;
  remove: () => Promise<void>;
} => {
  const {universeStore} = useStore();

  const {t} = useI18n();
  const theme = useTheme();

  const isAdmin = universeStore.isCurrentUserWorldAdmin;

  // if (!pluginLoader) {
  //   return null;
  // }

  const [isModified, setIsModified] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const pluginProps: PluginPropsInterface | null = pluginLoader
    ? {
        theme,
        isAdmin,
        isExpanded: pluginLoader.isExpanded,
        onToggleExpand: pluginLoader.toggleIsExpanded,
        objectId,
        pluginApi: pluginLoader.attributesManager.pluginApi,
        api: pluginLoader.attributesManager.api,
        onClose: () => {}
      }
    : null;

  console.log('useAssignVideo', pluginProps);

  const refControls = useRef<{
    save: () => Promise<void>;
    discardChanges: () => void;
    remove: () => Promise<void>;
  } | null>(null);

  const save = useCallback(async () => {
    await refControls.current?.save();
  }, []);

  const discardChanges = useCallback(() => {
    refControls.current?.discardChanges();
  }, []);

  const remove = useCallback(async () => {
    await refControls.current?.remove();
  }, []);

  const handleChange = (isModified: boolean | undefined, isValid: boolean | undefined) => {
    if (isModified !== undefined) {
      setIsModified(isModified);
    }
    if (isValid !== undefined) {
      setIsValid(isValid);
    }
  };

  const content = (
    <styled.Container>
      <ErrorBoundary errorMessage={t('errors.errorWhileLoadingPlugin')}>
        {!!plugin && !!pluginProps && (
          <ObjectGlobalPropsContextProvider props={pluginProps}>
            {!pluginLoader?.isError ? (
              <PluginInnerWrapper
                key={objectId}
                pluginProps={pluginProps}
                plugin={plugin}
                onChange={handleChange}
                refControls={refControls}
              />
            ) : (
              t('errors.errorWhileLoadingPlugin')
            )}
          </ObjectGlobalPropsContextProvider>
        )}
      </ErrorBoundary>
    </styled.Container>
  );

  return {
    content,
    isModified,
    isValid,
    save,
    discardChanges,
    remove
  };
};

const PluginInnerWrapper = ({
  pluginProps,
  plugin,
  onChange,
  refControls
}: {
  pluginProps: PluginPropsInterface;
  plugin: PluginInterface;
  onChange: (isModified: boolean, isValid: boolean) => void;
  refControls: React.MutableRefObject<{
    save: () => Promise<void>;
    discardChanges: () => void;
    remove: () => Promise<void>;
  } | null>;
}) => {
  const {objectView} = plugin.usePlugin(pluginProps);
  const {editModeContent, saveChanges, discardChanges, remove, isModified, isValid} =
    objectView || {};

  refControls.current = {
    save: async () => {
      console.log('PluginInnerWrapper: Save changes');
      if (!saveChanges) {
        throw new Error('No saveChanges function defined');
      }
      await saveChanges();
    },
    discardChanges: () => {
      console.log('PluginInnerWrapper: Discard changes');
      if (!discardChanges) {
        throw new Error('No discardChanges function defined');
      }
      discardChanges();
    },
    remove: async () => {
      console.log('PluginInnerWrapper: Remove');
      if (!remove) {
        throw new Error('No remove function defined');
      }
      await remove();
    }
  };

  const handleOnChange = useMutableCallback(onChange || (() => {}));

  useEffect(() => {
    if (isModified !== undefined && isValid !== undefined) {
      handleOnChange(isModified, isValid);
    }
  }, [isModified, isValid, handleOnChange]);

  return (
    <>
      {!editModeContent ? (
        <div>
          This version of <strong>plugin_video</strong> doesn't support edit
        </div>
      ) : (
        <>
          {editModeContent}

          {/* <styled.ActionBar>
            <Button variant="secondary" label={t('actions.back')} onClick={onBack} />

            {isEditing && (
              <Button variant="secondary" label={t('actions.delete')} onClick={onDelete} />
            )}

            <Button
              label={isEditing ? t('actions.save') : t('actions.embed')}
              onClick={async () => {
                try {
                  if (!saveChanges) {
                    throw new Error('plugin_video error: saveChanges method is not defined');
                  }

                  await saveChanges();
                  onSaved(true);
                } catch (err) {
                  onSaved(false);
                }
              }}
            />
          </styled.ActionBar> */}
        </>
      )}
    </>
  );
};

export default observer(AssignVideo);
